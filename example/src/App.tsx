import { useState } from 'react';
import styled from 'styled-components';
import { useFormTools } from 'webmcp-forms/react';
import {FormField} from "webmcp-forms";

const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  font-family: system-ui, sans-serif;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Section = styled.section`
  margin-bottom: 24px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  margin: 0 0 12px 0;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 12px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

const Checkbox = styled.input`
  margin-right: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
`;

const Debug = styled.pre`
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 12px;
  border-radius: 4px;
  font-size: 11px;
  overflow-x: auto;
  max-height: 300px;
`;

const InspectorHelp = styled.div`
  margin-top: 24px;
  padding: 16px;
  background: #e8f4ff;
  border-radius: 8px;
  border: 1px solid #b8daff;
`;

const HelpTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #004085;
`;

const CodeBlock = styled.pre`
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 12px;
  border-radius: 4px;
  font-size: 11px;
  overflow-x: auto;
  margin: 8px 0;
`;

const ExampleLabel = styled.span`
  display: block;
  font-size: 12px;
  color: #666;
  margin-top: 12px;
  margin-bottom: 4px;
`;

const ValidationNote = styled.div`
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #856404;
`;

const ValidationRule = styled.li`
  margin-bottom: 4px;
  font-size: 12px;
`;

// Form fields configuration with validation
const fields: Record<string, any> = {
    // String with minLength, maxLength, and required
    name: {
        type: 'string',
        label: 'Full Name',
        required: true,
        minLength: 2,
        maxLength: 50
    },

    // String with pattern validation (email regex)
    email: {
        type: 'string',
        label: 'Email',
        required: true,
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
    },

    // Number with min and max validation
    age: {
        type: 'number',
        label: 'Age',
        required: true,
        min: 18,
        max: 120
    },

    // Boolean field (no validation needed)
    subscribe: {
        type: 'boolean',
        label: 'Subscribe to newsletter'
    },

    // String with enum options (select)
    country: {
        type: 'string',
        label: 'Country',
        required: true,
        options: ['US', 'UK', 'CA', 'DE', 'FR']
    },

    // Array with minItems and maxItems validation
    interests: {
        type: 'array',
        label: 'Interests',
        minItems: 1,
        maxItems: 5
    },

    // String with just maxLength (optional field)
    bio: {
        type: 'string',
        label: 'Bio',
        maxLength: 200,
        placeholder: 'Tell us about yourself'
    },

    // Number with just min validation
    salary: {
        type: 'number',
        label: 'Expected Salary',
        min: 0
    },

    // Nested object field (no specific validation)
    address: {
        type: 'object',
        label: 'Address'
    },
};

// Initial form state
const initialState = {
    name: '',
    email: '',
    age: 0,
    subscribe: false,
    country: '',
    interests: [] as string[],
    bio: '',
    salary: 0,
    address: {
        street: '',
        city: '',
        zip: '',
    },
};

