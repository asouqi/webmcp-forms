import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap'

interface LandingPageProps {
    onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
    return (
        <>
            {/* Hero Section */}
            <div className="text-center py-5 mb-5 bg-light rounded">
                <h1 className="display-4 fw-bold mb-3">
                    webmcp-forms
                </h1>
                <p className="lead text-muted mb-4">
                    AI-powered form tools for WebMCP. Enables AI assistants to fill, validate, clear, and submit web forms through the Model Context Protocol.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                    <Button variant="primary" size="lg" onClick={onGetStarted}>
                        <i className="bi bi-rocket-takeoff"></i> Get Started
                    </Button>
                    <Button variant="outline-dark" size="lg" href="https://github.com/asouqi/webmcp-forms" target="_blank">
                        <i className="bi bi-github"></i> View on GitHub
                    </Button>
                </div>
            </div>

            {/* Features Section */}
            <Row className="mb-5">
                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <div className="text-primary mb-3">
                                <i className="bi bi-check-circle-fill" style={{ fontSize: '2rem' }}></i>
                            </div>
                            <Card.Title>Easy Validation</Card.Title>
                            <Card.Text>
                                Built-in support for required fields, min/max constraints, patterns, enums, and more—all declaratively configured.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <div className="text-success mb-3">
                                <i className="bi bi-shield-check" style={{ fontSize: '2rem' }}></i>
                            </div>
                            <Card.Title>Custom Schemas</Card.Title>
                            <Card.Text>
                                Integrate with Zod, Valibot, or ArkType for advanced validation with cross-field rules and rich error messages.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <div className="text-warning mb-3">
                                <i className="bi bi-robot" style={{ fontSize: '2rem' }}></i>
                            </div>
                            <Card.Title>AI-Powered</Card.Title>
                            <Card.Text>
                                Expose forms as typed tools for AI assistants using the Model Context Protocol (MCP). Let AI interact with your forms naturally.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Installation */}
            <Card className="mb-5 shadow-sm">
                <Card.Header className="bg-dark text-white">
                    <h4 className="mb-0">
                        <i className="bi bi-download"></i> Installation
                    </h4>
                </Card.Header>
                <Card.Body>
          <pre className="bg-dark text-light p-3 rounded mb-0">
            <code>npm install webmcp-forms webmcp-adapter</code>
          </pre>
                    <p className="mt-3 mb-0 text-muted">
                        For React applications, also install: <code>webmcp-adapter-react</code>
                    </p>
                </Card.Body>
            </Card>

            {/* Quick Start */}
            <Card className="mb-5 shadow-sm">
                <Card.Header className="bg-info text-white">
                    <h4 className="mb-0">
                        <i className="bi bi-lightning-charge"></i> Quick Start
                    </h4>
                </Card.Header>
                <Card.Body>
          <pre className="bg-dark text-light p-3 rounded" style={{ fontSize: '0.85rem' }}>
            <code>{`import { useState } from 'react'
import { useTools } from 'webmcp-adapter-react'
import { createFormTools } from 'webmcp-forms'

const fields = {
  name: { type: 'string', label: 'Full Name', required: true, minLength: 2 },
  email: { type: 'string', label: 'Email', required: true, pattern: '^[^@]+@[^@]+\\\\.[^@]+$' },
}

function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '' })

  useTools({
    tools: createFormTools({
      formId: 'contact',
      fields,
      getValues: () => values,
      onChange: (field, value) => setValues(prev => ({ ...prev, [field]: value })),
      onSubmit: () => console.log('Submitted:', values),
    }),
    deps: [values]
  })

  return (
    <form>
      <input value={values.name} onChange={e => setValues(p => ({ ...p, name: e.target.value }))} />
      <input value={values.email} onChange={e => setValues(p => ({ ...p, email: e.target.value }))} />
      <button type="submit">Submit</button>
    </form>
  )
}`}</code>
          </pre>
                </Card.Body>
            </Card>

            {/* Features List */}
            <Card className="shadow-sm">
                <Card.Header className="bg-secondary text-white">
                    <h4 className="mb-0">
                        <i className="bi bi-list-check"></i> Available Form Tools
                    </h4>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <ul className="list-unstyled">
                                <li className="mb-2">
                                    <Badge bg="primary">fill_field</Badge>
                                    <span className="ms-2">Fill a single form field</span>
                                </li>
                                <li className="mb-2">
                                    <Badge bg="primary">fill_multiple_fields</Badge>
                                    <span className="ms-2">Fill multiple fields at once</span>
                                </li>
                                <li className="mb-2">
                                    <Badge bg="info">get_form_state</Badge>
                                    <span className="ms-2">Get all current values</span>
                                </li>
                                <li className="mb-2">
                                    <Badge bg="info">get_field_value</Badge>
                                    <span className="ms-2">Get a specific field's value</span>
                                </li>
                            </ul>
                        </Col>
                        <Col md={6}>
                            <ul className="list-unstyled">
                                <li className="mb-2">
                                    <Badge bg="warning">validate_form</Badge>
                                    <span className="ms-2">Validate all fields</span>
                                </li>
                                <li className="mb-2">
                                    <Badge bg="success">submit_form</Badge>
                                    <span className="ms-2">Submit the form</span>
                                </li>
                                <li className="mb-2">
                                    <Badge bg="danger">clear_field</Badge>
                                    <span className="ms-2">Clear a field value</span>
                                </li>
                                <li className="mb-2">
                                    <Badge bg="danger">reset_form</Badge>
                                    <span className="ms-2">Reset all fields to defaults</span>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </>
    )
}