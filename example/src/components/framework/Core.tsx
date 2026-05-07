import { useState, useEffect } from 'react';
import { createFormTools } from 'webmcp-forms';
import { registerBatch, JsonValue } from 'webmcp-adapter';
import { FormValues } from '../../shared/types';
import { fields, initialState } from '../../shared/formConfig';
import { FORM_ID } from '../../shared/formConfig';
import {
    MainContent,
    Title,
    ValidationNote,
    ValidationRule,
} from '../../shared/styles';
import { TextFieldsSection } from '../sections/TextFieldsSection';
import { NumberFieldsSection } from '../sections/NumberFieldsSection';
import { BooleanSection } from '../sections/BooleanSection';
import { EnumSection } from '../sections/EnumSection';
import { ArraySection } from '../sections/ArraySection';
import { ObjectSection } from '../sections/ObjectSection';
import { DebugPanel } from '../sections/DebugPanel';
import { InspectorHelp } from '../sections/InspectorHelp';

export function CoreExample() {
    const [values, setValues] = useState<FormValues>(initialState);

    useEffect(() => {
        // Direct usage of createFormTools (no React hook)
        const { tools } = createFormTools(
            {
                formId: FORM_ID,
                fields,
            },
            {
                setFieldValue: (field, value) => {
                    setValues((prev) => ({ ...prev, [field]: value }));
                },
                getValue: () => values as Record<string, JsonValue>,
                submit: async () => {
                    console.log('Form submitted with values:', values);
                    alert('Form submitted successfully!\n\n' + JSON.stringify(values, null, 2));
                },
                reset: () => {
                    setValues(initialState);
                    console.log('Form reset to initial state');
                },
            }
        );

        const unregisterAll = registerBatch(tools);
        return () => {
            unregisterAll();
        };
    }, [values]);

    const handleChange = (field: keyof FormValues, value: any) => {
        setValues((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <MainContent>
            <Title>Core API Example - Registration Form</Title>

            <ValidationNote>
                <strong>🛡️ Validation Features Demo (Core API)</strong>
                <ul style={{ marginTop: '8px', marginBottom: '0', paddingLeft: '20px' }}>
                    <ValidationRule>✅ Uses <code>createFormTools</code> directly (no hooks)</ValidationRule>
                    <ValidationRule>✅ Manual tool registration with <code>registerBatch</code></ValidationRule>
                    <ValidationRule>✅ Framework-agnostic approach</ValidationRule>
                    <ValidationRule>✅ Full control over state management</ValidationRule>
                    <ValidationRule>✅ Same validation as React hook version</ValidationRule>
                    <ValidationRule>✅ All field types supported (string, number, boolean, array, object)</ValidationRule>
                </ul>
            </ValidationNote>

            <TextFieldsSection values={values} onChange={handleChange} />
            <NumberFieldsSection values={values} onChange={handleChange} />
            <BooleanSection values={values} onChange={handleChange} />
            <EnumSection values={values} onChange={handleChange} />
            <ArraySection values={values} onChange={handleChange} />
            <ObjectSection values={values} onChange={handleChange} />

            <DebugPanel values={values} />
            <InspectorHelp framework="core" />
        </MainContent>
    );
}