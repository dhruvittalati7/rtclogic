import React, { useState } from 'react'
import { FormFieldText } from 'src/components/shared/ui/form/formField/Text'
import { EyeIcon, EyeStrikeIcon } from 'src/components/shared/ui/Icons'
import { BaseFormInputProps } from 'src/hooks/useForm'
import styles from './Password.module.scss'

interface Props extends BaseFormInputProps {
  placeholder?: string
  className?: string
  onClick?: () => void
  onFocus?: () => void
  onEnter?: (value: string) => void
  inputProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  label: string
}

export const FormFieldPassword = (props: Props) => {
  const [showPassword, toggleShowPassword] = useState(false)

  return (
    <div className={styles.root}>
      <FormFieldText
        className={styles.input}
        type={showPassword ? 'text' : 'password'}
        inputProps={{ autoComplete: 'new-password' }}
        {...props}
      />
      {showPassword && <EyeIcon className={styles.icon} width={25} height={25} onClick={() => toggleShowPassword(!showPassword)} />}
      {!showPassword && <EyeStrikeIcon className={styles.icon} width={25} height={25} onClick={() => toggleShowPassword(!showPassword)} />}
    </div>
  )
}
