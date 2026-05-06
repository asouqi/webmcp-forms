import { ToolDefinition, JsonValue } from "webmcp-adapter"

export type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object'

export interface FormField<T extends FieldType = FieldType> {
    type: T
    label?: string
    options?: string[]
    min?: number
    max?: number
    step?: number
    minLength?: number
    maxLength?: number
    minItems?: number
    maxItems?: number
    pattern?: string
    required?: boolean
    placeholder?: string
}

export interface FormConfig<TFields extends Record<string, FormField> = Record<string, FormField>> {
    formId: string
    fields: TFields
}

export interface FormState<TValues extends Record<string, JsonValue> = Record<string, JsonValue>> {
    setFieldValue: <K extends keyof TValues>(field: K, value: TValues[K]) => void
    getValue: () => TValues
    submit?: () => void | Promise<void>
    reset?: () => void
}

export interface FormToolsResult {
    tools: ToolDefinition[]
}