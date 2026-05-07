import { useState } from 'react';
import { useFormTools } from 'webmcp-forms/react';
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

export function ReactExample() {
    const [values, setValues] = useState(initialState);

    useFormTools({
        formId: FORM_ID,
        fields,
        values,
        onChange: (field, value) => {
            setValues((prev) => ({ ...prev, [field]: value }));
        },
        onSubmit: async () => {
            console.log('Form submitted with values:', values);
            alert('Form submitted successfully!\n\n' + JSON.stringify(values, null, 2));
        },
        onReset: () => {
            setValues(initialState);
            console.log('Form reset to initial state');
        },
    });

    const handleChange = (field: keyof FormValues, value: any) => {
        setValues((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <MainContent>
            <Title>React Hook Example - Registration Form</Title>

            <ValidationNote>
                <strong>🛡️ Validation Features Demo (React Hook)</strong>
                <ul style={{ marginTop: '8px', marginBottom: '0', paddingLeft: '20px' }}>
                    <ValidationRule>✅ Uses <code>useFormTools</code> hook</ValidationRule>
                    <ValidationRule>✅ React state management with useState</ValidationRule>
                    <ValidationRule>✅ Automatic WebMCP tool registration</ValidationRule>
                    <ValidationRule>✅ Required fields (name, email, age, country)</ValidationRule>
                    <ValidationRule>✅ String length constraints (name: 2-50 chars, bio: max 200)</ValidationRule>
                    <ValidationRule>✅ Pattern matching (email regex validation)</ValidationRule>
                    <ValidationRule>✅ Number ranges (age: 18-120, salary: min 0)</ValidationRule>
                    <ValidationRule>✅ Enum options (country must be one of the list)</ValidationRule>
                    <ValidationRule>✅ Array constraints (interests: 1-5 items)</ValidationRule>
                </ul>
            </ValidationNote>

            <TextFieldsSection values={values} onChange={handleChange} />
            <NumberFieldsSection values={values} onChange={handleChange} />
            <BooleanSection values={values} onChange={handleChange} />
            <EnumSection values={values} onChange={handleChange} />
            <ArraySection values={values} onChange={handleChange} />
            <ObjectSection values={values} onChange={handleChange} />

            <DebugPanel values={values} />
            {/*<InspectorHelp framework="react" />*/}
        </MainContent>
    );
}