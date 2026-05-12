# webmcp-forms

AI-powered form tools for WebMCP. Enables AI assistants to fill, validate, clear, and submit web forms through the Model Context Protocol.

## 🧠 What is webmcp-forms?

`webmcp-forms` builds on top of [`webmcp-adapter`](https://github.com/asouqi/webmcp-adapter) to expose your web forms as a set of typed, validated AI tools. Once registered, an AI assistant can fill fields, validate the form, and submit it — all through natural language.

## 🚀 Installation

```bash
npm install webmcp-forms webmcp-adapter
```

For React applications:

```bash
npm install webmcp-forms webmcp-adapter webmcp-adapter-react
```

---

## ⚡ Quick Start

```tsx
import { useState } from 'react'
import { useTools } from 'webmcp-adapter-react'
import { createFormTools } from 'webmcp-forms'

const fields = {
    name: { type: 'string', label: 'Full Name', required: true, minLength: 2 },
    email: { type: 'string', label: 'Email', required: true, pattern: '^[^@]+@[^@]+\\.[^@]+$' },
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
            <input value={values.name} onChange={e => setValues(p => ({ ...p, name: e.target.value }))} placeholder="Full Name" />
            <input value={values.email} onChange={e => setValues(p => ({ ...p, email: e.target.value }))} placeholder="Email" />
            <button type="submit">Submit</button>
        </form>
    )
}
```

---

## 🛠 API Reference

### `createFormTools(options)`

Creates an array of `ToolDefinition[]` for AI interaction. Pass the result directly to `registerBatch` or `useTools`.

```typescript
function createFormTools(options: CreateFormToolsOptions): ToolDefinition[]
```

#### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `formId` | `string` | Yes | Unique identifier for the form. Used as a prefix for all generated tool names (e.g. `fill_contact_field`) |
| `fields` | `Record<string, FormField>` | Yes | Field definitions describing each form field and its constraints |
| `getValues` | `() => Record<string, JsonValue>` | Yes | Function that returns the current form values |
| `onChange` | `(field: string, value: JsonValue) => void` | Yes | Callback invoked when the AI sets a field value |
| `onSubmit` | `() => void \| Promise<void>` | No | Called when the AI invokes the submit tool |
| `onReset` | `() => void` | No | Called when the AI invokes the reset tool |
| `validationSchema` | `{ form?: StandardSchema, fillField?: StandardSchema, fillMultipleField?: StandardSchema }` | No | Per-tool Standard Schema validators (Zod, Valibot, ArkType). Each key targets a specific tool — `form` for `validate-form`, `fillField` for `fill-field`, `fillMultipleField` for `fill-multiple-field`. When a key is provided it replaces the built-in JSON Schema validation for that tool |
| `selectedTools` | `Set<FormTools>` | No | Specific tools to include. Defaults to all tools |
| `customTools` | `ToolDefinition[]` | No | Additional custom tools to register alongside the built-in form tools |

---

### `FormField`

Describes a single form field and its validation constraints.

| Property | Type | Description |
|----------|------|-------------|
| `type` | `'string' \| 'number' \| 'boolean' \| 'array' \| 'object'` | Field type — **required** |
| `label` | `string` | Human-readable label used in validation error messages |
| `required` | `boolean` | Whether the field must have a non-empty value |
| `options` | `string[]` | Restricts the value to an enum list |
| `min` / `max` | `number` | Min/max range for `number` fields |
| `minLength` / `maxLength` | `number` | Length constraints for `string` fields |
| `minItems` / `maxItems` | `number` | Length constraints for `array` fields |
| `step` | `number` | Step constraint for `number` fields (`multipleOf` in JSON Schema) |
| `pattern` | `string` | Regex pattern for `string` field validation |
| `placeholder` | `string` | UI hint — not used in validation |
| `defaultValue` | `JsonValue` | Value used when the field is reset |

```typescript
const fields = {
    // String with length and required constraints
    name: {
        type: 'string',
        label: 'Full Name',
        required: true,
        minLength: 2,
        maxLength: 50
    },
    // String with regex pattern
    email: {
        type: 'string',
        label: 'Email',
        required: true,
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
    },
    // Number with range
    age: {
        type: 'number',
        label: 'Age',
        required: true,
        min: 18,
        max: 120
    },
    // Boolean
    subscribe: {
        type: 'boolean',
        label: 'Subscribe to newsletter'
    },
    // String with enum options
    country: {
        type: 'string',
        label: 'Country',
        required: true,
        options: ['US', 'UK', 'CA', 'DE', 'FR']
    },
    // Array with item count constraints
    interests: {
        type: 'array',
        label: 'Interests',
        minItems: 1,
        maxItems: 5
    },
    // Nested object with default value
    address: {
        type: 'object',
        label: 'Address',
        defaultValue: { street: '', city: '', zip: '' }
    }
}
```

---

### `FormTools`

Available tool identifiers for `selectedTools`:

| Tool ID | Generated Tool Name | Description |
|---------|---------------------|-------------|
| `fill-field` | `fill_{formId}_field` | Fill a single form field with a value |
| `fill-multiple-field` | `fill_{formId}_multiple_fields` | Fill multiple fields at once |
| `clear-field` | `clear_{formId}_field` | Clear a field to its default empty value |
| `get-form-state` | `get_{formId}_state` | Get all current form values |
| `get-field-value` | `get_{formId}_field_value` | Get a specific field's current value |
| `validate-form` | `validate_{formId}_form` | Validate all fields without submitting |
| `submit-form` | `submit_{formId}_form` | Submit the form |
| `reset-form` | `reset_{formId}_form` | Reset all fields to their default values |

---

## 📖 Usage

### With React

```tsx
import { useState } from 'react'
import { useTools } from 'webmcp-adapter-react'
import { createFormTools } from 'webmcp-forms'

const fields = {
    name: { type: 'string', label: 'Full Name', required: true, minLength: 2 },
    email: { type: 'string', label: 'Email', required: true, pattern: '^[^@]+@[^@]+\\.[^@]+$' },
    age: { type: 'number', label: 'Age', min: 18, max: 120 },
    subscribe: { type: 'boolean', label: 'Subscribe to newsletter' }
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
        deps: [values]
    })

    return (
        <form onSubmit={e => e.preventDefault()}>
            <input
                value={values.name}
                onChange={e => setValues(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Full Name"
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

---

### With a Custom Validation Schema (Zod, Valibot, ArkType)

Pass any [Standard Schema](https://github.com/standard-schema/standard-schema)-compatible schema via `validationSchema` for stricter validation with cross-field rules, custom refinements, or richer error messages. When provided, it replaces the built-in per-field JSON Schema validation.

```tsx
import { z } from 'zod'
import { createFormTools } from 'webmcp-forms'
import { useTools } from 'webmcp-adapter-react'

const fieldsDefinitions = {
    name: z.string().min(2, 'Full Name must be at least 2 characters'),
    email: z.string().email('Must be a valid email address'),
    age: z.number().min(18, 'Must be at least 18').max(120),
    subscribe: z.boolean().optional(),
}

// Used by validate-form — validates the flat values object
const formSchema = z.object(fieldsDefinitions)

// Used by fill-field — validates { field: 'name', value: '...' }
const fieldSpecificSchemas = Object.entries(fieldsDefinitions).map(([key, schema]) =>
    z.object({ field: z.literal(key), value: schema })
) as [ReturnType<typeof z.object>, ...ReturnType<typeof z.object>[]]
const fillFieldSchema = z.union(fieldSpecificSchemas)

// Used by fill-multiple-field — validates { fields: { name?, email?, ... } }
const fillMultipleFieldSchema = z.object({ fields: formSchema.partial() })

useTools({
    tools: createFormTools({
        formId: 'contact',
        fields,
        getValues: () => values,
        onChange: (field, value) => setValues(prev => ({ ...prev, [field]: value })),
        validationSchema: {
            form: formSchema,               // ← validate-form
            fillField: fillFieldSchema,     // ← fill-field
            fillMultipleField: fillMultipleFieldSchema  // ← fill-multiple-field
        }
    }),
    deps: [values]
})
```

---

### Selecting Specific Tools

By default, all tools are created. Use `selectedTools` to include only the tools you need:

```tsx
import { createFormTools } from 'webmcp-forms'
import type { FormTools } from 'webmcp-forms'

useTools({
    tools: createFormTools({
        formId: 'contact',
        fields,
        getValues: () => values,
        onChange: (field, value) => setValues(prev => ({ ...prev, [field]: value })),
        selectedTools: new Set<FormTools>(['fill-field', 'validate-form', 'submit-form'])
    }),
    deps: [values]
})
```

---

### Adding Custom Tools

Add your own tools alongside the built-in form tools:

```tsx
import { defineTool } from 'webmcp-adapter'
import { createFormTools } from 'webmcp-forms'

const autofillTool = defineTool({
    name: 'autofill_contact',
    description: 'Auto-fill the contact form with sample data',
    inputSchema: { type: 'object', properties: {}, required: [] },
    execute: () => {
        setValues({
            name: 'John Doe',
            email: 'john@example.com',
            age: 30,
            subscribe: true
        })
        return {
            content: [{ type: 'text', text: 'Form auto-filled with sample data!' }],
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
    deps: [values]
})
```

---

### Vanilla JavaScript

```javascript
import { createFormTools } from 'webmcp-forms'
import { registerBatch } from 'webmcp-adapter'

let formValues = { name: '', email: '' }

const tools = createFormTools({
    formId: 'contact',
    fields: {
        name: { type: 'string', label: 'Full Name', required: true },
        email: { type: 'string', label: 'Email', required: true }
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

// Later, to clean up:
// unregister()
```

---

## 📦 Exported Types

```typescript
// Core function
export { createFormTools } from './createFormTools'

// Types
export type { CreateFormToolsOptions } from './createFormTools'
export type { FormConfig, FormState, FormField, FormTools, FieldType } from './types'

// Individual tool creators (for advanced usage)
export {
    createFillFieldTool,
    createFillMultipleFieldsTool,
    createGetFormStateTool,
    createGetFieldValueTool,
    createSubmitFormTool,
    createResetFormTool,
    createClearFieldTool,
    createValidateFormTool,
} from './tools'
```

### `CreateFormToolsOptions`

```typescript
interface CreateFormToolsOptions {
    formId: string
    fields: Record<string, FormField>
    getValues: () => Record<string, JsonValue>
    onChange: (field: string, value: JsonValue) => void
    onSubmit?: () => void | Promise<void>
    onReset?: () => void
    validationSchema?: {
        form?: StandardSchema           // validate-form tool
        fillField?: StandardSchema      // fill-field tool
        fillMultipleField?: StandardSchema  // fill-multiple-field tool
    }
    selectedTools?: Set<FormTools>
    customTools?: ToolDefinition[]
}
```

### `FormField`

```typescript
interface FormField {
    type: 'string' | 'number' | 'boolean' | 'array' | 'object'
    label?: string
    required?: boolean
    options?: string[]
    min?: number
    max?: number
    step?: number
    minLength?: number
    maxLength?: number
    minItems?: number
    maxItems?: number
    pattern?: string
    placeholder?: string
    defaultValue?: JsonValue
}
```

### `FormTools`

```typescript
type FormTools =
    | 'fill-field'
    | 'fill-multiple-field'
    | 'get-form-state'
    | 'get-field-value'
    | 'submit-form'
    | 'reset-form'
    | 'clear-field'
    | 'validate-form'
```

---

## 🔗 Related Packages

- [`webmcp-adapter`](https://github.com/asouqi/webmcp-adapter) — Core adapter for defining and registering tools
- [`webmcp-adapter-react`](https://github.com/asouqi/webmcp-adapter-react) — React hooks for tool registration

## License

MIT
