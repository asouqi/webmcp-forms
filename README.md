# webmcp-forms

AI-powered form tools for WebMCP. Enables AI assistants to fill, validate, clear, and submit web forms through the Model Context Protocol.

## Installation

```bash
npm install webmcp-forms webmcp-adapter
```

For React applications:

```bash
npm install webmcp-forms webmcp-adapter webmcp-adapter-react
```

## API

### `createFormTools(options)`

Creates form tools for AI interaction.

```typescript
function createFormTools(options: CreateFormToolsOptions): ToolDefinition[]
```

#### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `formId` | `string` | Yes | Unique identifier for the form |
| `fields` | `Record<string, FormField>` | Yes | Field definitions |
| `values` | `Record<string, JsonValue>` | Yes | Current form values |
| `onChange` | `(field: string, value: JsonValue) => void` | Yes | Callback when a field value changes |
| `onSubmit` | `() => void \| Promise<void>` | No | Submit handler |
| `onReset` | `() => void` | No | Reset handler |
| `selectedTools` | `Set<FormTools>` | No | Specific tools to include (defaults to all) |
| `customTools` | `ToolDefinition[]` | No | Additional custom tools |


### FormTools

Available tool identifiers for `selectedTools`:

| Tool ID | Description |
|---------|-------------|
| `fill-field` | Fill a single form field with a value |
| `fill-multiple-field` | Fill multiple fields at once |
| `clear-field` | Clear a field to its default empty value |
| `get-form-state` | Get all current form values |
| `get-field-value` | Get a specific field's current value |
| `validate-form` | Validate all fields without submitting |
| `submit-form` | Submit the form |
| `reset-form` | Reset form to initial values |

## Usage

### With React

```tsx
import { useState } from 'react'
import { useTools } from 'webmcp-adapter-react'
import { createFormTools } from 'webmcp-forms'

const fields = {
    name: { type: 'string', required: true, minLength: 2 },
    email: { type: 'string', required: true, pattern: '^[^@]+@[^@]+\\.[^@]+$' },
    age: { type: 'number', min: 18, max: 120 },
    subscribe: { type: 'boolean' }
}

function ContactForm() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        age: null,
        subscribe: false
    })

    useTools({
        tools: createFormTools({
            formId: 'contact',
            fields,
            getValues: () => values,
            onChange: (field, value) => {
                setValues(prev => ({ ...prev, [field]: value }))
            },
            onSubmit: () => {
                console.log('Submitted:', values)
            },
            onReset: () => {
                setValues({ name: '', email: '', age: null, subscribe: false })
            }
        }),
        deps: [fields]
    })

    return (
        <form onSubmit={e => e.preventDefault()}>
            <input
                value={values.name}
                onChange={e => setValues(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Name"
            />
            <input
                type="email"
                value={values.email}
                onChange={e => setValues(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
            />
            <input
                type="number"
                value={values.age ?? ''}
                onChange={e => setValues(prev => ({
                    ...prev,
                    age: e.target.value ? Number(e.target.value) : null
                }))}
                placeholder="Age"
            />
            <label>
                <input
                    type="checkbox"
                    checked={values.subscribe}
                    onChange={e => setValues(prev => ({ ...prev, subscribe: e.target.checked }))}
                />
                Subscribe to newsletter
            </label>
            <button type="submit">Submit</button>
        </form>
    )
}
```

### Selecting Specific Tools

By default, all tools are created. Use `selectedTools` to include only the tools you need:

```tsx
import { createFormTools, FormTools } from 'webmcp-forms'

useTools({
    tools: createFormTools({
        formId: 'contact',
        fields,
        getValues,
        onChange: (field, value) => setValues(prev => ({ ...prev, [field]: value })),
        selectedTools: new Set<FormTools>(['fill-field', 'validate-form', 'submit-form'])
    }),
    deps: [fields]
})
```

### Adding Custom Tools

Add your own tools alongside the built-in form tools:

```tsx
import { defineTool } from 'webmcp-adapter'
import { createFormTools } from 'webmcp-forms'

const autofillTool = defineTool({
    name: 'autofill_contact',
    description: 'Auto-fill the form with test data',
    inputSchema: { type: 'object', properties: {}, required: [] },
    execute: () => {
        setValues({
            name: 'John Doe',
            email: 'john@example.com',
            age: 30,
            subscribe: true
        })
        return {
            content: [{ type: 'text', text: 'Form auto-filled!' }],
            structuredContent: { success: true }
        }
    }
})

useTools({
    tools: createFormTools({
        formId: 'contact',
        fields,
        getValues: () => values,
        onChange: (field, value) => setValues(prev => ({ ...prev, [field]: value })),
        customTools: [autofillTool]
    }),
    deps: [fields]
})
```

### Vanilla JavaScript

```javascript
import { createFormTools } from 'webmcp-forms'
import { registerBatch } from 'webmcp-adapter'

let formValues = { name: '', email: '' }

const tools = createFormTools({
    formId: 'contact',
    fields: {
        name: { type: 'string', required: true },
        email: { type: 'string', required: true }
    },
    getValues: () => formValues,
    onChange: (field, value) => {
        formValues[field] = value
        document.querySelector(`[name="${field}"]`).value = value
    },
    onSubmit: () => {
        console.log('Submitted:', formValues)
    }
})

const unregister = registerBatch(tools)

// Later, to cleanup:
// unregister()
```

## Related Packages

- [`webmcp-adapter`](https://github.com/asouqi/webmcp-adapter) - Core adapter for defining and registering tools
- [`webmcp-adapter-react`](https://github.com/asouqi/webmcp-adapter-react) - React hooks for tool registration

## License

MIT
