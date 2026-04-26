import { ToolDefinition } from "webmcp-adapter"

export interface FormField {
    type: 'string' | 'number' | 'boolean' | 'array' | 'object'
    label?: string
    options?: string[]
    min?: number
    max?: number
    // TODO::
    // step?: number
    // minLength?: number
    // maxLength?: number
    // pattern?: string
    // required?: boolean
    // placeholder?: string
}

export interface FormConfig {
    formId: string
    fields: Record<string, FormField>
}

export interface FormState {
    setFieldValue: (field: string, value: unknown) => void
}

export interface FormToolsResult {
    tools: ToolDefinition[]
}