import {FormConfig, FormField, FormState} from "../types"
import { defineTool, InputSchema } from "webmcp-adapter"

/**
 * Builds a JSON Schema for a specific field's value with all validation constraints
 */
function buildFieldValueSchema(field: FormField) {
    const schema: any = {}

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
            if (field.options) schema.enum = field.options
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

    // If field is required, don't allow null
    if (field.required) {
        return schema
    }

    // Allow null to clear optional fields
    return {
        oneOf: [
            schema,
            { type: 'null' }
        ]
    }
}

/**
 * Builds the complete tool schema with conditional validation based on field name
 */
function buildToolSchema(config: FormConfig) {
    const conditionals = Object.entries(config.fields).map(([fieldName, fieldConfig]) => {
        return {
            if: {
                properties: {
                    field: { const: fieldName }
                }
            },
            then: {
                properties: {
                    value: buildFieldValueSchema(fieldConfig)
                }
            }
        }
    })

    return {
        type: "object",
        properties: {
            field: {
                type: "string",
                enum: Object.keys(config.fields),
                description: "The field name to fill"
            },
            value: {
                description: "The value to set for the field"
            }
        },
        required: ["field", "value"],
        allOf: conditionals
    }
}

const fieldDescription = (fields: Record<string, FormField>) => {
    return Object.entries(fields).map(([name, field]) => {
        let dec = `- ${name} (${field.type})`
        if (field.label) dec+= `: ${field.label}`
        if (field.options) dec+= ` [options: ${field.options.join(', ')}]`
        if (field.min !== undefined) dec+= ` [min: ${field.min}]`
        if (field.max !== undefined) dec+= ` [max: ${field.max}]`
        return dec
    }).join('\n')
}

export function createFillFieldTool(config: FormConfig, state: FormState) {
    return defineTool({
        name: `fill_${config.formId}_field`,
        description: `Fill a field in the ${config.formId} form. \n\n Fields:\n${fieldDescription(config.fields)}`,
        schema: buildToolSchema(config),
        execute: ({ field, value }) => {
            state.setFieldValue(field as string, value);
            return {
                content: [{ type: 'text', text: `Set "${field}" to ${JSON.stringify(value)}` }],
                structuredContent: {
                    success: true,
                    field,
                    value,
                    fieldType: config.fields[field]?.type
                }
            }
        },
    })
}