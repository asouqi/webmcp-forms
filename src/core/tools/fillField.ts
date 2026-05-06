import {FormConfig, FormState} from "../types"
import { defineTool, JsonValue } from "webmcp-adapter"
import { buildFieldValueSchema, fieldDescription } from "../utils"

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

export function createFillFieldTool(config: FormConfig, state: FormState) {
    return defineTool({
        name: `fill_${config.formId}_field`,
        description: `Fill a field in the ${config.formId} form. \n\n Fields:\n${fieldDescription(config.fields)}`,
        inputSchema: buildToolSchema(config),
        execute: ({ field, value }) => {
            state.setFieldValue(field as string, value as JsonValue);
            return {
                content: [{ type: 'text', text: `Set "${field}" to ${JSON.stringify(value)}` }],
                structuredContent: {
                    success: true,
                    field: field as string,
                    value: value as JsonValue,
                    fieldType: config.fields[field as string]?.type
                }
            }
        },
    })
}