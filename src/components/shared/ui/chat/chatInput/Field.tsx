import React from 'react'
import classNames from 'classnames'
import styles from './Field.module.scss'

interface Props {
  inputRef: React.RefObject<HTMLTextAreaElement>
  value: string
  autoFocus: boolean
  onChange: (value: string) => void
}

export const ChatInputField = ({ inputRef, value, autoFocus, onChange }: Props) => (
  <textarea
    ref={inputRef}
    autoFocus={autoFocus}
    className={classNames(styles.root, styles.dark)}
    value={value}
    placeholder={'Start typing your message...'}
    onChange={e => onChange(e.target.value)}
  />
)
