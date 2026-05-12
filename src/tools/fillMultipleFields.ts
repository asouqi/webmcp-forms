import {FormConfig, FormState} from "../types"
import {defineTool, JsonValue} from "webmcp-adapter"
import { buildFieldValueSchema, fieldDescription } from "../utils"

function buildToolSchema(config: FormConfig) {
    const fieldSchema: Record<string, unknown> = {}

    for (const [fieldName, fieldConfig] of Object.entries(config.fields)) {
        fieldSchema[fieldName] = buildFieldValueSchema(fieldConfig)
    }

    return {
        type: "object",
        properties: {
            fields: {
                type: "object",
                description: "Object containing field names as keys and their values",
                properties: fieldSchema,
                additionalProperties: false
            },
        },
        required: ["fields"],
    }
}

export function createFillMultipleFieldsTool(config: FormConfig, state: FormState) {
    return defineTool({
        name: `fill_${config.formId}_multiple_fields`,
        description: `Fill multiple fields in the ${config.formId} form at once. More efficient than calling 
        fill_field multiple times.\n\nAvailable fields:\n${fieldDescription(config.fields)}`,
        inputSchema: buildToolSchema(config),
        validator: config.validationSchema?.fillMultipleField,
        execute: ({ fields }) => {
            const fieldsObj = fields as Record<string, JsonValue>
            const updatedFields: string[] = []
            const skippedFields: string[] = []
            const updates: Record<string, JsonValue> = {}

            for (const [fieldName, value] of Object.entries(fieldsObj)) {
                if (!(fieldName in config.fields)) {
                    skippedFields.push(fieldName)
                    continue
                }

                state.setFieldValue(fieldName, value)
                updatedFields.push(fieldName)
                updates[fieldName] = value
            }

            let responseText = ""
            if (updatedFields.length > 0) {
                responseText = `Updated ${updatedFields.length} field(s): ${updatedFields.join(', ')}`
            }
            if (skippedFields.length > 0) {
                responseText += `\nSkipped unknown field(s): ${skippedFields.join(', ')}`
            }
            if (updatedFields.length === 0 && skippedFields.length === 0) {
                responseText = "No fields provided to update"
            }
            return {
                content: [{ type: "text", text: responseText }],
                structuredContent: {
                    success: updatedFields.length > 0,
                    formId: config.formId,
                    updatedFields,
                    skippedFields,
                    updates
                }
            }
        }
    })
}