import {FormConfig, FormState} from "../types"
import { defineTool } from "webmcp-adapter"
import { getFieldsEmptyValues } from "../utils"

export function createResetFormTool(config: FormConfig, state: FormState) {
    return defineTool({
        name: `reset_${config.formId}_form`,
        description: `Reset the ${config.formId} form to its initial state. This will clear all field values.`,
        inputSchema: {
            type: "object",
            properties: {},
            required: []
        },
        execute: () => {
            if (state.reset) {
                state.reset()
            } else {
                for (const [fieldName, value] of Object.entries(getFieldsEmptyValues(config.fields))) {
                    state.setFieldValue(fieldName, value)
                }
            }

            return {
                content: [{
                    type: 'text',
                    text: `Form "${config.formId}" has been reset to its initial state.`
                }],
                structuredContent: {
                    success: true,
                    formId: config.formId,
                    action: 'reset'
                }
            }
        }
    })
}