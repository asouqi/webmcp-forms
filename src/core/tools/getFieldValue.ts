import {FormConfig, FormState} from "../types"
import { defineTool, JsonValue } from "webmcp-adapter"

export function createGetFieldValueTool(config: FormConfig, state: FormState) {
    return defineTool({
        name: `get_${config.formId}_field_value`,
        description: `Get the current value of a specific field in the ${config.formId} form.`,
        inputSchema: {
            type: "object",
            properties: {
                field: {
                    type: "string",
                    enum: Object.keys(config.fields),
                    description: "The field name to get the value of"
                }
            },
            required: ["field"]
        },
        execute: ({ field }) => {
            const fieldName = field as string

            if (!(fieldName in config.fields)){
                return {
                    content: [{
                        type: 'text',
                        text: `Unknown field: "${fieldName}"`
                    }],
                    isError: true
                }
            }

            const value = state.getValue()[fieldName]

            return {
                content: [{
                    type: 'text',
                    text: `Field "${fieldName}" value: ${JSON.stringify(value)}`
                }],
                structuredContent: {
                    success: true,
                    field: fieldName,
                    value: value as JsonValue,
                }
            }
        }
    })
}