import { useState } from 'react'
import { Card, Form, Button, Alert, Badge, Accordion, Tabs, Tab } from 'react-bootstrap'

interface TestExample {
    label: string
    description: string
    input: object
    shouldPass: boolean
}

interface TestPanelProps {
    toolName: string
    examples: TestExample[]
    onExecute: (input: object) => Promise<{ success: boolean; message?: string; errors?: any }>
}

export default function TestPanel({ toolName, examples, onExecute }: TestPanelProps) {
    const [selectedExample, setSelectedExample] = useState<number>(0)
    const [customInput, setCustomInput] = useState<string>(JSON.stringify(examples[0].input, null, 2))
    const [result, setResult] = useState<{ success: boolean; message?: string; errors?: any } | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleTest = async () => {
        setIsLoading(true)
        setResult(null)

        try {
            const input = JSON.parse(customInput)
            const res = await onExecute(input)
            setResult(res)
        } catch (error: any) {
            setResult({
                success: false,
                message: 'Invalid JSON format',
                errors: error.message
            })
        } finally {
            setIsLoading(false)
        }
    }

    const loadExample = (index: number) => {
        setSelectedExample(index)
        setCustomInput(JSON.stringify(examples[index].input, null, 2))
        setResult(null)
    }

    return (
        <Card className="shadow-sm mt-4">
            <Card.Header className="bg-dark text-white">
                <h5 className="mb-0">
                    <i className="bi bi-play-circle"></i> Interactive Testing Panel
                </h5>
                <small className="text-light">Test the form without using browser inspector</small>
            </Card.Header>
            <Card.Body>
                <Tabs defaultActiveKey="builtin" className="mb-3">
                    <Tab eventKey="builtin" title={<><i className="bi bi-code-square"></i> Built-in Tester</>}>
                        {/* Example Selector */}
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">
                                <i className="bi bi-lightbulb"></i> Quick Examples
                            </Form.Label>
                            <div className="d-flex flex-wrap gap-2">
                                {examples.map((example, index) => (
                                    <Button
                                        key={index}
                                        variant={selectedExample === index ? 'primary' : 'outline-secondary'}
                                        size="sm"
                                        onClick={() => loadExample(index)}
                                    >
                                        {example.shouldPass ? (
                                            <Badge bg="success" className="me-1">✓</Badge>
                                        ) : (
                                            <Badge bg="danger" className="me-1">✗</Badge>
                                        )}
                                        {example.label}
                                    </Button>
                                ))}
                            </div>
                            {examples[selectedExample] && (
                                <Alert variant="info" className="mt-2 mb-0 small">
                                    <strong>Description:</strong> {examples[selectedExample].description}
                                </Alert>
                            )}
                        </Form.Group>

                        {/* Input Editor */}
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">
                                <i className="bi bi-code-square"></i> Tool Input (JSON)
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={12}
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                style={{
                                    fontFamily: 'monospace',
                                    fontSize: '0.85rem',
                                    backgroundColor: '#1e1e1e',
                                    color: '#d4d4d4',
                                    border: '1px solid #444'
                                }}
                            />
                            <Form.Text className="text-muted">
                                Tool name: <code className="text-primary">{toolName}</code>
                            </Form.Text>
                        </Form.Group>

                        {/* Execute Button */}
                        <div className="d-grid gap-2 mb-3">
                            <Button
                                variant="success"
                                size="lg"
                                onClick={handleTest}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Testing...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-play-fill"></i> Run Test
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Result Display */}
                        {result && (
                            <Alert variant={result.success ? 'success' : 'danger'} className="mb-0">
                                <Alert.Heading className="h6">
                                    {result.success ? (
                                        <>
                                            <i className="bi bi-check-circle-fill"></i> Success!
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-exclamation-triangle-fill"></i> Validation Failed
                                        </>
                                    )}
                                </Alert.Heading>
                                {result.message && <p className="mb-2">{result.message}</p>}
                                {result.errors && (
                                    <div className="mt-2">
                                        <strong>Errors:</strong>
                                        <pre className="bg-dark text-light p-2 rounded mt-2 mb-0" style={{ fontSize: '0.75rem' }}>
                      {typeof result.errors === 'string'
                          ? result.errors
                          : JSON.stringify(result.errors, null, 2)}
                    </pre>
                                    </div>
                                )}
                            </Alert>
                        )}
                    </Tab>

                    <Tab eventKey="extension" title={<><i className="bi bi-puzzle"></i> Chrome Extension</>}>
                        <Alert variant="primary">
                            <Alert.Heading className="h6">
                                <i className="bi bi-chrome"></i> Use the WebMCP Inspector Extension
                            </Alert.Heading>
                            <p>For a more powerful testing experience, install the official Chrome extension:</p>
                            <ol className="mb-3">
                                <li>
                                    Install: <a
                                    href="https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="fw-bold"
                                >
                                    WebMCP Inspector Extension
                                </a>
                                </li>
                                <li>
                                    Enable Chrome flag: <code>chrome://flags/#enable-webmcp-testing</code>
                                    <br />
                                    <small className="text-muted">(Requires Chrome 146+)</small>
                                </li>
                                <li>Click the extension icon to open the side panel</li>
                                <li>See all registered tools and test them interactively!</li>
                            </ol>
                            <div className="d-grid">
                                <Button
                                    variant="primary"
                                    href="https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="bi bi-download"></i> Install Chrome Extension
                                </Button>
                            </div>
                        </Alert>

                        <Card className="bg-light">
                            <Card.Body>
                                <h6 className="fw-bold">
                                    <i className="bi bi-stars"></i> Extension Features:
                                </h6>
                                <ul className="mb-0">
                                    <li>Lists all WebMCP tools registered on the page</li>
                                    <li>Shows tool schemas and validation rules</li>
                                    <li>Execute tools with custom JSON input</li>
                                    <li>Real-time testing and debugging</li>
                                    <li>Badge showing count of available tools</li>
                                    <li>Integrates with Gemini AI for intelligent testing</li>
                                </ul>
                            </Card.Body>
                        </Card>
                    </Tab>
                </Tabs>

                {/* How to Use */}
                <Accordion className="mt-3">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            <i className="bi bi-question-circle me-2"></i>
                            How does this work?
                        </Accordion.Header>
                        <Accordion.Body>
                            <p>This panel simulates how an AI assistant would interact with your form through the Model Context Protocol (MCP):</p>

                            <h6 className="fw-bold mt-3">Built-in Tester:</h6>
                            <ol>
                                <li><strong>Select an example</strong> or edit the JSON input manually</li>
                                <li><strong>Click "Run Test"</strong> to execute the tool</li>
                                <li><strong>View the result</strong> to see if validation passed or failed</li>
                            </ol>

                            <h6 className="fw-bold mt-3">Chrome Extension:</h6>
                            <ol>
                                <li><strong>Install the extension</strong> from Chrome Web Store</li>
                                <li><strong>Open the side panel</strong> by clicking the extension icon</li>
                                <li><strong>Browse all tools</strong> registered on this page</li>
                                <li><strong>Test any tool</strong> with custom inputs</li>
                            </ol>

                            <p className="mb-0">
                                In production, the AI would send these exact JSON payloads to fill, validate, or submit your forms.
                            </p>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Card.Body>
        </Card>
    )
}