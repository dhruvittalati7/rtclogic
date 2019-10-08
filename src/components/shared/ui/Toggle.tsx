import React from 'react'
import { mem } from 'src/utils/mem'
import styles from './Toggle.module.scss'

interface Props {
  checked?: boolean
  name: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Toggle = mem(({ name, checked, onChange }: Props) => {
  return (
    <div className={styles.root}>
      <input type="checkbox" id={name} name={name} onChange={onChange} value={1} checked={checked} />
      <label htmlFor={name} data-status={checked ? 'On' : 'Off'} />
    </div>
  )
})
