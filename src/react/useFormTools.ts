import {useEffect, useRef} from "react"
import {registerBatch} from "webmcp-adapter"
import {createFormTools, FormField} from "../core"

export interface UseFormToolsOptions {
    formId: string
    fields: Record<string, FormField>
    onChange: (field: string, value: unknown) => void
}

export function useFormTools(options: UseFormToolsOptions) {
    const { formId, fields, onChange } = options
    const onChangeRef = useRef(onChange)
    onChangeRef.current = onChange // that make sure we use updated onChange at useEffect as we don't
    // have in the dependencies to avoid unnecessary re-registrations
    useEffect(() => {
       const { tools } = createFormTools(
           {formId, fields},
           {setFieldValue: (field, value) => onChangeRef.current(field, value)}
       )
        const unregisterAll = registerBatch(tools)
        return () => {
            unregisterAll()
        }
    }, [formId, fields])
}