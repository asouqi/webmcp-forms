import { useState } from 'react'
import { Row, Col, Card, Form, Button, Alert, Badge, Accordion } from 'react-bootstrap'
import { JsonValue, ModelContextToolInfo } from '@mcp-b/webmcp-types'

interface ToolTest {
    toolName: string
    input: string
    enabled: boolean
}

interface ValidationError {
    field?: string
    message: string
    path?: string[]
    code?: string
}

interface TestResult {
    toolName: string
    success: boolean
    message: string
    output?: JsonValue
    errors?: ValidationError[]
}

export default function ToolsTester() {
    const [tests, setTests] = useState<ToolTest[]>([
        {
            toolName: 'fill_demo_field',
            input: JSON.stringify({ field: 'name', value: 'John Doe' }, null, 2),
            enabled: true
        },
        {
            toolName: 'fill_demo_field',
            input: JSON.stringify({ field: 'email', value: 'john@example.com' }, null, 2),
            enabled: false
        },
        {
            toolName: 'validate_demo_form',
            input: '{}',
            enabled: false
        }
    ])

    const [results, setResults] = useState<TestResult[]>([])
    const [isRunning, setIsRunning] = useState(false)

    const availableTools = [
        'fill_demo_field',
        'fill_demo_multiple_fields',
        'get_demo_state',
        'get_demo_field_value',
        'validate_demo_form',
        'submit_demo_form',
        'clear_demo_field',
        'reset_demo_form'
    ]

    const addTest = () => {
        setTests([...tests, {
            toolName: availableTools[0],
            input: '{}',
            enabled: true
        }])
    }

    const removeTest = (index: number) => {
        setTests(tests.filter((_, i) => i !== index))
    }

    const updateTest = (index: number, field: keyof ToolTest, value: unknown) => {
        const newTests = [...tests]
        newTests[index] = { ...newTests[index], [field]: value }
        setTests(newTests)
    }

    const parseOutput = (output: JsonValue): JsonValue => {
        // If output is a string, try to parse it as JSON
        if (typeof output === 'string') {
            try {
                return JSON.parse(output)
            } catch {
                return output
            }
        }
        return output
    }

    const isErrorResult = (parsedOutput: JsonValue): boolean => {
        if (typeof parsedOutput !== 'object' || parsedOutput === null) {
            return false
        }

        // Check for isError flag (MCP error response)
        if ('isError' in parsedOutput && parsedOutput.isError === true) {
            return true
        }

        // Check for validationFailed in structuredContent
        if ('structuredContent' in parsedOutput &&
            typeof parsedOutput.structuredContent === 'object' &&
            parsedOutput.structuredContent !== null) {

            const structured = parsedOutput.structuredContent as Record<string, unknown>

            // Check for validationFailed flag
            if ('validationFailed' in structured && structured.validationFailed === true) {
                return true
            }

            // Check for isValid: false (for validation tools)
            if ('isValid' in structured && structured.isValid === false) {
                return true
            }
        }

        return false
    }

    const runTests = async () => {
        setIsRunning(true)
        setResults([])
        const newResults: TestResult[] = []

        // Check if modelContext is available
        if (!document.modelContext && !navigator.modelContextTesting) {
            newResults.push({
                toolName: 'System',
                success: false,
                message: 'ModelContext not available. Tools may not be registered properly.'
            })
            setResults(newResults)
            setIsRunning(false)
            return
        }

        // Get all available tools
        let registeredTools: ModelContextToolInfo[]
        try {
            if (document.modelContext) {
                registeredTools = await document.modelContext.getTools()
            } else {
                registeredTools = navigator.modelContextTesting?.listTools() as ModelContextToolInfo[]
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to get tools'
            newResults.push({
                toolName: 'System',
                success: false,
                message: `Failed to retrieve tools: ${errorMessage}`
            })
            setResults(newResults)
            setIsRunning(false)
            return
        }

        for (const test of tests) {
            if (!test.enabled) continue

            try {
                const input = JSON.parse(test.input)

                // Find the tool by name
                const tool = registeredTools.find(t => t.name === test.toolName)

                if (!tool) {
                    throw new Error(`Tool "${test.toolName}" not found in registered tools`)
                }

                // Execute the tool based on available context
                if (document.modelContext) {
                    const result = await document.modelContext.executeTool(tool, input)
                    const parsedOutput = parseOutput(result)
                    const hasError = isErrorResult(parsedOutput)

                    newResults.push({
                        toolName: test.toolName,
                        success: !hasError,
                        message: hasError
                            ? 'Tool execution completed with validation errors'
                            : `Tool ${test.toolName} executed successfully`,
                        output: parsedOutput
                    })
                } else if (navigator.modelContextTesting) {
                    const result = await navigator.modelContextTesting.executeTool(tool.name, JSON.stringify(input))
                    const parsedOutput = parseOutput(result)
                    const hasError = isErrorResult(parsedOutput)

                    newResults.push({
                        toolName: test.toolName,
                        success: !hasError,
                        message: hasError
                            ? 'Tool execution completed with validation errors'
                            : `Tool ${test.toolName} executed successfully`,
                        output: parsedOutput
                    })
                }
            } catch (error: unknown) {
                let errorMessage = 'Execution failed'
                let errorDetails: ValidationError[] | undefined = undefined

                if (error instanceof Error) {
                    errorMessage = error.message

                    // Extract validation errors from Zod or other validators
                    const errorObj = error as unknown as Record<string, unknown>
                    if (errorObj.errors && Array.isArray(errorObj.errors)) {
                        errorDetails = errorObj.errors
                    } else if (errorObj.issues && Array.isArray(errorObj.issues)) {
                        errorDetails = errorObj.issues as ValidationError[]
                    }
                }

                newResults.push({
                    toolName: test.toolName,
                    success: false,
                    message: errorMessage,
                    errors: errorDetails
                })
            }
        }

        setResults(newResults)
        setIsRunning(false)
    }

    const loadExampleWorkflow = () => {
        setTests([
            {
                toolName: 'fill_demo_multiple_fields',
                input: JSON.stringify({
                    fields: {
                        name: 'Jane Smith',
                        email: 'jane@example.com',
                        age: 28,
                        interests: ['Technology'],
                        country: 'US'
                    }
                }, null, 2),
                enabled: true
            },
            {
                toolName: 'validate_demo_form',
                input: '{}',
                enabled: true
            },
            {
                toolName: 'get_demo_state',
                input: '{}',
                enabled: true
            },
            {
                toolName: 'submit_demo_form',
                input: '{}',
                enabled: true
            }
        ])
    }

    const loadInvalidExamples = () => {
        setTests([
            {
                toolName: 'fill_demo_field',
                input: JSON.stringify({ field: 'name', value: 'J' }, null, 2),
                enabled: true
            },
            {
                toolName: 'fill_demo_field',
                input: JSON.stringify({ field: 'email', value: 'not-an-email' }, null, 2),
                enabled: true
            },
            {
                toolName: 'get_demo_state',
                input: "{}",
                enabled: true
            },
            {
                toolName: 'validate_demo_form',
                input: '{}',
                enabled: true
            }
        ])
    }

    return (
        <>
            {/* Page Header */}
            <div className="mb-4">
                <h2 className="mb-2">Tools Tester</h2>
                <p className="text-muted mb-0">
                    Test multiple MCP tools in sequence. Build and execute complete workflows with real tool execution.
                </p>
            </div>

            {/* Info */}
            <Alert variant="success" className="mb-4">
                <div className="d-flex align-items-start">
                    <i className="bi bi-check-circle-fill me-2 mt-1"></i>
                    <div>
                        <strong className="d-block mb-1">Real Tool Execution</strong>
                        <p className="mb-2 small">
                            This tester uses actual MCP tools via <code>modelContext.executeTool()</code>. Tests will update the form
                            in the Interactive Demo tab and you'll see real validation results.
                        </p>
                        <div className="d-flex gap-2">
                            <Button variant="outline-success" size="sm" onClick={loadExampleWorkflow}>
                                <i className="bi bi-lightning"></i> Load Valid Workflow
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={loadInvalidExamples}>
                                <i className="bi bi-exclamation-triangle"></i> Load Invalid Examples
                            </Button>
                        </div>
                    </div>
                </div>
            </Alert>

            <Row>
                <Col lg={8}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Test Sequence</h5>
                        <Button variant="primary" size="sm" onClick={addTest}>
                            <i className="bi bi-plus-circle"></i> Add Test
                        </Button>
                    </div>

                    {tests.length === 0 && (
                        <Alert variant="light" className="text-center">
                            <i className="bi bi-inbox"></i> No tests added yet. Click "Add Test" to get started.
                        </Alert>
                    )}

                    {tests.map((test, index) => (
                        <Card key={index} className="mb-3 shadow-sm">
                            <Card.Header className="bg-light d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        type="checkbox"
                                        checked={test.enabled}
                                        onChange={(e) => updateTest(index, 'enabled', e.target.checked)}
                                        className="me-2"
                                    />
                                    <Badge bg={test.enabled ? 'success' : 'secondary'}>
                                        Test {index + 1}
                                    </Badge>
                                </div>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeTest(index)}
                                >
                                    <i className="bi bi-trash"></i>
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Tool Name</Form.Label>
                                    <Form.Select
                                        value={test.toolName}
                                        onChange={(e) => updateTest(index, 'toolName', e.target.value)}
                                        size="sm"
                                    >
                                        {availableTools.map(tool => (
                                            <option key={tool} value={tool}>{tool}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-0">
                                    <Form.Label className="small fw-bold">Input (JSON)</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        value={test.input}
                                        onChange={(e) => updateTest(index, 'input', e.target.value)}
                                        style={{
                                            fontFamily: 'monospace',
                                            fontSize: '0.85rem',
                                            backgroundColor: '#1e1e1e',
                                            color: '#d4d4d4',
                                            border: '1px solid #444'
                                        }}
                                    />
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    ))}

                    {tests.length > 0 && (
                        <div className="d-grid gap-2 mb-4">
                            <Button
                                variant="success"
                                size="lg"
                                onClick={runTests}
                                disabled={isRunning || tests.filter(t => t.enabled).length === 0}
                            >
                                {isRunning ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Running Tests...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-play-fill"></i> Run {tests.filter(t => t.enabled).length} Enabled Test(s)
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </Col>

                <Col lg={4}>
                    <h5 className="mb-3">Results</h5>

                    {results.length === 0 && (
                        <Alert variant="light" className="text-center small">
                            <i className="bi bi-hourglass-split"></i> Results will appear here after running tests
                        </Alert>
                    )}

                    {results.map((result, index) => (
                        <Card
                            key={index}
                            className={`mb-3 shadow-sm ${result.success ? 'border-success' : 'border-danger'}`}
                            style={{ borderWidth: '2px' }}
                        >
                            <Card.Header className={`text-white ${result.success ? 'bg-success' : 'bg-danger'}`}>
                                <div className="d-flex align-items-center justify-content-between">
                  <span className="small fw-bold">
                    <i className={`bi ${result.success ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1`}></i>
                    Test {index + 1}
                  </span>
                                    <Badge bg={result.success ? 'light' : 'dark'} text={result.success ? 'dark' : 'light'} className="small">
                                        {result.toolName}
                                    </Badge>
                                </div>
                            </Card.Header>
                            <Card.Body className={result.success ? 'bg-light' : 'bg-danger bg-opacity-10'}>
                                <div className="mb-3">
                                    <div className="d-flex align-items-start">
                                        <i className={`bi ${result.success ? 'bi-info-circle' : 'bi-exclamation-circle'} me-2 ${result.success ? 'text-success' : 'text-danger'}`}></i>
                                        <p className="small mb-0 fw-bold">{result.message}</p>
                                    </div>
                                </div>

                                {result.errors && result.errors.length > 0 && (
                                    <Alert variant="danger" className="mb-3 small">
                                        <div className="fw-bold mb-2">
                                            <i className="bi bi-exclamation-triangle-fill me-1"></i>
                                            Validation Errors:
                                        </div>
                                        <ul className="mb-0 ps-3">
                                            {result.errors.map((error, i) => (
                                                <li key={i}>
                                                    {error.field && <strong>{error.field}:</strong>} {error.message}
                                                    {error.path && error.path.length > 0 && (
                                                        <span className="text-muted ms-1">({error.path.join('.')})</span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </Alert>
                                )}

                                {result.output && (
                                    <Accordion>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>
                                                <small className="fw-bold">
                                                    <i className="bi bi-code-slash me-1"></i>
                                                    View Output
                                                </small>
                                            </Accordion.Header>
                                            <Accordion.Body>
                        <pre
                            className={`p-3 rounded mb-0 small ${result.success ? 'bg-dark text-light' : 'bg-danger bg-opacity-25 text-dark border border-danger'}`}
                            style={{
                                fontSize: '0.75rem',
                                maxHeight: '300px',
                                overflow: 'auto',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}
                        >
                          {JSON.stringify(result.output, null, 2)}
                        </pre>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                )}
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>

            {/* Chrome Extension Notice */}
            <Card className="mt-4 shadow-sm border-info">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={8}>
                            <h6 className="fw-bold mb-2">
                                <i className="bi bi-lightbulb text-info"></i> Tip: Use Chrome Extension for Enhanced Testing
                            </h6>
                            <p className="text-muted mb-0 small">
                                While this tester uses real tools via Model Context Protocol, the WebMCP Inspector Chrome Extension
                                provides additional features like tool discovery, schema inspection, and real-time debugging.
                            </p>
                        </Col>
                        <Col md={4} className="text-md-end">
                            <Button
                                variant="outline-info"
                                size="sm"
                                href="https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd"
                                target="_blank"
                            >
                                <i className="bi bi-download"></i> Install Extension
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </>
    )
}