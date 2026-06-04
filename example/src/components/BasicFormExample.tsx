import { useEffect, useRef, useState } from 'react'
import { Row, Col, Card, Form, Badge, Alert, Button, Accordion } from 'react-bootstrap'
import { createFormTools, FormField } from 'webmcp-forms'
import { useTools } from 'webmcp-adapter-react'
import TestPanel from './TestPanel'
import { useFormTester } from '../hooks/useFormTester'
import * as z from 'zod'

// Form fields configuration with validation
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
    subscribe: {
        type: 'boolean',
        label: 'Subscribe to newsletter'
    },
    country: {
        type: 'string',
        label: 'Country',
        required: true,
        options: ['US', 'UK', 'CA', 'DE', 'FR']
    },
    interests: {
        type: 'array',
        label: 'Interests',
        minItems: 1,
        maxItems: 5
    },
    bio: {
        type: 'string',
        label: 'Bio',
        maxLength: 200,
        placeholder: 'Tell us about yourself'
    }
}

const fieldsDefinitions = {
    name: z.string().min(2).max(50),
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    age: z.number().min(18).max(120),
    subscribe: z.boolean().optional(),
    country: z.enum(['US', 'UK', 'CA', 'DE', 'FR']),
    interests: z.array(z.string()).min(1).max(5).optional(),
    bio: z.string().max(200).optional(),
}

const formSchema = z.object(fieldsDefinitions)

const fieldSpecificSchemas = Object.entries(fieldsDefinitions).map(([key, schema]) =>
    z.object({ field: z.literal(key), value: schema })
)

const fillFieldSchema = z.union([
    fieldSpecificSchemas[0],
    fieldSpecificSchemas[1],
    ...fieldSpecificSchemas.slice(2)
])

const fillMultipleFieldSchema = z.object({
    fields: formSchema.partial()
})

const initialState = {
    name: '',
    email: '',
    age: 18,
    subscribe: false,
    country: '',
    interests: [] as string[],
    bio: '',
}

