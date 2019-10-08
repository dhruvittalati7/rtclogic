import React from 'react'
import classNames from 'classnames'
import { SvgItem } from 'src/components/shared/ui/SvgItem'
import styles from './ButtonSend.module.scss'

interface Props {
  disabled?: boolean
  onClick: () => void
}

export const ChatInputButtonSend = ({ disabled, onClick }: Props) => (
  <button className={classNames(styles.icon, styles.dark, styles.send, disabled && styles.disabled)} onClick={onClick}>
    <div className={styles.round}>
      <SvgItem id={'svg-send'} className={styles.iconSend} width={21} height={20} />
    </div>
  </button>
)
