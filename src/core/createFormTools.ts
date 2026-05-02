import type { FormConfig, FormState, FormToolsResult } from './types'
import {
    createFillFieldTool,
    createGetFormStateTool,
    createGetFieldValueTool,
    createSubmitFormTool,
    createResetFormTool
} from './tools'

export function createFormTools(config: FormConfig, state: FormState): FormToolsResult {
    return {
        tools: [
            createFillFieldTool(config, state),
            createGetFormStateTool(config, state),
            createGetFieldValueTool(config, state),
            createSubmitFormTool(config, state),
            createResetFormTool(config, state)
        ]
    }
}