export default function BasicFormExample() {
    const [values, setValues] = useState(initialState)
    const [submitMessage, setSubmitMessage] = useState<string>('')
    const valuesRef = useRef(values)

    useEffect(() => {
        valuesRef.current = values
    }, [values])

    const handleSubmit = () => {
        setSubmitMessage('Form submitted successfully! Check console for values.')
        console.log('Form submitted:', values)
        setTimeout(() => setSubmitMessage(''), 3000)
    }

    const handleReset = () => {
        setValues(initialState)
    }

    useTools({
        tools: createFormTools({
            formId: 'contact',
            fields,
            getValues: () => valuesRef.current,
            onChange: (field, value) => {
                setValues((prev) => ({ ...prev, [field]: value }))
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

    const interestOptions = ['Technology', 'Sports', 'Music', 'Travel', 'Food', 'Gaming', 'Reading']
    const countryOptions = ['', 'US', 'UK', 'CA', 'DE', 'FR']

    // Form tester for testing panel
    const formTester = useFormTester({
        onFillField: (field, value) => setValues(prev => ({ ...prev, [field]: value })),
        onFillMultipleFields: (fieldsToUpdate) => setValues(prev => ({ ...prev, ...fieldsToUpdate })),
        onValidate: async () => {
            try {
                formSchema.parse(values)
                return { valid: true }
            } catch (error: any) {
                return { valid: false, errors: error.errors }
            }
        },
        onSubmit: async () => handleSubmit(),
        onReset: async () => handleReset(),
        onClearField: (field) => {
            const defaultValues: any = {
                name: '',
                email: '',
                age: 18,
                subscribe: false,
                country: '',
                interests: [],
                bio: ''
            }
            setValues(prev => ({ ...prev, [field]: defaultValues[field] }))
        },
        fields
    })

    const testExamples = [
        {
            label: 'Valid Name',
            description: 'Fill name field with valid data (2-50 chars)',
            input: { field: 'name', value: 'John Doe' },
            shouldPass: true
        },
        {
            label: 'Invalid Name (too short)',
            description: 'Name must be at least 2 characters',
            input: { field: 'name', value: 'J' },
            shouldPass: false
        },
        {
            label: 'Valid Email',
            description: 'Fill email with correct pattern',
            input: { field: 'email', value: 'john@example.com' },
            shouldPass: true
        },
        {
            label: 'Invalid Email',
            description: 'Email pattern validation fails',
            input: { field: 'email', value: 'not-an-email' },
            shouldPass: false
        },
        {
            label: 'Valid Age',
            description: 'Age within range (18-120)',
            input: { field: 'age', value: 25 },
            shouldPass: true
        },
        {
            label: 'Invalid Age (too young)',
            description: 'Age must be at least 18',
            input: { field: 'age', value: 15 },
            shouldPass: false
        },
        {
            label: 'Valid Country',
            description: 'Country from enum options',
            input: { field: 'country', value: 'US' },
            shouldPass: true
        },
        {
            label: 'Invalid Country',
            description: 'Country not in options list',
            input: { field: 'country', value: 'INVALID' },
            shouldPass: false
        },
        {
            label: 'Valid Interests',
            description: 'Array with 1-5 items',
            input: { field: 'interests', value: ['Technology', 'Music', 'Travel'] },
            shouldPass: true
        },
        {
            label: 'Invalid Interests (too many)',
            description: 'Maximum 5 items allowed',
            input: { field: 'interests', value: ['Technology', 'Sports', 'Music', 'Travel', 'Food', 'Gaming'] },
            shouldPass: false
        },
        {
            label: 'Fill Multiple Fields',
            description: 'Update multiple fields at once',
            input: {
                fields: {
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    age: 30,
                    country: 'UK',
                    subscribe: true
                }
            },
            shouldPass: true
        }
    ]

    return (
        <>
            {/* Collapsible Validation Info */}
            <Accordion className="mb-4">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <i className="bi bi-info-circle-fill me-2"></i>
                        <strong>What This Example Demonstrates</strong>
                    </Accordion.Header>
                    <Accordion.Body>
                        <p className="mb-2">
                            This form showcases <strong>standard field validation</strong> using the <code>FormField</code> configuration approach with Zod schema validation.
                        </p>
                        <Row className="mt-3">
                            <Col md={6}>
                                <strong>Validation Features:</strong>
                                <ul className="mb-0 small">
                                    <li>✅ Required fields (name, email, age, country)</li>
                                    <li>✅ String length constraints (name: 2-50 chars, bio: max 200)</li>
                                    <li>✅ Pattern matching (email regex)</li>
                                    <li>✅ Number ranges (age: 18-120)</li>
                                </ul>
                            </Col>
                            <Col md={6}>
                                <strong>Additional Features:</strong>
                                <ul className="mb-0 small">
                                    <li>✅ Enum options (country select)</li>
                                    <li>✅ Array constraints (interests: 1-5 items)</li>
                                    <li>✅ Boolean fields (newsletter checkbox)</li>
                                    <li>✅ Optional fields (bio)</li>
                                </ul>
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            {submitMessage && (
                <Alert variant="success" dismissible onClose={() => setSubmitMessage('')}>
                    <i className="bi bi-check-circle-fill"></i> {submitMessage}
                </Alert>
            )}

            {/* Top Section: Form + Test Panel Side by Side */}
            <Row className="mb-4">
                <Col lg={6}>
                    <h5 className="mb-3">
                        <i className="bi bi-pencil-square"></i> Registration Form
                    </h5>

                    {/* Text Fields */}
                    <Card className="mb-3 shadow-sm">
                        <Card.Header className="bg-light">
                            <strong><i className="bi bi-fonts"></i> Text Fields</strong>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Full Name <Badge bg="danger">Required</Badge>
                                    <small className="text-muted ms-2">(2-50 chars)</small>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={values.name}
                                    onChange={(e) => setValues(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter your full name"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Email <Badge bg="danger">Required</Badge>
                                    <small className="text-muted ms-2">(valid email format)</small>
                                </Form.Label>
                                <Form.Control
                                    type="email"
                                    value={values.email}
                                    onChange={(e) => setValues(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="your.email@example.com"
                                />
                            </Form.Group>

                            <Form.Group className="mb-0">
                                <Form.Label>
                                    Bio <Badge bg="secondary">Optional</Badge>
                                    <small className="text-muted ms-2">(max 200 chars)</small>
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={values.bio}
                                    onChange={(e) => setValues(prev => ({ ...prev, bio: e.target.value }))}
                                    placeholder="Tell us about yourself"
                                />
                                <Form.Text className="text-muted">
                                    {values.bio.length} / 200 characters
                                </Form.Text>
                            </Form.Group>
                        </Card.Body>
                    </Card>

                    {/* Number & Selection Fields */}
                    <Card className="mb-3 shadow-sm">
                        <Card.Header className="bg-light">
                            <strong><i className="bi bi-sliders"></i> Number & Selection</strong>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Age <Badge bg="danger">Required</Badge>
                                    <small className="text-muted ms-2">(18-120)</small>
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    value={values.age}
                                    onChange={(e) => setValues(prev => ({ ...prev, age: Number(e.target.value) }))}
                                    min={18}
                                    max={120}
                                />
                            </Form.Group>

                            <Form.Group className="mb-0">
                                <Form.Label>
                                    Country <Badge bg="danger">Required</Badge>
                                </Form.Label>
                                <Form.Select
                                    value={values.country}
                                    onChange={(e) => setValues(prev => ({ ...prev, country: e.target.value }))}
                                >
                                    {countryOptions.map((c) => (
                                        <option key={c} value={c}>{c || 'Select a country...'}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Card.Body>
                    </Card>

                    {/* Boolean & Array Fields */}
                    <Card className="mb-3 shadow-sm">
                        <Card.Header className="bg-light">
                            <strong><i className="bi bi-check2-square"></i> Preferences</strong>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    id="subscribe"
                                    label="Subscribe to newsletter"
                                    checked={values.subscribe}
                                    onChange={(e) => setValues(prev => ({ ...prev, subscribe: e.target.checked }))}
                                />
                            </Form.Group>

                            <Form.Group className="mb-0">
                                <Form.Label>
                                    Interests <Badge bg="secondary">Optional</Badge>
                                    <small className="text-muted ms-2">(1-5 items)</small>
                                </Form.Label>
                                {interestOptions.map((interest) => (
                                    <Form.Check
                                        key={interest}
                                        type="checkbox"
                                        id={`interest-${interest}`}
                                        label={interest}
                                        checked={values.interests.includes(interest)}
                                        onChange={(e) => {
                                            setValues((prev) => ({
                                                ...prev,
                                                interests: e.target.checked
                                                    ? [...prev.interests, interest]
                                                    : prev.interests.filter((i) => i !== interest),
                                            }))
                                        }}
                                    />
                                ))}
                                <Form.Text className="text-muted">
                                    Selected: {values.interests.length} {values.interests.length === 1 ? 'item' : 'items'}
                                </Form.Text>
                            </Form.Group>
                        </Card.Body>
                    </Card>

                    <div className="d-grid gap-2">
                        <Button variant="primary" size="lg" onClick={handleSubmit}>
                            <i className="bi bi-send-fill"></i> Submit Form
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
                        toolName="fill_contact_field"
                        examples={testExamples}
                        onExecute={formTester.executeFillField}
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
              <pre className="bg-dark text-light p-3 rounded mb-0" style={{ fontSize: '0.85rem', maxHeight: '300px', overflow: 'auto' }}>
                {JSON.stringify(values, null, 2)}
              </pre>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={6}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <strong><i className="bi bi-tools"></i> Available MCP Tools</strong>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex flex-wrap gap-2 mb-3">
                                <Badge bg="primary">fill_contact_field</Badge>
                                <Badge bg="primary">fill_contact_multiple_fields</Badge>
                                <Badge bg="info">get_contact_state</Badge>
                                <Badge bg="info">get_contact_field_value</Badge>
                                <Badge bg="warning">validate_contact_form</Badge>
                                <Badge bg="success">submit_contact_form</Badge>
                                <Badge bg="danger">clear_contact_field</Badge>
                                <Badge bg="danger">reset_contact_form</Badge>
                            </div>
                            <Alert variant="light" className="mb-0 small">
                                <i className="bi bi-lightbulb"></i> These tools are automatically registered and available to AI assistants through the Model Context Protocol.
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}