import {FormConfig, FormState} from "../types";
import { defineTool, JsonValue } from "webmcp-adapter"

export function createGetFormStateTool(config: FormConfig, state: FormState) {
    return defineTool({
        name: `get_${config.formId}_state`,
        description: `Get the current state of all fields in the ${config.formId} form.
                      Returns an object with field names as keys and their current values.`,
        inputSchema: {
            type: "object",
            properties: {},
            required: []
        },
        execute: () => {
            const values = state.getValues() as Record<string, JsonValue>
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(values, null, 2)
                }],
                structuredContent: {
                    success: true,
                    formId: config.formId,
                    values
                }
            }
        }
    })
}
