import {JsonValue, StandardSchema, ToolDefinition} from "webmcp-adapter"
import type { FormField, FormConfig, FormState, FormTools } from './types'
import {
    createFillFieldTool,
    createFillMultipleFieldsTool,
    createGetFormStateTool,
    createGetFieldValueTool,
    createSubmitFormTool,
    createResetFormTool,
    createClearFieldTool,
    createValidateFormTool,
} from './tools'

const TOOL_CREATORS: Record<FormTools, (config: FormConfig, state: FormState) => ToolDefinition> = {
    "fill-field": createFillFieldTool,
    "fill-multiple-field": createFillMultipleFieldsTool,
    "get-form-state": createGetFormStateTool,
    "get-field-value": createGetFieldValueTool,
    "submit-form": createSubmitFormTool,
    "reset-form": createResetFormTool,
    "clear-field": createClearFieldTool,
    "validate-form": createValidateFormTool,
}

export interface CreateFormToolsOptions {
    formId: string
    fields: Record<string, FormField>
    validationSchema?: StandardSchema
    getValues: () => Record<string, JsonValue>
    onChange: (field: string, value: JsonValue) => void
    onSubmit?: () => void | Promise<void>
    onReset?: () => void
    selectedTools?: Set<FormTools>,
    customTools?: ToolDefinition[]
}

export function createFormTools(options: CreateFormToolsOptions): ToolDefinition[] {
    const { formId, fields, validationSchema, getValues, onChange, onSubmit, onReset, selectedTools, customTools = [] } = options
    const config: FormConfig = {
        formId,
        fields,
        validationSchema
    }

    const state: FormState = {
        getValues,
        setFieldValue: (field, value) => onChange(field, value),
        reset: onReset,
        submit: onSubmit,
    }

    const keys = selectedTools ? Array.from(selectedTools.keys()) : Object.keys(TOOL_CREATORS) as FormTools[]
    const tools = keys.map(key => TOOL_CREATORS[key](config, state)).filter(Boolean)
    return [...customTools, ...tools]
}
