import type { FormConfig, FormState, FormToolsResult } from './types'
import {
    createFillFieldTool,
    createFillMultipleFieldsTool,
    createGetFormStateTool,
    createGetFieldValueTool,
    createSubmitFormTool,
    createResetFormTool,
    createClearFieldTool,
    createValidateFromTool
} from './tools'

export function createFormTools(config: FormConfig, state: FormState): FormToolsResult {
    return {
        tools: [
            createFillFieldTool(config, state),
            createFillMultipleFieldsTool(config, state),
            createGetFormStateTool(config, state),
            createGetFieldValueTool(config, state),
            createSubmitFormTool(config, state),
            createResetFormTool(config, state),
            createClearFieldTool(config, state),
            createValidateFromTool(config, state)
        ]
    }
}