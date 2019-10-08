import React from 'react'
import classNames from 'classnames'
import { SvgItem } from 'src/components/shared/ui/SvgItem'
import styles from './ButtonEmoji.module.scss'

interface Props {
  onClick: () => void
}

export const ButtonEmoji = ({ onClick }: Props) => (
  <button type="button" className={classNames(styles.root, styles.dark)} onClick={onClick}>
    <SvgItem id={'svg-smile'} width={22} height={22} />
  </button>
)
