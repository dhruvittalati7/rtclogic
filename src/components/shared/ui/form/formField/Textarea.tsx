import React from 'react'
import classNames from 'classnames'
import { BaseFormInputProps } from 'src/hooks/useForm'
import { FormField } from 'src/components/shared/ui/form/FormField'
import styles from './Textarea.module.scss'

export interface Props extends BaseFormInputProps {
  placeholder?: string
  className?: string
  textareaProps?: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
}

export const FormFieldTextarea = (props: Props) => {
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (props.onChange) {
      props.onChange(value)
    }
  }
  return (
    <FormField
      label={props.label}
      error={props.error}
      hintTopRight={props.hintTopRight}
      hintBottomLeft={props.hintBottomLeft}
      hintBottomRight={props.hintBottomRight}
    >
      <textarea
        {...props.textareaProps}
        className={classNames(styles.root, styles.dark, props.textareaProps && props.textareaProps.className, props.className)}
        name={props.name}
        value={props.value}
        placeholder={props.placeholder}
        readOnly={props.readonly}
        onChange={onChange}
        onBlur={props.onBlur}
      />
    </FormField>
  )
}
