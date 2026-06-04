import { useCallback } from 'react'

interface UseFormTesterProps {
    onFillField?: (field: string, value: never) => void
    onFillMultipleFields?: (fields: Record<string, never>) => void
    onValidate?: () => Promise<{ valid: boolean; errors?: never }>
    onSubmit?: () => Promise<void>
    onReset?: () => void
    onClearField?: (field: string) => void
    fields?: Record<string, never>
}

export function useFormTester({
                                  onFillField,
                                  onFillMultipleFields,
                                  onValidate,
                                  onSubmit,
                                  onReset,
                                  onClearField,
                                  fields
                              }: UseFormTesterProps) {

    const executeFillField = useCallback(async (input: never) => {
        try {
            const { field, value } = input

            if (!field) {
                return {
                    success: false,
                    message: 'Missing required field: "field"',
                }
            }

            if (fields && !fields.hasOwnProperty(field)) {
                return {
                    success: false,
                    message: `Unknown field: "${field}"`,
                }
            }

            if (onFillField) {
                onFillField(field, value)
            }

            return {
                success: true,
                message: `Field "${field}" updated successfully`,
            }
        } catch (error: any) {
            return {
                success: false,
                message: 'Execution failed',
                errors: error.message,
            }
        }
    }, [onFillField, fields])

    const executeFillMultipleFields = useCallback(async (input: any) => {
        try {
            const { fields: inputFields } = input

            if (!inputFields || typeof inputFields !== 'object') {
                return {
                    success: false,
                    message: 'Missing required field: "fields" (should be an object)',
                }
            }

            if (onFillMultipleFields) {
                onFillMultipleFields(inputFields)
            }

            return {
                success: true,
                message: `Updated ${Object.keys(inputFields).length} field(s) successfully`,
            }
        } catch (error: unknown) {
            return {
                success: false,
                message: 'Execution failed',
                errors: error.message,
            }
        }
    }, [onFillMultipleFields])

    const executeValidate = useCallback(async () => {
        try {
            if (!onValidate) {
                return {
                    success: true,
                    message: 'No validation configured',
                }
            }

            const result = await onValidate()

            return {
                success: result.valid,
                message: result.valid ? 'All fields are valid!' : 'Validation failed',
                errors: result.errors,
            }
        } catch (error: any) {
            return {
                success: false,
                message: 'Validation error',
                errors: error.message,
            }
        }
    }, [onValidate])

    const executeSubmit = useCallback(async () => {
        try {
            if (!onSubmit) {
                return {
                    success: false,
                    message: 'Submit handler not configured',
                }
            }

            await onSubmit()

            return {
                success: true,
                message: 'Form submitted successfully!',
            }
        } catch (error: any) {
            return {
                success: false,
                message: 'Submit failed',
                errors: error.message,
            }
        }
    }, [onSubmit])

    const executeReset = useCallback(async () => {
        try {
            if (!onReset) {
                return {
                    success: false,
                    message: 'Reset handler not configured',
                }
            }

            onReset()

            return {
                success: true,
                message: 'Form reset to default values',
            }
        } catch (error: any) {
            return {
                success: false,
                message: 'Reset failed',
                errors: error.message,
            }
        }
    }, [onReset])

    const executeClearField = useCallback(async (input: any) => {
        try {
            const { field } = input

            if (!field) {
                return {
                    success: false,
                    message: 'Missing required field: "field"',
                }
            }

            if (fields && !fields.hasOwnProperty(field)) {
                return {
                    success: false,
                    message: `Unknown field: "${field}"`,
                }
            }

            if (!onClearField) {
                return {
                    success: false,
                    message: 'Clear field handler not configured',
                }
            }

            onClearField(field)

            return {
                success: true,
                message: `Field "${field}" cleared successfully`,
            }
        } catch (error: any) {
            return {
                success: false,
                message: 'Clear failed',
                errors: error.message,
            }
        }
    }, [onClearField, fields])

    return {
        executeFillField,
        executeFillMultipleFields,
        executeValidate,
        executeSubmit,
        executeReset,
        executeClearField,
    }
}