import { useState } from 'react'
import { Row, Col, Card, Form, Badge, Alert, Button, InputGroup, Accordion } from 'react-bootstrap'
import { defineTool } from 'webmcp-adapter'
import { useTools } from 'webmcp-adapter-react'
import TestPanel from './TestPanel'
import { CustomFormSchema } from '../schemas/zodSchema'

const initialState = {
    projectAsset: '',
    brandColor: '#4A90E2',
    difficultyLevel: 5,
    tags: [] as string[],
    extraMetadata: {
        isPublic: true,
        priority: 'medium' as 'low' | 'medium' | 'high'
    },
    appointmentDate: '',
    projectFile: null as any
}

export default function AdvancedFormExample() {
    const [formData, setFormData] = useState(initialState)
    const [submitMessage, setSubmitMessage] = useState<string>('')
    const [tagInput, setTagInput] = useState('')

    const handleChange = (path: string, value: any) => {
        setFormData(prev => {
            const newState = { ...prev }

            if (path.includes('.')) {
                const [parent, child] = path.split('.')
                newState[parent as keyof typeof newState] = { ...(prev[parent as keyof typeof prev] as any), [child]: value }
            } else {
                newState[path as keyof typeof newState] = value
            }

            return newState
        })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            setFormData(prev => ({
                ...prev,
                projectFile: {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    content: reader.result as string
                }
            }))
        }
        reader.readAsDataURL(file)
    }

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            handleChange('tags', [...formData.tags, tagInput.trim()])
            setTagInput('')
        }
    }

    const removeTag = (tag: string) => {
        handleChange('tags', formData.tags.filter(t => t !== tag))
    }

    const handleSubmit = async () => {
        try {
            CustomFormSchema.parse(formData)
            setSubmitMessage('Advanced form submitted successfully! Check console for values.')
            console.log('Advanced form submitted:', formData)
            setTimeout(() => setSubmitMessage(''), 3000)
        } catch (error: any) {
            setSubmitMessage('Validation failed: ' + error.message)
            setTimeout(() => setSubmitMessage(''), 5000)
        }
    }

    const handleReset = () => {
        setFormData(initialState)
        setTagInput('')
    }

    useTools({
        tools: [
            defineTool({
                name: 'create_custom_project',
                description: 'Creates a project with color branding, tags, and file attachments.',
                inputSchema: CustomFormSchema.toJSONSchema() as any,
                validator: CustomFormSchema as any,
                execute: async (data) => {
                    setFormData(data as any)
                    return {
                        content: [{ type: 'text', text: 'Custom project created successfully!' }],
                        structuredContent: { success: true }
                    }
                }
            })
        ]
    })

    const testExamples = [
        {
            label: 'Valid Project',
            description: 'Complete valid project with all fields',
            input: {
                projectAsset: 'https://example.com/image.png',
                brandColor: '#FF5733',
                difficultyLevel: 7,
                tags: ['design', 'branding'],
                extraMetadata: {
                    isPublic: true,
                    priority: 'high'
                },
                appointmentDate: '2026-06-15',
                projectFile: {
                    name: 'logo.png',
                    size: 1024000,
                    type: 'image/png',
                    content: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
                }
            },
            shouldPass: true
        },
        {
            label: 'Invalid URL',
            description: 'Project asset must be a valid URL',
            input: {
                projectAsset: 'not-a-url',
                brandColor: '#FF5733',
                difficultyLevel: 5,
                tags: ['test'],
                extraMetadata: { isPublic: true, priority: 'medium' },
                appointmentDate: '2026-06-15',
                projectFile: {
                    name: 'test.png',
                    size: 1000,
                    type: 'image/png',
                    content: 'data:image/png;base64,iVBORw0K='
                }
            },
            shouldPass: false
        },
        {
            label: 'Invalid Color',
            description: 'Brand color must be valid hex format',
            input: {
                projectAsset: 'https://example.com/test.png',
                brandColor: 'not-a-color',
                difficultyLevel: 5,
                tags: ['test'],
                extraMetadata: { isPublic: true, priority: 'medium' },
                appointmentDate: '2026-06-15',
                projectFile: {
                    name: 'test.png',
                    size: 1000,
                    type: 'image/png',
                    content: 'data:image/png;base64,iVBORw0K='
                }
            },
            shouldPass: false
        },
        {
            label: 'Invalid Date (year)',
            description: 'Date must be in 2024-2026',
            input: {
                projectAsset: 'https://example.com/test.png',
                brandColor: '#FF5733',
                difficultyLevel: 5,
                tags: ['test'],
                extraMetadata: { isPublic: true, priority: 'medium' },
                appointmentDate: '2023-06-15',
                projectFile: {
                    name: 'test.png',
                    size: 1000,
                    type: 'image/png',
                    content: 'data:image/png;base64,iVBORw0K='
                }
            },
            shouldPass: false
        },
        {
            label: 'Invalid File Size',
            description: 'File must be under 5MB',
            input: {
                projectAsset: 'https://example.com/test.png',
                brandColor: '#FF5733',
                difficultyLevel: 5,
                tags: ['test'],
                extraMetadata: { isPublic: true, priority: 'medium' },
                appointmentDate: '2026-06-15',
                projectFile: {
                    name: 'huge-file.png',
                    size: 6000000,
                    type: 'image/png',
                    content: 'data:image/png;base64,iVBORw0K='
                }
            },
            shouldPass: false
        },
        {
            label: 'Too Many Tags',
            description: 'Maximum 5 tags allowed',
            input: {
                projectAsset: 'https://example.com/test.png',
                brandColor: '#FF5733',
                difficultyLevel: 5,
                tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6'],
                extraMetadata: { isPublic: true, priority: 'medium' },
                appointmentDate: '2026-06-15',
                projectFile: {
                    name: 'test.png',
                    size: 1000,
                    type: 'image/png',
                    content: 'data:image/png;base64,iVBORw0K='
                }
            },
            shouldPass: false
        }
    ]

    return (
        <>
            {/* Collapsible Info Alert */}
            <Accordion className="mb-4">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <i className="bi bi-award-fill me-2"></i>
                        <strong>What This Example Demonstrates</strong>
                    </Accordion.Header>
                    <Accordion.Body>
                        <p className="mb-2">
                            This form showcases <strong>advanced custom validation</strong> using a Zod schema with complex types and rules.
                        </p>
                        <Row className="mt-3">
                            <Col md={6}>
                                <strong>Advanced Features:</strong>
                                <ul className="mb-0 small">
                                    <li>✅ URL validation (projectAsset)</li>
                                    <li>✅ Hex color validation (#RRGGBB)</li>
                                    <li>✅ Range slider (difficulty 1-10)</li>
                                    <li>✅ Date constraints (year 2024-2026)</li>
                                </ul>
                            </Col>
                            <Col md={6}>
                                <strong>Complex Types:</strong>
                                <ul className="mb-0 small">
                                    <li>✅ File upload with size/type validation</li>
                                    <li>✅ Array of tags (min 2 chars, max 5 items)</li>
                                    <li>✅ Nested objects (extraMetadata)</li>
                                    <li>✅ Enum values (priority levels)</li>
                                </ul>
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            {submitMessage && (
                <Alert
                    variant={submitMessage.includes('success') ? 'success' : 'danger'}
                    dismissible
                    onClose={() => setSubmitMessage('')}
                >
                    <i className={`bi ${submitMessage.includes('success') ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i> {submitMessage}
                </Alert>
            )}

            {/* Top Section: Form + Test Panel Side by Side */}
            <Row className="mb-4">
                <Col lg={6}>
                    <h5 className="mb-3">
                        <i className="bi bi-gear"></i> Creative Project Form
                    </h5>

                    {/* Asset & Branding */}
                    <Card className="mb-3 shadow-sm">
                        <Card.Header className="bg-light">
                            <strong><i className="bi bi-palette"></i> Asset & Branding</strong>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Project Asset URL <Badge bg="danger">Required</Badge>
                                </Form.Label>
                                <Form.Control
                                    type="url"
                                    value={formData.projectAsset}
                                    onChange={(e) => handleChange('projectAsset', e.target.value)}
                                    placeholder="https://example.com/image.png"
                                />
                                <Form.Text className="text-muted">
                                    Must be a valid URL to an image or document
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-0">
                                <Form.Label>
                                    Brand Color <Badge bg="danger">Required</Badge>
                                </Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="color"
                                        value={formData.brandColor}
                                        onChange={(e) => handleChange('brandColor', e.target.value)}
                                        style={{ maxWidth: '80px' }}
                                    />
                                    <Form.Control
                                        type="text"
                                        value={formData.brandColor}
                                        onChange={(e) => handleChange('brandColor', e.target.value)}
                                        placeholder="#FF5733"
                                    />
                                </InputGroup>
                                <Form.Text className="text-muted">
                                    Hex color format (e.g., #FF5733)
                                </Form.Text>
                            </Form.Group>
                        </Card.Body>
                    </Card>

                    {/* Difficulty & Tags */}
                    <Card className="mb-3 shadow-sm">
                        <Card.Header className="bg-light">
                            <strong><i className="bi bi-sliders"></i> Project Settings</strong>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Difficulty Level: <Badge bg="primary">{formData.difficultyLevel}</Badge>
                                </Form.Label>
                                <Form.Range
                                    min={1}
                                    max={10}
                                    value={formData.difficultyLevel}
                                    onChange={(e) => handleChange('difficultyLevel', parseInt(e.target.value))}
                                />
                                <div className="d-flex justify-content-between small text-muted">
                                    <span>Easy (1)</span>
                                    <span>Hard (10)</span>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Tags <Badge bg="secondary">1-5 items</Badge>
                                </Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                        placeholder="Enter a tag and press Enter"
                                    />
                                    <Button variant="outline-secondary" onClick={addTag}>
                                        <i className="bi bi-plus"></i> Add
                                    </Button>
                                </InputGroup>
                                <div className="mt-2 d-flex flex-wrap gap-2">
                                    {formData.tags.map((tag, i) => (
                                        <Badge key={i} bg="info" className="d-flex align-items-center gap-1">
                                            {tag}
                                            <i
                                                className="bi bi-x-circle"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => removeTag(tag)}
                                            ></i>
                                        </Badge>
                                    ))}
                                </div>
                                <Form.Text className="text-muted">
                                    {formData.tags.length} / 5 tags (min 2 chars each)
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-0">
                                <Form.Label>Priority</Form.Label>
                                <Form.Select
                                    value={formData.extraMetadata.priority}
                                    onChange={(e) => handleChange('extraMetadata.priority', e.target.value)}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </Form.Select>
                            </Form.Group>
                        </Card.Body>
                    </Card>

                    {/* Date & File */}
                    <Card className="mb-3 shadow-sm">
                        <Card.Header className="bg-light">
                            <strong><i className="bi bi-calendar-event"></i> Schedule & Upload</strong>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Appointment Date <Badge bg="danger">Required</Badge>
                                    <small className="text-muted ms-2">(Year 2024-2026)</small>
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                    value={formData.appointmentDate}
                                    min="2024-01-01"
                                    max="2026-12-31"
                                    onChange={(e) => handleChange('appointmentDate', e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-0">
                                <Form.Label>
                                    Project File <Badge bg="danger">Required</Badge>
                                    <small className="text-muted ms-2">(Max 5MB, images only)</small>
                                </Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleFileChange}
                                />
                                {formData.projectFile && (
                                    <Card className="mt-2 bg-light">
                                        <Card.Body className="p-2">
                                            <Row className="align-items-center">
                                                <Col xs={3}>
                                                    <img
                                                        src={formData.projectFile.content}
                                                        alt="Preview"
                                                        className="img-fluid rounded"
                                                    />
                                                </Col>
                                                <Col xs={9}>
                                                    <div className="small">
                                                        <strong>{formData.projectFile.name}</strong><br />
                                                        <span className="text-muted">
                              {(formData.projectFile.size / 1024 / 1024).toFixed(2)} MB • {formData.projectFile.type}
                            </span>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                )}
                            </Form.Group>
                        </Card.Body>
                    </Card>

                    <Form.Check
                        type="checkbox"
                        id="isPublic"
                        label="Make this project public"
                        checked={formData.extraMetadata.isPublic}
                        onChange={(e) => handleChange('extraMetadata.isPublic', e.target.checked)}
                        className="mb-3"
                    />

                    <div className="d-grid gap-2">
                        <Button variant="success" size="lg" onClick={handleSubmit}>
                            <i className="bi bi-rocket-takeoff"></i> Create Project
                        </Button>
                        <Button variant="outline-secondary" onClick={handleReset}>
                            <i className="bi bi-arrow-counterclockwise"></i> Reset Form
                        </Button>
                    </div>
                </Col>

                <Col lg={6}>
                    <h5 className="mb-3">
                        <i className="bi bi-play-circle"></i> Test Panel
                    </h5>
                    <TestPanel
                        toolName="create_custom_project"
                        examples={testExamples}
                        onExecute={async (input) => {
                            try {
                                CustomFormSchema.parse(input)
                                setFormData(input as any)
                                return {
                                    success: true,
                                    message: 'Project created successfully!'
                                }
                            } catch (error: any) {
                                return {
                                    success: false,
                                    message: 'Validation failed',
                                    errors: error.errors
                                }
                            }
                        }}
                    />
                </Col>
            </Row>

            {/* Bottom Section: Form State + Available Tools */}
            <Row>
                <Col lg={6}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-dark text-white">
                            <strong><i className="bi bi-code-slash"></i> Current Form State</strong>
                        </Card.Header>
                        <Card.Body>
              <pre className="bg-dark text-light p-3 rounded mb-0" style={{ fontSize: '0.75rem', maxHeight: '400px', overflow: 'auto' }}>
                {JSON.stringify(formData, null, 2)}
              </pre>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={6}>
                    <Card className="shadow-sm mb-3">
                        <Card.Header className="bg-success text-white">
                            <strong><i className="bi bi-tools"></i> Available MCP Tool</strong>
                        </Card.Header>
                        <Card.Body>
                            <Badge bg="success" className="mb-2">create_custom_project</Badge>
                            <Alert variant="light" className="mb-0 small">
                                <i className="bi bi-lightbulb"></i> This custom tool uses a Zod schema for comprehensive validation of complex data types including files, dates, colors, and nested objects.
                            </Alert>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm">
                        <Card.Header className="bg-warning">
                            <strong><i className="bi bi-shield-check"></i> Validation Rules</strong>
                        </Card.Header>
                        <Card.Body>
                            <ul className="mb-0 small">
                                <li><strong>Asset URL:</strong> Must be valid URL format</li>
                                <li><strong>Brand Color:</strong> Hex format (#RGB or #RRGGBB)</li>
                                <li><strong>Difficulty:</strong> Integer between 1-10</li>
                                <li><strong>Tags:</strong> Array of 1-5 strings (min 2 chars each)</li>
                                <li><strong>Priority:</strong> Must be 'low', 'medium', or 'high'</li>
                                <li><strong>Date:</strong> Must be within 2024-2026</li>
                                <li><strong>File:</strong> Max 5MB, JPEG/PNG/WebP only</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}