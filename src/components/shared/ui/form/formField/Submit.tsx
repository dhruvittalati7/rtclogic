import React from 'react'
import classNames from 'classnames'
import { Button, Props as ButtonProps } from 'src/components/shared/ui/Button'
import styles from './Submit.module.scss'

interface Props extends ButtonProps {
}

export const FormFieldSubmit = (props: Props) => (
  <Button {...props} type={'submit'} className={classNames(styles.root, props.className)}>
    {props.children}
  </Button>
)
