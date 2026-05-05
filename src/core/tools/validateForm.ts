import {FormConfig, FormState} from "../types"
import { buildFieldSchema, isEmpty } from "../utils"
import {defineTool, validateJsonSchema} from "webmcp-adapter"

export function createValidateFromTool(config: FormConfig, state: FormState) {
    return defineTool({
        name: `validate_${config.formId}_form`,
        description: `Validate all fields in the ${config.formId} form without submitting. Returns validation errors if any fields are invalid.`,
        schema: {
            type: "object",
            properties: {},
            required: []
        },
        execute: () => {
            const values = state.getValue()
            const errors: Record<string, string> = {}
            const validFields = []
            let isValid = true
            for (const [fieldName, fieldConfig] of Object.entries(config.fields)) {
                const value = values[fieldName]
                const label = fieldConfig.label || fieldName
                // check required fields
                if (fieldConfig.required && isEmpty(value)) {
                    errors[fieldName] = `${label} is required`
                    isValid = false
                    continue
                }
                // skip validation for empty optional fields
                if (isEmpty(value)) {
                    validFields.push(fieldName)
                    continue
                }

                // Validate against field schema
                const fieldSchema = buildFieldSchema(fieldConfig)
                const result = validateJsonSchema(fieldSchema, value)

                if (!result.valid) {
                    errors[fieldName] = result.error || `${label} is invalid`
                    isValid = false
                } else {
                    validFields.push(fieldName)
                }
            }

            let responseText: string
            if (isValid) {
                responseText = `✓ Form "${config.formId}" is valid and ready to submit.`
            } else {
                const errorList = Object.entries(errors)
                    .map(([field, error]) => `• ${field}: ${error}`)
                    .join('\n')
                responseText = `✗ Form "${config.formId}" has validation errors:\n${errorList}`
            }

            return {
                content: [{ type: 'text', text: responseText }],
                structuredContent: {
                    formId: config.formId,
                    isValid,
                    errors: isValid ? undefined : errors,
                    validFields,
                    fieldCount: Object.keys(config.fields).length,
                    errorCount: Object.keys(errors).length
                }
            }
        }
    })
}