import React from 'react'
import classNames from 'classnames'
import { SvgItem } from 'src/components/shared/ui/SvgItem'
import styles from './ButtonKeyboard.module.scss'

interface Props {
  onClick: () => void
}

export const ButtonKeyboard = ({ onClick }: Props) => (
  <button type="button" className={classNames(styles.root, styles.dark)} onClick={onClick}>
    <SvgItem id={'svg-keyboard'} width={28} height={18} />
  </button>
)
