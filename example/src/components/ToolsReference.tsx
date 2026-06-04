import { Row, Col, Card, Badge, Table, Accordion } from 'react-bootstrap'

export default function ToolsReference() {
    return (
        <>
            {/* Page Header */}
            <div className="mb-4">
                <h2 className="mb-2">MCP Tools Reference</h2>
                <p className="text-muted mb-0">
                    Complete reference for all auto-generated Model Context Protocol tools. Each form creates 8 tools for AI interaction.
                </p>
            </div>

            {/* Tools Overview */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">
                        <i className="bi bi-info-circle"></i> Tool Naming Convention
                    </h5>
                </Card.Header>
                <Card.Body>
                    <p className="mb-2">
                        All tools follow the pattern: <code className="bg-light px-2 py-1 rounded">{`{action}_{formId}_{target}`}</code>
                    </p>
                    <p className="text-muted mb-0 small">
                        For example, if your <code>formId</code> is <code>"contact"</code>, the fill field tool will be named <code>fill_contact_field</code>.
                    </p>
                </Card.Body>
            </Card>

            {/* Fill Operations */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="bg-light">
                    <h5 className="mb-0">
                        <Badge bg="primary" className="me-2">Write</Badge>
                        Fill Operations
                    </h5>
                </Card.Header>
                <Card.Body>
                    <h6 className="fw-bold mb-3">fill_{'{formId}'}_field</h6>
                    <p className="text-muted mb-3">
                        Updates a single form field with validation. Use this when the AI needs to set one field at a time.
                    </p>

                    <Row className="mb-4">
                        <Col md={6}>
                            <h6 className="small fw-bold text-uppercase text-muted mb-2">Input Parameters</h6>
                            <Table bordered size="sm" className="mb-0">
                                <thead className="table-light">
                                <tr>
                                    <th>Parameter</th>
                                    <th>Description</th>
                                    <th>Required</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td><code>field</code></td>
                                    <td>The name of the field to update</td>
                                    <td><Badge bg="danger" className="small">Yes</Badge></td>
                                </tr>
                                <tr>
                                    <td><code>value</code></td>
                                    <td>The new value for the field</td>
                                    <td><Badge bg="danger" className="small">Yes</Badge></td>
                                </tr>
                                </tbody>
                            </Table>
                        </Col>
                        <Col md={6}>
                            <h6 className="small fw-bold text-uppercase text-muted mb-2">Example Usage</h6>
                            <pre className="bg-dark text-light p-3 rounded mb-0 small">
                <code>{`{
  "field": "email",
  "value": "user@example.com"
}`}</code>
              </pre>
                        </Col>
                    </Row>

                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <small>Response Format</small>
                            </Accordion.Header>
                            <Accordion.Body>
                <pre className="bg-dark text-light p-3 rounded mb-0 small">
                  <code>{`{
  "content": [
    {
      "type": "text",
      "text": "Field 'email' updated successfully"
    }
  ],
  "structuredContent": {
    "success": true,
    "field": "email",
    "value": "user@example.com"
  }
}`}</code>
                </pre>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <hr className="my-4" />

                    <h6 className="fw-bold mb-3">fill_{'{formId}'}_multiple_fields</h6>
                    <p className="text-muted mb-3">
                        Updates multiple form fields at once. More efficient when the AI needs to set several fields together.
                    </p>

                    <Row className="mb-4">
                        <Col md={6}>
                            <h6 className="small fw-bold text-uppercase text-muted mb-2">Input Parameters</h6>
                            <Table bordered size="sm" className="mb-0">
                                <thead className="table-light">
                                <tr>
                                    <th>Parameter</th>
                                    <th>Description</th>
                                    <th>Required</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td><code>fields</code></td>
                                    <td>Object with field names as keys and values</td>
                                    <td><Badge bg="danger" className="small">Yes</Badge></td>
                                </tr>
                                </tbody>
                            </Table>
                        </Col>
                        <Col md={6}>
                            <h6 className="small fw-bold text-uppercase text-muted mb-2">Example Usage</h6>
                            <pre className="bg-dark text-light p-3 rounded mb-0 small">
                <code>{`{
  "fields": {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }
}`}</code>
              </pre>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Read Operations */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="bg-light">
                    <h5 className="mb-0">
                        <Badge bg="info" className="me-2">Read</Badge>
                        Get Operations
                    </h5>
                </Card.Header>
                <Card.Body>
                    <h6 className="fw-bold mb-3">get_{'{formId}'}_state</h6>
                    <p className="text-muted mb-3">
                        Retrieves all current form values. Use this when the AI needs to see the entire form state.
                    </p>

                    <Row className="mb-4">
                        <Col md={6}>
                            <h6 className="small fw-bold text-uppercase text-muted mb-2">Input Parameters</h6>
                            <Table bordered size="sm" className="mb-0">
                                <thead className="table-light">
                                <tr>
                                    <th colSpan={3}>No parameters required</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td colSpan={3} className="text-center text-muted small">
                                        Empty object: <code>{`{}`}</code>
                                    </td>
                                </tr>
                                </tbody>
                            </Table>
                        </Col>
                        <Col md={6}>
                            <h6 className="small fw-bold text-uppercase text-muted mb-2">Example Response</h6>
                            <pre className="bg-dark text-light p-3 rounded mb-0 small">
                <code>{`{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "subscribe": true
}`}</code>
              </pre>
                        </Col>
                    </Row>

                    <hr className="my-4" />

                    <h6 className="fw-bold mb-3">get_{'{formId}'}_field_value</h6>
                    <p className="text-muted mb-3">
                        Retrieves the value of a specific field. More efficient than getting the entire state when only one value is needed.
                    </p>

                    <Row className="mb-4">
                        <Col md={6}>
                            <h6 className="small fw-bold text-uppercase text-muted mb-2">Input Parameters</h6>
                            <Table bordered size="sm" className="mb-0">
                                <thead className="table-light">
                                <tr>
                                    <th>Parameter</th>
                                    <th>Description</th>
                                    <th>Required</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td><code>field</code></td>
                                    <td>The name of the field to retrieve</td>
                                    <td><Badge bg="danger" className="small">Yes</Badge></td>
                                </tr>
                                </tbody>
                            </Table>
                        </Col>
                        <Col md={6}>
                            <h6 className="small fw-bold text-uppercase text-muted mb-2">Example Usage</h6>
                            <pre className="bg-dark text-light p-3 rounded mb-0 small">
                <code>{`{
  "field": "email"
}`}</code>
              </pre>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Validation Operations */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="bg-light">
                    <h5 className="mb-0">
                        <Badge bg="warning" className="me-2">Validate</Badge>
                        Validation Operations
                    </h5>
                </Card.Header>
                <Card.Body>
                    <h6 className="fw-bold mb-3">validate_{'{formId}'}_form</h6>
                    <p className="text-muted mb-3">
                        Validates all form fields without submitting. Returns validation errors if any fields are invalid.
                    </p>

                    <Row className="mb-4">
                        <Col md={6}>
                            <h6 className="small fw-bold text-uppercase text-muted mb-2">Input Parameters</h6>
                            <Table bordered size="sm" className="mb-0">
                                <thead className="table-light">
                                <tr>
                                    <th colSpan={3}>No parameters required</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td colSpan={3} className="text-center text-muted small">
                                        Empty object: <code>{`{}`}</code>
                                    </td>
                                </tr>
                                </tbody>
                            </Table>
                        </Col>
                        <Col md={6}>
                            <h6 className="small fw-bold text-uppercase text-muted mb-2">Success Response</h6>
                            <pre className="bg-dark text-light p-3 rounded mb-0 small">
                <code>{`{
  "valid": true,
  "message": "All fields are valid"
}`}</code>
              </pre>
                        </Col>
                    </Row>

                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <small>Error Response Example</small>
                            </Accordion.Header>
                            <Accordion.Body>
                <pre className="bg-dark text-light p-3 rounded mb-0 small">
                  <code>{`{
  "valid": false,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "age",
      "message": "Must be at least 18"
    }
  ]
}`}</code>
                </pre>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Card.Body>
            </Card>

            {/* Action Operations */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="bg-light">
                    <h5 className="mb-0">
                        <Badge bg="success" className="me-2">Action</Badge>
                        Submit Operations
                    </h5>
                </Card.Header>
                <Card.Body>
                    <h6 className="fw-bold mb-3">submit_{'{formId}'}_form</h6>
                    <p className="text-muted mb-3">
                        Validates and submits the form. Calls the <code>onSubmit</code> handler if all validation passes.
                    </p>

                    <Row className="mb-4">
                        <Col md={6}>
                            <h6 className="small fw-bold text-uppercase text-muted mb-2">Input Parameters</h6>
                            <Table bordered size="sm" className="mb-0">
                                <thead className="table-light">
                                <tr>
                                    <th colSpan={3}>No parameters required</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td colSpan={3} className="text-center text-muted small">
                                        Empty object: <code>{`{}`}</code>
                                    </td>
                                </tr>
                                </tbody>
                            </Table>
                        </Col>
                        <Col md={6}>
                            <h6 className="small fw-bold text-uppercase text-muted mb-2">Response</h6>
                            <pre className="bg-dark text-light p-3 rounded mb-0 small">
                <code>{`{
  "success": true,
  "message": "Form submitted successfully"
}`}</code>
              </pre>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Reset/Clear Operations */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="bg-light">
                    <h5 className="mb-0">
                        <Badge bg="danger" className="me-2">Clear</Badge>
                        Reset Operations
                    </h5>
                </Card.Header>
                <Card.Body>
                    <h6 className="fw-bold mb-3">clear_{'{formId}'}_field</h6>
                    <p className="text-muted mb-3">
                        Clears a specific field to its default value (empty string, 0, false, [], etc.).
                    </p>

                    <Row className="mb-4">
                        <Col md={6}>
                            <h6 className="small fw-bold text-uppercase text-muted mb-2">Input Parameters</h6>
                            <Table bordered size="sm" className="mb-0">
                                <thead className="table-light">
                                <tr>
                                    <th>Parameter</th>
                                    <th>Description</th>
                                    <th>Required</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td><code>field</code></td>
                                    <td>The name of the field to clear</td>
                                    <td><Badge bg="danger" className="small">Yes</Badge></td>
                                </tr>
                                </tbody>
                            </Table>
                        </Col>
                        <Col md={6}>
                            <h6 className="small fw-bold text-uppercase text-muted mb-2">Example Usage</h6>
                            <pre className="bg-dark text-light p-3 rounded mb-0 small">
                <code>{`{
  "field": "email"
}`}</code>
              </pre>
                        </Col>
                    </Row>

                    <hr className="my-4" />

                    <h6 className="fw-bold mb-3">reset_{'{formId}'}_form</h6>
                    <p className="text-muted mb-3">
                        Resets all form fields to their default values. Calls the <code>onReset</code> handler if provided.
                    </p>

                    <Row className="mb-4">
                        <Col md={6}>
                            <h6 className="small fw-bold text-uppercase text-muted mb-2">Input Parameters</h6>
                            <Table bordered size="sm" className="mb-0">
                                <thead className="table-light">
                                <tr>
                                    <th colSpan={3}>No parameters required</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td colSpan={3} className="text-center text-muted small">
                                        Empty object: <code>{`{}`}</code>
                                    </td>
                                </tr>
                                </tbody>
                            </Table>
                        </Col>
                        <Col md={6}>
                            <h6 className="small fw-bold text-uppercase text-muted mb-2">Response</h6>
                            <pre className="bg-dark text-light p-3 rounded mb-0 small">
                <code>{`{
  "success": true,
  "message": "Form reset to defaults"
}`}</code>
              </pre>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Workflow Example */}
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-info text-white">
                    <h5 className="mb-0">
                        <i className="bi bi-diagram-3"></i> Typical AI Workflow
                    </h5>
                </Card.Header>
                <Card.Body>
                    <p className="text-muted mb-3">
                        Here's how an AI assistant typically interacts with a form using these tools:
                    </p>

                    <div className="timeline">
                        <div className="mb-4">
                            <Badge bg="info" className="mb-2">Step 1</Badge>
                            <h6 className="fw-bold mb-2">Get Current State</h6>
                            <p className="text-muted small mb-2">
                                Use <code>get_form_state</code> to understand what values are already filled.
                            </p>
                            <pre className="bg-light p-2 rounded small mb-0">
                <code>Tool: get_demo_state → Returns current values</code>
              </pre>
                        </div>

                        <div className="mb-4">
                            <Badge bg="primary" className="mb-2">Step 2</Badge>
                            <h6 className="fw-bold mb-2">Fill Required Fields</h6>
                            <p className="text-muted small mb-2">
                                Use <code>fill_multiple_fields</code> to set several values at once.
                            </p>
                            <pre className="bg-light p-2 rounded small mb-0">
                <code>{`Tool: fill_demo_multiple_fields
Input: { fields: { name: "...", email: "..." } }`}</code>
              </pre>
                        </div>

                        <div className="mb-4">
                            <Badge bg="warning" className="mb-2">Step 3</Badge>
                            <h6 className="fw-bold mb-2">Validate Form</h6>
                            <p className="text-muted small mb-2">
                                Use <code>validate_form</code> to check if all fields are valid before submitting.
                            </p>
                            <pre className="bg-light p-2 rounded small mb-0">
                <code>Tool: validate_demo_form → Check for errors</code>
              </pre>
                        </div>

                        <div className="mb-4">
                            <Badge bg="primary" className="mb-2">Step 4 (if needed)</Badge>
                            <h6 className="fw-bold mb-2">Fix Validation Errors</h6>
                            <p className="text-muted small mb-2">
                                If validation fails, use <code>fill_field</code> to correct individual fields.
                            </p>
                            <pre className="bg-light p-2 rounded small mb-0">
                <code>{`Tool: fill_demo_field
Input: { field: "age", value: 25 }`}</code>
              </pre>
                        </div>

                        <div className="mb-0">
                            <Badge bg="success" className="mb-2">Step 5</Badge>
                            <h6 className="fw-bold mb-2">Submit Form</h6>
                            <p className="text-muted small mb-2">
                                Use <code>submit_form</code> to finalize the submission.
                            </p>
                            <pre className="bg-light p-2 rounded small mb-0">
                <code>Tool: submit_demo_form → Complete!</code>
              </pre>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}