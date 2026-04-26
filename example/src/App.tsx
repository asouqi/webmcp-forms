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

// Form fields configuration
const fields: Record<string, FormField> = {
    // String fields
    name: { type: 'string', label: 'Full Name' },
    email: { type: 'string', label: 'Email' },

    // Number field
    age: { type: 'number', label: 'Age' },

    // Boolean field
    subscribe: { type: 'boolean', label: 'Subscribe to newsletter' },

    // Select field
    country: { type: 'string', label: 'Country' },

    // Array field (multi-select interests)
    interests: { type: 'array', label: 'Interests' },

    // Nested object field (address)
    address: { type: 'object', label: 'Address' },
};

// Initial form state
const initialState = {
    name: '',
    email: '',
    age: 0,
    subscribe: false,
    country: '',
    interests: [] as string[],
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
        onChange: (field, value) => {
            setValues((prev) => ({ ...prev, [field]: value }));
        },
    });

    const interestOptions = ['Technology', 'Sports', 'Music', 'Travel', 'Food'];
    const countryOptions = ['', 'US', 'UK', 'CA', 'DE', 'FR'];

    return (
        <Container>
            <Title>Registration Form</Title>

            {/* String Fields */}
            <Section>
                <SectionTitle>📝 Basic Info (string)</SectionTitle>
                <FormGroup>
                    <Label>Full Name</Label>
                    <Input
                        value={values.name ?? ''}
                        onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Email</Label>
                    <Input
                        type="email"
                        value={values.email}
                        onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))}
                    />
                </FormGroup>
            </Section>

            {/* Number Field */}
            <Section>
                <SectionTitle>🔢 Age (number)</SectionTitle>
                <FormGroup>
                    <Label>Age</Label>
                    <Input
                        type="number"
                        value={values.age}
                        onChange={(e) => setValues((prev) => ({ ...prev, age: Number(e.target.value) }))}
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

            {/* Select Field */}
            <Section>
                <SectionTitle>🌍 Country (string - select)</SectionTitle>
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

            {/* Array Field */}
            <Section>
                <SectionTitle>🎯 Interests (array)</SectionTitle>
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
                </FormGroup>
            </Section>

            {/* Nested Object Field */}
            <Section>
                <SectionTitle>🏠 Address (object)</SectionTitle>
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
                <HelpTitle>🧪 WebMCP Inspector - Sample Input Arguments</HelpTitle>

                <p style={{ fontSize: '13px', margin: '0 0 8px 0' }}>
                    Tool name: <code>fill_registration_field</code>
                </p>

                <ExampleLabel>String - Fill name:</ExampleLabel>
                <CodeBlock>
                    {`{
  "field": "name",
  "value": "John Doe"
}`}
                </CodeBlock>

                <ExampleLabel>Number - Set age:</ExampleLabel>
                <CodeBlock>
                    {`{
  "field": "age",
  "value": 25
}`}
                </CodeBlock>

                <ExampleLabel>Boolean - Subscribe:</ExampleLabel>
                <CodeBlock>
                    {`{
  "field": "subscribe",
  "value": true
}`}
                </CodeBlock>

                <ExampleLabel>String - Select country:</ExampleLabel>
                <CodeBlock>
                    {`{
  "field": "country",
  "value": "US"
}`}
                </CodeBlock>

                <ExampleLabel>Array - Set interests:</ExampleLabel>
                <CodeBlock>
                    {`{
  "field": "interests",
  "value": ["Technology", "Music", "Travel"]
}`}
                </CodeBlock>

                <ExampleLabel>Object - Set full address:</ExampleLabel>
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

                <ExampleLabel>Null - Clear a field:</ExampleLabel>
                <CodeBlock>
                    {`{
  "field": "name",
  "value": null
}`}
                </CodeBlock>
            </InspectorHelp>
        </Container>
    );
}