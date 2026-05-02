import { ToolDefinition } from "webmcp-adapter"

export interface FormField {
    type: 'string' | 'number' | 'boolean' | 'array' | 'object'
    label?: string
    options?: string[]
    min?: number
    max?: number
    step?: number
    minLength?: number
    maxLength?: number
    pattern?: string
    required?: boolean
    placeholder?: string
}

export interface FormConfig {
    formId: string
    fields: Record<string, FormField>
}

export interface FormState {
    setFieldValue: (field: string, value: unknown) => void
    getValue: () => Record<string, unknown>
    submit?: () => void | Promise<void>
    reset?: () => void
}

export interface FormToolsResult {
    tools: ToolDefinition[]
}