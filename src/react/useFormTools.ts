import {useEffect, useRef} from "react"
import { registerBatch, JsonValue } from "webmcp-adapter"
import {createFormTools, FormField} from "../core"

export interface UseFormToolsOptions {
    formId: string
    fields: Record<string, FormField>
    values: Record<string, JsonValue>
    onChange: (field: string, value: JsonValue) => void
    onSubmit?: () => void | Promise<void>
    onReset?: () => void
}

export function useFormTools(options: UseFormToolsOptions) {
    const { formId, fields, values, onChange, onSubmit, onReset } = options
    const onChangeRef = useRef(onChange)
    onChangeRef.current = onChange // that make sure we use updated onChange at useEffect as we don't
    // have in the dependencies to avoid unnecessary re-registrations

    const valuesRef = useRef(values)
    valuesRef.current = values

    const onSubmitRef = useRef(onSubmit)
    onSubmitRef.current = onSubmit

    const onResetRef = useRef(onReset)
    onResetRef.current = onReset

    useEffect(() => {
       const { tools } = createFormTools(
           {
               formId,
               fields
           },
           {
               setFieldValue: (field, value) => onChangeRef.current(field, value),
               getValue: () => valuesRef.current,
               submit: onSubmitRef.current ? async () => await onSubmitRef.current?.() : undefined,
               reset: onResetRef.current ? () => onResetRef.current?.() : undefined
           }
       )
        const unregisterAll = registerBatch(tools)
        return () => {
            unregisterAll()
        }
    }, [formId, fields])
}