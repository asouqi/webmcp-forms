import {FormConfig, FormState} from "../types";
import {defineTool} from "../../../../webmcp-adapter";

const getDefaultValue = (config: FormConfig) => {
    const defaultValues: Record<string, unknown> = {}
    for (const [fieldName, fieldConfig] of Object.entries(config.fields)) {
        switch (fieldConfig.type) {
            case "string":
                defaultValues[fieldName] = ''
                break
            case "number":
                defaultValues[fieldName] = 0
                break
            case "boolean":
                defaultValues[fieldName] = false
                break
            case "object":
                defaultValues[fieldName] = {}
                break
            case "array":
                defaultValues[fieldName] = []
        }
    }

    return defaultValues
}

export function createResetFormTool(config: FormConfig, state: FormState) {
    return defineTool({
        name: `reset_${config.formId}_form`,
        description: `Reset the ${config.formId} form to its initial state. This will clear all field values.`,
        schema: {
            type: "object",
            properties: {},
            required: []
        },
        execute: () => {
            if (state.reset) {
                state.reset()
            } else {
                for (const [fieldName, value] of Object.entries(getDefaultValue(config))) {
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