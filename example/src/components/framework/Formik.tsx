import { initialState } from '../../shared/formConfig';
import {
    MainContent,
    Title,
    ValidationNote,
    ValidationRule,
} from '../../shared/styles';
import { DebugPanel } from '../sections/DebugPanel';

export function FormikExample() {
    // Placeholder for Formik implementation
    return (
        <MainContent>
            <Title>Formik Example - Coming Soon</Title>

            <ValidationNote>
                <strong>🚧 Formik Integration (Under Development)</strong>
                <ul style={{ marginTop: '8px', marginBottom: '0', paddingLeft: '20px' }}>
                    <ValidationRule>🔜 Will integrate with Formik's useFormik hook</ValidationRule>
                    <ValidationRule>🔜 Leverage Formik's built-in validation</ValidationRule>
                    <ValidationRule>🔜 Support Formik's Field and Form components</ValidationRule>
                    <ValidationRule>🔜 WebMCP tools will work with Formik state</ValidationRule>
                </ul>
            </ValidationNote>

            <DebugPanel values={initialState} />

            <div style={{
                padding: '40px',
                textAlign: 'center',
                background: '#f9f9f9',
                borderRadius: '8px',
                marginTop: '20px'
            }}>
                <h3 style={{ color: '#666' }}>Formik Example Coming Soon</h3>
                <p style={{ color: '#999' }}>
                    This example will demonstrate how to use webmcp-forms with Formik.
                </p>
            </div>
        </MainContent>
    );
}