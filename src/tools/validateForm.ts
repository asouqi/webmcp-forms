import { FormConfig, FormState } from "../types"
import { validateFormValues } from "../utils"
import { defineTool, isStandardSchema, validateWithStandardSchema } from "webmcp-adapter"

export function createValidateFormTool(config: FormConfig, state: FormState) {
    return defineTool({
        name: `validate_${config.formId}_form`,
        description: `Validate all fields in the ${config.formId} form without submitting. Returns validation errors if any fields are invalid.`,
        inputSchema: {
            type: "object",
            properties: {},
            required: []
        },
        execute: async () => {
            const values = state.getValues()

            let isValid: boolean
            let errors: {} | { _form: string }
            let validFields: string[]

            const formSchema = config.validationSchema?.form

            if (formSchema && isStandardSchema(formSchema)) {
                const result = await validateWithStandardSchema(formSchema, values)
                isValid = result.valid
                errors = result.errors ?? {}
                validFields = isValid
                    ? Object.keys(config.fields)
                    : Object.keys(config.fields).filter(f => !(f in errors))
            } else {
                // Fall back to per-field JSON Schema validation
                ;({ isValid, errors, validFields } = validateFormValues(values, config.fields))
            }

            const responseText = isValid
                ? `✓ Form "${config.formId}" is valid and ready to submit.`
                : `✗ Form "${config.formId}" has validation errors:\n${
                    Object.entries(errors).map(([f, e]) => `• ${f}: ${e}`).join('\n')
                }`

            return {
                content: [{ type: 'text', text: responseText }],
                structuredContent: {
                    formId: config.formId,
                    isValid,
                    errors,
                    validFields,
                    fieldCount: Object.keys(config.fields).length,
                    errorCount: Object.keys(errors).length
                }
            }
        }
    })
}