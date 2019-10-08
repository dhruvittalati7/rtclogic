import React from 'react'
import classNames from 'classnames'
import { BaseFormInputProps } from 'src/hooks/useForm'
import { FormField } from 'src/components/shared/ui/form/FormField'
import { useInputPhoneMask } from 'src/hooks/useInputPhoneMask'
import styles from './Text.module.scss'

export interface Props extends BaseFormInputProps {
  type?: 'text' | 'password' | 'number'
  isPhone?: boolean
  isPhoneWithoutCode?: boolean
  placeholder?: string
  className?: string
  onClick?: () => void
  onFocus?: () => void
  onEnter?: (value: string) => void
  disableWrapper?: boolean
  inputProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
}

export const FormFieldText = (props: Props) => {
  const { value, isPhone, isPhoneWithoutCode, onChange, readonly } = props
  const { setInputRef, formatValue } = useInputPhoneMask(isPhoneWithoutCode)

  const filterValue = React.useCallback(
    (value: string) => {
      return (isPhone || isPhoneWithoutCode)
        ? formatValue(value)
        : value
    },
    [isPhone, isPhoneWithoutCode, formatValue]
  )

  React.useEffect(() => {
    const filteredValue = filterValue(value)
    if (filteredValue !== value) {
      onChange(filteredValue)
    }
  }, [value, isPhone, isPhoneWithoutCode, filterValue, onChange])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = filterValue(e.target.value)
    onChange(nextValue)
  }

  const onKeyPress = (e: React.KeyboardEvent) => {
    if (props.onEnter && e.charCode === 13) {
      e.preventDefault()
      props.onEnter(props.value)
    }
  }

  const renderInput = () => (
    <input
      {...props.inputProps}
      ref={setInputRef}
      className={classNames(styles.root, styles.dark, props.className)}
      type={props.type || 'text'}
      name={props.name}
      value={props.value}
      placeholder={props.placeholder}
      readOnly={readonly}
      onChange={onInputChange}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
      onClick={props.onClick}
      onKeyPress={onKeyPress}
    />
  )

  const renderWrapper = (input: React.ReactNode) => (
    <FormField
      label={props.label}
      error={props.error}
      hintTopRight={props.hintTopRight}
      hintBottomLeft={props.hintBottomLeft}
      hintBottomRight={props.hintBottomRight}
      hideBottom={props.hideBottom}
    >
      {input}
    </FormField>
  )

  return props.disableWrapper
    ? renderInput()
    : renderWrapper(renderInput())
}
