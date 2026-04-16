import type { FormConfig, FormState, FormToolsResult } from './types'
import { createFillFieldTool } from './tools'

export function createFormTools(config: FormConfig, state: FormState): FormToolsResult {
    return {
        tools: [createFillFieldTool(config, state)]
    }
}