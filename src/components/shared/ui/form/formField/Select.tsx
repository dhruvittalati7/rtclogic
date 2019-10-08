import React from 'react'
import { BaseFormInputProps } from 'src/hooks/useForm'
import { FormField } from 'src/components/shared/ui/form/FormField'
import { Select, ReactSelectProps } from 'src/components/shared/ui/Select'

export interface Props extends BaseFormInputProps {
  options: TOption[]
  placeholder?: string
  hideBottom?: boolean
  reactSelectProps?: Partial<ReactSelectProps>
  disableWrapper?: boolean
}

export const FormFieldSelect = (props: Props) => {
  const { options, placeholder, hideBottom, reactSelectProps } = props

  const renderInput = () => (
    <Select
      placeholder={placeholder}
      value={props.value}
      options={options}
      onSelect={props.onChange}
      reactSelectProps={reactSelectProps}
    />
  )

  const renderWrapper = (inner: React.ReactNode) => (
    <FormField
      hideBottom={hideBottom}
      label={props.label}
      error={props.error}
      hintTopRight={props.hintTopRight}
      hintBottomLeft={props.hintBottomLeft}
      hintBottomRight={props.hintBottomRight}
    >
      {inner}
    </FormField>
  )

  return props.disableWrapper
    ? renderInput()
    : renderWrapper(renderInput())
}
