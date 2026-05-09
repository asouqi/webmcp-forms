import {FormConfig, FormState} from "../types"
import { defineTool } from "webmcp-adapter"

export function createSubmitFormTool(config: FormConfig, state: FormState) {
    return defineTool({
        name: `submit_${config.formId}_form`,
        description: `Submit the ${config.formId} form.`,
        inputSchema: {
            type: "object",
            properties: {},
            required: []
        },
        execute: async () => {
            const values = state.getValues()

            if (state.submit) {
                try {
                    await state.submit()
                } catch (error) {
                    const message: string = error instanceof Error ? error.message : String(error)
                    return {
                        content: [{
                            type: 'text',
                            text: `Form submission failed: ${message}`
                        }],
                        isError: true,
                        structuredContent: {
                            success: false,
                            formId: config.formId,
                            values: null,
                            error: message
                        }
                    }
                }
            }

            return {
                content: [{
                    type: 'text',
                    text: `Form "${config.formId}" submitted successfully!`
                }],
                structuredContent: {
                    success: true,
                    formId: config.formId,
                    values,
                    error: null
                }
            }
        }
    })
}
