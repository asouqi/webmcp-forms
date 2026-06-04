import { useEffect, useRef, useState } from 'react'
import { Row, Col, Card, Form, Badge, Alert, Button, InputGroup } from 'react-bootstrap'
import { createFormTools, FormField } from 'webmcp-forms'
import { useTools } from 'webmcp-adapter-react'
import * as z from 'zod'

// Comprehensive form fields combining basic and advanced validation
const fields: Record<string, FormField> = {
    name: {
        type: 'string',
        label: 'Full Name',
        required: true,
        minLength: 2,
        maxLength: 50
    },
    email: {
        type: 'string',
        label: 'Email',
        required: true,
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
    },
    age: {
        type: 'number',
        label: 'Age',
        required: true,
        min: 18,
        max: 120
    },
    country: {
        type: 'string',
        label: 'Country',
        required: true,
        options: ['US', 'UK', 'CA', 'DE', 'FR', 'AU', 'JP']
    },
    interests: {
        type: 'array',
        label: 'Interests',
        minItems: 1,
        maxItems: 5
    },
    startDate: {
        type: 'string',
        label: 'Start Date',
        required: true
    },
    resume: {
        type: 'string',
        label: 'Resume',
        required: false
    },
    projectUrl: {
        type: 'string',
        label: 'Project URL'
    },
    brandColor: {
        type: 'string',
        label: 'Brand Color'
    },
    priority: {
        type: 'string',
        label: 'Priority',
        options: ['low', 'medium', 'high']
    },
    subscribe: {
        type: 'boolean',
        label: 'Subscribe to newsletter'
    }
}

const fieldsDefinitions = {
    name: z.string().min(2, 'Name must be at least 2 characters').max(50),
    email: z.string().email('Invalid email format'),
    age: z.number().min(18, 'Must be at least 18 years old').max(120),
    country: z.enum(['US', 'UK', 'CA', 'DE', 'FR', 'AU', 'JP']),
    interests: z.array(z.string()).min(1, 'Select at least one interest').max(5, 'Maximum 5 interests allowed'),
    startDate: z.string().refine((date) => {
        if (!date) return false
        const d = new Date(date)
        return !isNaN(d.getTime()) && d > new Date()
    }, 'Start date must be in the future'),
    resume: z.string(),
    projectUrl: z.string().url('Must be a valid URL'),
    brandColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color'),
    priority: z.enum(['low', 'medium', 'high']),
    subscribe: z.boolean(),
}

const formSchema = z.object(fieldsDefinitions).partial({
    interests: true,
    resume: true,
    projectUrl: true,
    brandColor: true,
    priority: true,
    subscribe: true
})

const fieldSpecificSchemas = Object.entries(fieldsDefinitions).map(([key, schema]) =>
    z.object({ field: z.literal(key), value: schema })
)

const fillFieldSchema = z.union([
    fieldSpecificSchemas[0],
    fieldSpecificSchemas[1],
    ...fieldSpecificSchemas.slice(2)
])

const fillMultipleFieldSchema = z.object({
    fields: formSchema
})

const initialState = {
    name: '',
    email: '',
    age: 18,
    country: '',
    interests: [] as string[],
    startDate: '',
    resume: '',
    projectUrl: '',
    brandColor: '#4A90E2',
    priority: 'medium' as 'low' | 'medium' | 'high',
    subscribe: false
}

// Small 1x1 pixel red PNG as data URL (actual valid image)
const SAMPLE_IMAGE_DATA_URL = "data:image/jpeg;base64,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"

