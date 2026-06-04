import { useState } from 'react'
import { Container, Nav, Navbar, Tab } from 'react-bootstrap'
import LandingPage from './components/LandingPage'
import FormExample from './components/FormExample'
import ToolsReference from './components/ToolsReference'
import ToolsTester from './components/ToolsTester'

export default function App() {
    const [activeTab, setActiveTab] = useState('home')

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
                <Container>
                    <Navbar.Brand
                        href="#home"
                        onClick={() => setActiveTab('home')}
                        style={{ cursor: 'pointer' }}
                    >
                        <img
                            src={`${import.meta.env.BASE_URL}logo.svg`}
                            alt="webmcp-forms"
                            height="45"
                            className="d-inline-block align-top"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto" activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'home')}>
                            <Nav.Link eventKey="demo">Interactive Demo</Nav.Link>
                            <Nav.Link eventKey="tools">Tools Reference</Nav.Link>
                            <Nav.Link eventKey="tester">Tools Tester</Nav.Link>
                            <Nav.Link href="https://github.com/asouqi/webmcp-forms" target="_blank">
                                <i className="bi bi-github"></i> GitHub
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="pb-5">
                <Tab.Container activeKey={activeTab}>
                    <Tab.Content>
                        <Tab.Pane eventKey="home">
                            <LandingPage onGetStarted={() => setActiveTab('demo')} />
                        </Tab.Pane>

                        <Tab.Pane eventKey="demo">
                            <FormExample />
                        </Tab.Pane>

                        <Tab.Pane eventKey="tools">
                            <ToolsReference />
                        </Tab.Pane>

                        <Tab.Pane eventKey="tester">
                            <ToolsTester />
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </Container>

            <footer className="bg-light py-4 mt-5 border-top">
                <Container>
                    <div className="text-center">
                        <p className="mb-2 text-muted">
                            AI-powered form tools for the Model Context Protocol
                        </p>
                        <div>
                            <a
                                href="https://github.com/asouqi/webmcp-forms"
                                className="text-decoration-none me-3"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="bi bi-github"></i> GitHub
                            </a>
                            <a
                                href="https://www.npmjs.com/package/webmcp-forms"
                                className="text-decoration-none"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="bi bi-box-seam"></i> npm
                            </a>
                        </div>
                    </div>
                </Container>
            </footer>
        </>
    )
}