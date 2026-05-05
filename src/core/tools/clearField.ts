import {FormConfig, FormState} from "../types"
import {defineTool} from "webmcp-adapter"
import { fieldDescription, getFieldEmptyValue } from "../utils"

export function createClearFieldTool(config: FormConfig, state: FormState) {
    return defineTool({
        name: `clear_${config.formId}_field`,
        description: `Clear a field in the ${config.formId} form to its default empty value.\n\nAvailable fields:\n${fieldDescription(config.fields)}`,
        schema: {
            type: "object",
            properties: {
                field: {
                    type: "string",
                    enum: Object.keys(config.fields),
                    description: "The field name to clear"
                }
            },
            required: ["field"]
        },
        execute: ({ field }) => {
            const fieldName = field as string
            const fieldConfig = config.fields[fieldName]

            if (!fieldConfig) {
                return {
                    content: [{ type: 'text', text: `Unknown field: ${fieldName}` }],
                    isError: true,
                    structuredContent: {
                        success: false,
                        error: `Unknown field: ${fieldName}`
                    }
                }
            }
            const emptyValue = getFieldEmptyValue(fieldConfig)
            state.setFieldValue(field, emptyValue)
            return {
                content: [{ type: 'text', text: `Cleared "${fieldName}" to ${JSON.stringify(emptyValue)}` }],
                structuredContent: {
                    success: true,
                    field: fieldName,
                    value: emptyValue,
                    fieldType: fieldConfig.type
                }
            }
        }
    })
}