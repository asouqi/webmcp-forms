import { FormField } from "./types"

/**
 * Builds a JSON Schema from a FormField definition.
 * Used by fillField (for tool input validation) and validateForm (for value validation).
 */
export function buildFieldSchema(field: FormField): Record<string, unknown> {
    const schema: Record<string, unknown> = {}

    switch (field.type) {
        case 'string':
            schema.type = 'string'
            if (field.minLength !== undefined) schema.minLength = field.minLength
            if (field.maxLength !== undefined) schema.maxLength = field.maxLength
            if (field.pattern) schema.pattern = field.pattern
            if (field.options) schema.enum = field.options
            break

        case 'number':
            schema.type = 'number'
            if (field.min !== undefined) schema.minimum = field.min
            if (field.max !== undefined) schema.maximum = field.max
            if (field.step !== undefined) schema.multipleOf = field.step
            if (field.options) schema.enum = field.options.map(Number)
            break

        case 'boolean':
            schema.type = 'boolean'
            break

        case 'array':
            schema.type = 'array'
            if (field.minItems !== undefined) schema.minItems = field.minItems
            if (field.maxItems !== undefined) schema.maxItems = field.maxItems
            break

        case 'object':
            schema.type = 'object'
            break
    }

    return schema
}

/**
 * Builds a schema that allows null for optional fields (used in fillField tool).
 */
export function buildFieldValueSchema(field: FormField): Record<string, unknown> {
    const schema = buildFieldSchema(field)

    // Required fields: return schema as-is
    if (field.required) {
        return schema
    }

    // Optional fields: allow null to clear the field
    return {
        oneOf: [
            schema,
            { type: 'null' }
        ]
    }
}

/**
 * Checks if a value is considered empty
 */
export function isEmpty(value: unknown): boolean {
    if (value === undefined || value === null) return true
    if (typeof value === 'string' && value.trim() === '') return true
    if (Array.isArray(value) && value.length === 0) return true
    return false
}

/**
 * Generates human-readable field descriptions for AI tool descriptions
 */
export function fieldDescription(fields: Record<string, FormField>): string {
    return Object.entries(fields).map(([name, field]) => {
        let desc = `- ${name} (${field.type})`
        if (field.label) desc += `: ${field.label}`
        if (field.options) desc += ` [options: ${field.options.join(', ')}]`
        if (field.min !== undefined) desc += ` [min: ${field.min}]`
        if (field.max !== undefined) desc += ` [max: ${field.max}]`
        if (field.minLength !== undefined) desc += ` [minLength: ${field.minLength}]`
        if (field.maxLength !== undefined) desc += ` [maxLength: ${field.maxLength}]`
        if (field.required) desc += ` (required)`
        return desc
    }).join('\n')
}

/**
 * Gets the default empty value for a field type
 */
export function getFieldEmptyValue(field: FormField): unknown {
    switch (field.type) {
        case 'string':
            return ''
        case 'number':
            return null
        case 'boolean':
            return false
        case 'array':
            return []
        case 'object':
            return null
        default:
            return null
    }
}

/**
 * Gets default values for all fields in a form
 */
export function getFieldsEmptyValues(fields: Record<string, FormField>): Record<string, unknown> {
    const values: Record<string, unknown> = {}
    for (const [fieldName, fieldConfig] of Object.entries(fields)) {
        values[fieldName] = getFieldEmptyValue(fieldConfig)
    }
    return values
}