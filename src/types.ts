import { JsonValue } from "webmcp-adapter"


export type FormTools = 'fill-field'
    | 'fill-multiple-field'
    | 'get-form-state'
    | 'get-field-value'
    | 'submit-form'
    | 'reset-form'
    | 'clear-field'
    | 'validate-form'

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
    defaultValue?: JsonValue
}

export interface FormConfig<TFields extends Record<string, FormField> = Record<string, FormField>> {
    formId: string
    fields: TFields
    validationSchema?: {
        /** use by validateForm — validates flat { name, email, ... } */
        form?: any
        /** use by validateField - validate { field: 'name', value: '...'} */
        fillField?: any
        /** used by fillMultipleField — validates { fields: { name, email, ... } } */
        fillMultipleField?: any
    }
}

export interface FormState<TValues extends Record<string, JsonValue> = Record<string, JsonValue>> {
    setFieldValue: <K extends keyof TValues>(field: K, value: TValues[K]) => void
    getValues: () => TValues
    submit?: () => void | Promise<void>
    reset?: () => void
}