export default function App() {
    const [values, setValues] = useState(initialState);

    useFormTools({
        formId: 'registration',
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
        }
    });

    const interestOptions = ['Technology', 'Sports', 'Music', 'Travel', 'Food', 'Gaming', 'Reading'];
    const countryOptions = ['', 'US', 'UK', 'CA', 'DE', 'FR'];

    return (
        <Container>
            <Title>Registration Form with Validation</Title>

            <ValidationNote>
                <strong>🛡️ Validation Features Demo</strong>
                <ul style={{ marginTop: '8px', marginBottom: '0', paddingLeft: '20px' }}>
                    <ValidationRule>✅ Required fields (name, email, age, country)</ValidationRule>
                    <ValidationRule>✅ String length constraints (name: 2-50 chars, bio: max 200)</ValidationRule>
                    <ValidationRule>✅ Pattern matching (email regex validation)</ValidationRule>
                    <ValidationRule>✅ Number ranges (age: 18-120, salary: min 0)</ValidationRule>
                    <ValidationRule>✅ Enum options (country must be one of the list)</ValidationRule>
                    <ValidationRule>✅ Array constraints (interests: 1-5 items)</ValidationRule>
                </ul>
            </ValidationNote>

            {/* String Fields with validation */}
            <Section>
                <SectionTitle>📝 Text Fields (with validation)</SectionTitle>
                <FormGroup>
                    <Label>Full Name * (required, 2-50 chars)</Label>
                    <Input
                        value={values.name ?? ''}
                        onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Email * (required, must be valid email)</Label>
                    <Input
                        type="email"
                        value={values.email}
                        onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Bio (optional, max 200 chars)</Label>
                    <Input
                        value={values.bio}
                        onChange={(e) => setValues((prev) => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself"
                    />
                    <small style={{ color: '#666', fontSize: '11px' }}>
                        {values.bio.length} / 200 characters
                    </small>
                </FormGroup>
            </Section>

            {/* Number Fields with validation */}
            <Section>
                <SectionTitle>🔢 Number Fields (with validation)</SectionTitle>
                <FormGroup>
                    <Label>Age * (required, 18-120)</Label>
                    <Input
                        type="number"
                        value={values.age}
                        onChange={(e) => setValues((prev) => ({ ...prev, age: Number(e.target.value) }))}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Expected Salary (min: 0)</Label>
                    <Input
                        type="number"
                        value={values.salary}
                        onChange={(e) => setValues((prev) => ({ ...prev, salary: Number(e.target.value) }))}
                    />
                </FormGroup>
            </Section>

            {/* Boolean Field */}
            <Section>
                <SectionTitle>☑️ Newsletter (boolean)</SectionTitle>
                <FormGroup>
                    <CheckboxLabel>
                        <Checkbox
                            type="checkbox"
                            checked={values.subscribe}
                            onChange={(e) => setValues((prev) => ({ ...prev, subscribe: e.target.checked }))}
                        />
                        Subscribe to newsletter
                    </CheckboxLabel>
                </FormGroup>
            </Section>

            {/* Enum Field (Select) */}
            <Section>
                <SectionTitle>🌍 Country * (required, enum options)</SectionTitle>
                <FormGroup>
                    <Label>Country</Label>
                    <Select
                        value={values.country}
                        onChange={(e) => setValues((prev) => ({ ...prev, country: e.target.value }))}
                    >
                        {countryOptions.map((c) => (
                            <option key={c} value={c}>{c || 'Select...'}</option>
                        ))}
                    </Select>
                </FormGroup>
            </Section>

            {/* Array Field with validation */}
            <Section>
                <SectionTitle>🎯 Interests (array, 1-5 items)</SectionTitle>
                <FormGroup>
                    {interestOptions.map((interest) => (
                        <CheckboxLabel key={interest}>
                            <Checkbox
                                type="checkbox"
                                checked={values.interests.includes(interest)}
                                onChange={(e) => {
                                    setValues((prev) => ({
                                        ...prev,
                                        interests: e.target.checked
                                            ? [...prev.interests, interest]
                                            : prev.interests.filter((i) => i !== interest),
                                    }));
                                }}
                            />
                            {interest}
                        </CheckboxLabel>
                    ))}
                    <small style={{ color: '#666', fontSize: '11px', display: 'block', marginTop: '8px' }}>
                        Selected: {values.interests.length} (must be 1-5)
                    </small>
                </FormGroup>
            </Section>

            {/* Nested Object Field */}
            <Section>
                <SectionTitle>🏠 Address (object, no validation)</SectionTitle>
                <FormGroup>
                    <Label>Street</Label>
                    <Input
                        value={values.address.street}
                        onChange={(e) =>
                            setValues((prev) => ({
                                ...prev,
                                address: { ...prev.address, street: e.target.value },
                            }))
                        }
                    />
                </FormGroup>
                <FormGroup>
                    <Label>City</Label>
                    <Input
                        value={values.address.city}
                        onChange={(e) =>
                            setValues((prev) => ({
                                ...prev,
                                address: { ...prev.address, city: e.target.value },
                            }))
                        }
                    />
                </FormGroup>
                <FormGroup>
                    <Label>ZIP Code</Label>
                    <Input
                        value={values.address.zip}
                        onChange={(e) =>
                            setValues((prev) => ({
                                ...prev,
                                address: { ...prev.address, zip: e.target.value },
                            }))
                        }
                    />
                </FormGroup>
            </Section>

            {/* Debug State */}
            <Debug>
                <strong>Form State:</strong>
                {'\n'}
                {JSON.stringify(values, null, 2)}
            </Debug>

            {/* Inspector Help */}
            <InspectorHelp>
                <HelpTitle>🧪 WebMCP Inspector - Test Validation</HelpTitle>

                <p style={{ fontSize: '13px', margin: '0 0 8px 0' }}>
                    Tool name: <code>fill_registration_field</code>
                </p>

                <ExampleLabel>✅ Valid: Name with correct length</ExampleLabel>
                <CodeBlock>
                    {`{
  "field": "name",
  "value": "John Doe"
}`}
                </CodeBlock>

                <ExampleLabel>❌ Invalid: Name too short (minLength: 2)</ExampleLabel>
                <CodeBlock>
                    {`{
  "field": "name",
  "value": "J"
}`}
                </CodeBlock>

                <ExampleLabel>✅ Valid: Email with correct pattern</ExampleLabel>
                <CodeBlock>
                    {`{
  "field": "email",
  "value": "john@example.com"
}`}
                </CodeBlock>

                <ExampleLabel>❌ Invalid: Email wrong format</ExampleLabel>
                <CodeBlock>
                    {`{
  "field": "email",
  "value": "not-an-email"
}`}
                </CodeBlock>

                <ExampleLabel>✅ Valid: Age within range (18-120)</ExampleLabel>
                <CodeBlock>
                    {`{
  "field": "age",
  "value": 25
}`}
                </CodeBlock>

                <ExampleLabel>❌ Invalid: Age below minimum (min: 18)</ExampleLabel>
                <CodeBlock>
                    {`{
  "field": "age",
  "value": 15
}`}
                </CodeBlock>

                <ExampleLabel>✅ Valid: Country from enum options</ExampleLabel>
                <CodeBlock>
                    {`{
  "field": "country",
  "value": "US"
}`}
                </CodeBlock>

                <ExampleLabel>❌ Invalid: Country not in options</ExampleLabel>
                <CodeBlock>
                    {`{
  "field": "country",
  "value": "INVALID"
}`}
                </CodeBlock>

                <ExampleLabel>✅ Valid: Interests array (1-5 items)</ExampleLabel>
                <CodeBlock>
                    {`{
  "field": "interests",
  "value": ["Technology", "Music", "Travel"]
}`}
                </CodeBlock>

                <ExampleLabel>❌ Invalid: Interests array too many items (max: 5)</ExampleLabel>
                <CodeBlock>
                    {`{
  "field": "interests",
  "value": ["Technology", "Sports", "Music", "Travel", "Food", "Gaming"]
}`}
                </CodeBlock>

                <ExampleLabel>❌ Invalid: Trying to clear required field with null</ExampleLabel>
                <CodeBlock>
                    {`{
  "field": "name",
  "value": null
}`}
                </CodeBlock>

                <ExampleLabel>✅ Valid: Clear optional field with null</ExampleLabel>
                <CodeBlock>
                    {`{
  "field": "bio",
  "value": null
}`}
                </CodeBlock>

                <ExampleLabel>✅ Valid: Set full address object</ExampleLabel>
                <CodeBlock>
                    {`{
  "field": "address",
  "value": {
    "street": "123 Main Street",
    "city": "New York",
    "zip": "10001"
  }
}`}
                </CodeBlock>
            </InspectorHelp>
        </Container>
    );
}