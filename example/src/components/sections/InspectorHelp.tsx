import { Framework } from '../../shared/types';
import { FORM_ID } from '../../shared/formConfig';
import {
    InspectorBox,
    HelpTitle,
    CodeBlock,
    ExampleLabel,
} from '../../shared/styles';

interface InspectorHelpProps {
    framework: Framework;
}

export function InspectorHelp({ framework }: InspectorHelpProps) {
    const toolPrefix = `fill_${FORM_ID}_field`;

    return (
        <InspectorBox>
            <HelpTitle>🧪 WebMCP Inspector - Test Validation</HelpTitle>

            <p style={{ fontSize: '13px', margin: '0 0 8px 0' }}>
                Framework: <code>{framework}</code> | Tool: <code>{toolPrefix}</code>
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

            <ExampleLabel>✅ Valid: Fill multiple fields at once</ExampleLabel>
            <CodeBlock>
                {`{
  "fields": {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25,
    "country": "US",
    "subscribe": true
  }
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
        </InspectorBox>
    );
}