import React from 'react'
import classNames from 'classnames'
import { BaseFormInputWrapperProps } from 'src/hooks/useForm'
import { FormLabel } from 'src/components/shared/ui/form/FormLabel'
import styles from './FormField.module.scss'

interface Props extends BaseFormInputWrapperProps {
  children: React.ReactNode
  className?: string
  divProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
}

export const FormField = (props: Props) => {
  const { label, hintTopRight, hintBottomLeft, hintBottomRight, hideBottom, error, children } = props
  return (
    <div {...props.divProps} className={classNames(styles.root, styles.dark, hideBottom && styles.hideBottom)}>
      <FormLabel>{label}</FormLabel>
      {(error || hintTopRight) && <div className={classNames(styles.hint, styles.htr, error && styles.error)}>{error || hintTopRight}</div>}
      {!hideBottom && (
        <>
          {hintBottomLeft && <div className={classNames(styles.hint, styles.hbl)}>{hintBottomLeft}</div>}
          {hintBottomRight && <div className={classNames(styles.hint, styles.hbr)}>{hintBottomRight}</div>}
        </>
      )}
      {children}
    </div>
  )
}
