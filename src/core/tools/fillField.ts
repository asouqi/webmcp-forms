import {FormConfig, FormField, FormState} from "../types"
import { defineTool } from "webmcp-adapter"

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
        schema: {
            type: "object",
            properties: {
                field: {
                    type: "string",
                    enum: Object.keys(config.fields)
                },
                value: {
                    oneOf: [
                        { type: 'string' },
                        { type: 'number' },
                        { type: 'boolean' },
                        { type: 'array' },
                        { type: 'object' }, // nested
                        { type: 'null' }, // clear field
                    ],
                    description: 'The value to set'
                },
            },
            required: ["field", "value"]
        },
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