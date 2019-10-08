import React, { ChangeEvent } from 'react'
import styles from './Checkbox.module.scss'

interface Props {
  id: string
  label?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  isChecked?: boolean
}

export const ViewContactsContentTableCheckbox = ({ label, id, onChange, isChecked = false }: Props) => (
  <div className={styles.root}>
    <input type="checkbox" id={id} value={id} onChange={onChange} checked={isChecked}/>
    <label htmlFor={id}>{label}</label>
  </div>
)
