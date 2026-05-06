import { ToolDefinition, JsonValue } from "webmcp-adapter"

export type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object'

export interface FormField<T extends FieldType = FieldType> {
    type: T
    label?: string
    options?: T extends 'string' ? string[] : T extends 'number' ? number[] : never
    min?: T extends 'number' ? number : never
    max?: T extends 'number' ? number : never
    step?: T extends 'number' ? number : never
    minLength?: T extends 'string' ? number : never
    maxLength?: T extends 'string' ? number : never
    minItems?: T extends 'array' ? number : never
    maxItems?: T extends 'array' ? number : never
    pattern?: T extends 'string' ? string : never
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