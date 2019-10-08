import React from 'react'
import { diff } from 'deep-object-diff'

type TErrors<T> = { [key in keyof T]: string }
type TTouched<T> = { [key in keyof T]: boolean }

export function useForm<T extends {}>(
  formInitialValues: T,
  validate: (values: T) => TErrors<T> | undefined,
  submit: (values: T) => Promise<void>,
  initialValid = false,
  readonly = false
) {
  const initialErrors = Object.keys(formInitialValues).reduce((a, k) => ({ ...a, [k]: '' }), {} as TErrors<T>)
  const initialTouched = Object.keys(formInitialValues).reduce((a, k) => ({ ...a, [k]: false }), {} as TTouched<T>)

  const [initialValues, setInitialValues] = React.useState(formInitialValues)
  const [isValid, setIsValid] = React.useState(initialValid)
  const [values, setNextValues] = React.useState<T>(formInitialValues)
  const [errors, setErrors] = React.useState<TErrors<T>>(initialErrors)
  const [touched, setTouched] = React.useState<TTouched<T>>(initialTouched)
  const [submitCount, setSubmitCount] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const canSubmit = !isSubmitting && isValid

  const setValues = (nextValues: T) => {
    const diffNames: (keyof T)[] = Object.keys(diff(values, nextValues)) as (keyof T)[]
    diffNames.forEach((name: keyof T) => {
      if (values[name] !== nextValues[name]) {
        setTouchedField(name)
      }
    })
    setNextValues(nextValues)
    performValidations(validate(nextValues))
  }

  const setTouchedField = (name: keyof T) => setTouched({ ...touched, [name]: true })
  const setError = (name: keyof T, value: any) => setErrors({ ...errors, [name]: value })
  const setValue = <K extends keyof T>(name: K, value: T[K]) => {
    if (value !== values[name]) {
      const nextValues = { ...values, [name]: value }
      setValues(nextValues)
    }
  }

  const onBlur = (name: keyof T) => {
    if (touched[name]) {
      validateField(name)
    }
  }

  const validateField = (name: keyof T) => {
    const err = validate(values)
    if (err && err[name]) {
      setError(name, err[name])
    }
    setIsValid(!err || !Object.keys(err).length)
  }

  const handleForm = () => ({
    onSubmit: async (e: any) => {
      e.preventDefault()
      setSubmitCount(submitCount + 1)
      if (performValidations(validate(values))) {
        setIsSubmitting(true)
        await submit(values)
        setIsSubmitting(false)
      }
    },
  })

  const handleField = (name: keyof T) => ({
    name,
    readonly,
    value: values[name] as any,
    error: (submitCount > 0 || touched[name]) && errors[name],
    onChange: (value: any) => setValue(name, value),
    onBlur: () => onBlur(name),
  })

  const performValidations = (errors?: TErrors<T>): boolean => {
    setErrors(errors || initialErrors)
    const result = !errors || !Object.keys(errors).length
    setIsValid(result)
    return result
  }

  const resetErrors = () => {
    setErrors(initialErrors)
  }

  const resetTouched = () => {
    setTouched(initialTouched)
  }

  const reset = (nextInitialValues?: T) => {
    if (nextInitialValues) {
      setNextValues(nextInitialValues)
      setInitialValues(nextInitialValues)
    } else {
      setNextValues(initialValues)
    }
    resetErrors()
    resetTouched()
  }

  return {
    values,
    setValue,
    setValues,
    errors,
    setError,
    setErrors,
    handleForm,
    handleField,
    isValid,
    submitCount,
    isSubmitting,
    setIsSubmitting,
    canSubmit,
    reset,
    resetErrors,
    resetTouched,
  }
}

export interface BaseFormInputProps<T extends any = any> extends BaseFormInputWrapperProps {
  name: string
  value: T
  onChange: (value: T) => void
  onBlur?: () => void
  onFocus?: () => void
  onKeyPress?: (e: any) => void
  readonly?: boolean
  wrapper?: React.ElementType<BaseFormInputWrapperProps>
}

export interface BaseFormInputWrapperProps {
  label?: React.ReactNode
  error?: string
  hintTopRight?: React.ReactNode
  hintBottomLeft?: React.ReactNode
  hintBottomRight?: React.ReactNode
  hideBottom?: boolean
}
