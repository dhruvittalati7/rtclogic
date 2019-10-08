import React from 'react'
import classNames from 'classnames'
import { TickIcon } from 'src/components/shared/ui/Icons'
import styles from './Checkbox.module.scss'

interface Props {
  children: any
  checked: boolean
  onChange: (checked: boolean) => void
  classes?: {
    root?: string
    block?: string
    tick?: string
  }
}

export const Checkbox = ({ children, checked, onChange, classes = {} }: Props) => (
  <div className={classNames(styles.root, classes.root)} onClick={() => onChange(!checked)}>
    <div className={classNames(styles.block, classes.block)}>
      {checked && <TickIcon width={10} height={8} className={classNames(styles.tick, classes.tick)} />}
    </div>
    {children}
  </div>
)