export default function FormExample() {
    const [values, setValues] = useState(initialState)
    const [submitMessage, setSubmitMessage] = useState<string>('')
    const [fileInputKey, setFileInputKey] = useState<number>(0)
    const valuesRef = useRef(values)

    useEffect(() => {
        valuesRef.current = values
    }, [values])

    const handleSubmit = async () => {
        try {
            formSchema.parse(values)
            setSubmitMessage('Form submitted successfully!')
            console.log('Form submitted:', values)
            setTimeout(() => setSubmitMessage(''), 3000)
        } catch (error: any) {
            setSubmitMessage('Validation failed. Please check the form.')
            console.error('Validation errors:', error.errors)
            setTimeout(() => setSubmitMessage(''), 5000)
        }
    }

    const handleReset = () => {
        setValues(initialState)
        setFileInputKey(prev => prev + 1) // Reset file input
    }

    const handleFillWithValidData = () => {
        // Get a future date (30 days from now)
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + 30)
        const futureDateString = futureDate.toISOString().split('T')[0]

        setValues({
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            age: 28,
            country: 'US',
            interests: ['Technology', 'Design', 'Business'],
            startDate: futureDateString,
            resume: SAMPLE_IMAGE_DATA_URL,
            projectUrl: 'https://github.com/janesmith/awesome-project',
            brandColor: '#2E86AB',
            priority: 'high',
            subscribe: true
        })
        setFileInputKey(prev => prev + 1) // Reset file input since we're setting data URL
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Convert file to data URL
            const reader = new FileReader()
            reader.onloadend = () => {
                const result = reader.result as string
                setValues(prev => ({ ...prev, resume: result }))
            }
            reader.readAsDataURL(file)
        }
    }

    useTools({
        tools: createFormTools({
            formId: 'demo',
            fields,
            getValues: () => valuesRef.current,
            onChange: (field, value) => {
                setValues((prev) => ({ ...prev, [field]: value }))
                // Reset file input if resume field is changed via MCP
                if (field === 'resume') {
                    setFileInputKey(prev => prev + 1)
                }
            },
            onSubmit: handleSubmit,
            onReset: handleReset,
            validationSchema: {
                form: formSchema,
                fillField: fillFieldSchema,
                fillMultipleField: fillMultipleFieldSchema,
            },
        }),
        deps: []
    })

    const interestOptions = ['Technology', 'Design', 'Business', 'Sports', 'Music', 'Travel', 'Food', 'Gaming']
    const countryOptions = ['', 'US', 'UK', 'CA', 'DE', 'FR', 'AU', 'JP']

    const isImageDataUrl = values.resume && values.resume.startsWith('data:image/')

    return (
        <>
            {/* Page Header */}
            <div className="mb-4 text-center">
                <h2 className="mb-2">Interactive Form Demo</h2>
            </div>

            {submitMessage && (
                <Alert
                    variant={submitMessage.includes('success') ? 'success' : 'danger'}
                    dismissible
                    onClose={() => setSubmitMessage('')}
                >
                    <i className={`bi ${submitMessage.includes('success') ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i> {submitMessage}
                </Alert>
            )}

            <Row>
                <Col lg={3}>
                    {/* MCP Integration Info */}
                    <Alert variant="info" className="mb-3">
                        <div className="d-flex align-items-start">
                            <i className="bi bi-lightbulb-fill me-2 mt-1"></i>
                            <div className="small">
                                <strong className="d-block mb-2">Try it yourself:</strong>
                                <p className="mb-2">
                                    Install the{' '}
                                    <a
                                        href="https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="fw-bold"
                                    >
                                        WebMCP Inspector
                                    </a>{' '}
                                    extension and discover 8 auto-generated MCP tools ready to interact with this form.
                                </p>
                                <p className="mb-0">
                                    You can also test tools programmatically in the <strong>Tools Tester</strong> tab.
                                </p>
                            </div>
                        </div>
                    </Alert>

                    {/* Quick Actions */}
                    <Card className="shadow-sm mb-3">
                        <Card.Header className="bg-success text-white">
                            <span className="small"><i className="bi bi-lightning-charge-fill"></i> Quick Actions</span>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-grid gap-2">
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={handleFillWithValidData}
                                >
                                    <i className="bi bi-check-circle-fill"></i> Fill with Valid Data
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={handleReset}
                                >
                                    <i className="bi bi-arrow-counterclockwise"></i> Clear Form
                                </Button>
                            </div>
                            <Alert variant="light" className="mt-3 mb-0 small">
                                <i className="bi bi-info-circle"></i> Click "Fill with Valid Data" to populate all fields with sample data that passes validation.
                            </Alert>
                        </Card.Body>
                    </Card>

                    {/* Current State */}
                    <h5 className="mb-3">Current State</h5>
                    <Card className="shadow-sm mb-3">
                        <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                            <span className="small"><i className="bi bi-code-slash"></i> Form Values (JSON)</span>
                            <Badge bg="secondary">{Object.keys(values).length} fields</Badge>
                        </Card.Header>
                        <Card.Body className="p-0">
              <pre className="bg-dark text-light p-3 m-0 small" style={{ maxHeight: '400px', overflow: 'auto', fontSize: '0.8rem' }}>
                {JSON.stringify(values, null, 2)}
              </pre>
                        </Card.Body>
                    </Card>

                    {/* Available Tools */}
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <span className="small"><i className="bi bi-tools"></i> Available MCP Tools</span>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex flex-wrap gap-1 mb-2">
                                <Badge bg="primary" className="small">fill_demo_field</Badge>
                                <Badge bg="primary" className="small">fill_demo_multiple_fields</Badge>
                                <Badge bg="info" className="small">get_demo_state</Badge>
                                <Badge bg="info" className="small">get_demo_field_value</Badge>
                            </div>
                            <div className="d-flex flex-wrap gap-1">
                                <Badge bg="warning" className="small">validate_demo_form</Badge>
                                <Badge bg="success" className="small">submit_demo_form</Badge>
                                <Badge bg="danger" className="small">clear_demo_field</Badge>
                                <Badge bg="danger" className="small">reset_demo_form</Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={8}>
                    <h5 className="mb-3">Form Fields</h5>

                    {/* Personal Information */}
                    <Card className="mb-3 shadow-sm">
                        <Card.Header className="bg-light">
                            <strong>Personal Information</strong>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label className="small">
                                    Full Name <Badge bg="danger" className="ms-1">Required</Badge>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={values.name}
                                    onChange={(e) => setValues(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="John Doe"
                                    size="sm"
                                />
                                <Form.Text className="text-muted">2-50 characters</Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small">
                                    Email <Badge bg="danger" className="ms-1">Required</Badge>
                                </Form.Label>
                                <Form.Control
                                    type="email"
                                    value={values.email}
                                    onChange={(e) => setValues(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="john@example.com"
                                    size="sm"
                                />
                                <Form.Text className="text-muted">Valid email format required</Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small">
                                    Age <Badge bg="danger" className="ms-1">Required</Badge>
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    value={values.age}
                                    onChange={(e) => setValues(prev => ({ ...prev, age: Number(e.target.value) }))}
                                    min={18}
                                    max={120}
                                    size="sm"
                                />
                                <Form.Text className="text-muted">18-120 years</Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-0">
                                <Form.Label className="small">
                                    Country <Badge bg="danger" className="ms-1">Required</Badge>
                                </Form.Label>
                                <Form.Select
                                    value={values.country}
                                    onChange={(e) => setValues(prev => ({ ...prev, country: e.target.value }))}
                                    size="sm"
                                >
                                    {countryOptions.map((c) => (
                                        <option key={c} value={c}>{c || 'Select country...'}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Card.Body>
                    </Card>

                    {/* Project Details */}
                    <Card className="mb-3 shadow-sm">
                        <Card.Header className="bg-light">
                            <strong>Project Details</strong>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label className="small">
                                    Start Date <Badge bg="danger" className="ms-1">Required</Badge>
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                    value={values.startDate}
                                    onChange={(e) => setValues(prev => ({ ...prev, startDate: e.target.value }))}
                                    size="sm"
                                />
                                <Form.Text className="text-muted">Must be in the future</Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small">Resume</Form.Label>
                                <Form.Control
                                    key={fileInputKey}
                                    type="file"
                                    onChange={handleFileChange}
                                    size="sm"
                                    accept="image/*,.pdf,.doc,.docx"
                                />
                                <Form.Text className="text-muted d-block">
                                    {values.resume ? (
                                        values.resume.startsWith('data:image/') ? (
                                            <span className="text-success">
                        <i className="bi bi-check-circle-fill"></i> Image uploaded
                      </span>
                                        ) : (
                                            <span className="text-success">
                        <i className="bi bi-check-circle-fill"></i> File uploaded (data URL: {values.resume.substring(0, 30)}...)
                      </span>
                                        )
                                    ) : (
                                        'Images, PDF, DOC, or DOCX (converted to data URL)'
                                    )}
                                </Form.Text>

                                {isImageDataUrl && (
                                    <div className="mt-2 p-2 border rounded bg-light">
                                        <div className="small fw-bold mb-2">
                                            <i className="bi bi-image"></i> Image Preview:
                                        </div>
                                        <img
                                            src={values.resume}
                                            alt="Resume preview"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '200px',
                                                border: '1px solid #dee2e6',
                                                borderRadius: '4px',
                                                display: 'block'
                                            }}
                                        />
                                    </div>
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small">Project URL</Form.Label>
                                <Form.Control
                                    type="url"
                                    value={values.projectUrl}
                                    onChange={(e) => setValues(prev => ({ ...prev, projectUrl: e.target.value }))}
                                    placeholder="https://example.com"
                                    size="sm"
                                />
                                <Form.Text className="text-muted">Optional - must be valid URL if provided</Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="small">Brand Color</Form.Label>
                                <InputGroup size="sm">
                                    <Form.Control
                                        type="color"
                                        value={values.brandColor}
                                        onChange={(e) => setValues(prev => ({ ...prev, brandColor: e.target.value }))}
                                        style={{ maxWidth: '60px' }}
                                    />
                                    <Form.Control
                                        type="text"
                                        value={values.brandColor}
                                        onChange={(e) => setValues(prev => ({ ...prev, brandColor: e.target.value }))}
                                        placeholder="#4A90E2"
                                    />
                                </InputGroup>
                                <Form.Text className="text-muted">Hex format (#RGB or #RRGGBB)</Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-0">
                                <Form.Label className="small">Priority</Form.Label>
                                <Form.Select
                                    value={values.priority}
                                    onChange={(e) => setValues(prev => ({ ...prev, priority: e.target.value as any }))}
                                    size="sm"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </Form.Select>
                            </Form.Group>
                        </Card.Body>
                    </Card>

                    {/* Preferences */}
                    <Card className="mb-3 shadow-sm">
                        <Card.Header className="bg-light">
                            <strong>Preferences</strong>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label className="small">Interests (1-5 items)</Form.Label>
                                <div className="border rounded p-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                    {interestOptions.map((interest) => (
                                        <Form.Check
                                            key={interest}
                                            type="checkbox"
                                            id={`interest-${interest}`}
                                            label={<span className="small">{interest}</span>}
                                            checked={values.interests.includes(interest)}
                                            onChange={(e) => {
                                                setValues((prev) => ({
                                                    ...prev,
                                                    interests: e.target.checked
                                                        ? [...prev.interests, interest]
                                                        : prev.interests.filter((i) => i !== interest),
                                                }))
                                            }}
                                            className="small"
                                        />
                                    ))}
                                </div>
                                <Form.Text className="text-muted">
                                    Selected: {values.interests.length}/5
                                </Form.Text>
                            </Form.Group>

                            <Form.Check
                                type="checkbox"
                                id="subscribe"
                                label={<span className="small">Subscribe to newsletter</span>}
                                checked={values.subscribe}
                                onChange={(e) => setValues(prev => ({ ...prev, subscribe: e.target.checked }))}
                            />
                        </Card.Body>
                    </Card>

                    <div className="d-grid gap-2">
                        <Button variant="primary" onClick={handleSubmit}>
                            <i className="bi bi-send-fill"></i> Submit Form
                        </Button>
                        <Button variant="outline-secondary" size="sm" onClick={handleReset}>
                            <i className="bi bi-arrow-counterclockwise"></i> Reset
                        </Button>
                    </div>
                </Col>
            </Row>
        </>
    )
}