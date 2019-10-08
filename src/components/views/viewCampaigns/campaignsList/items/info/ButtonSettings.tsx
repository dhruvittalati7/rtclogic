import React from 'react'
import styles from './ButtonSettings.module.scss'
import { SvgItem } from 'src/components/shared/ui/SvgItem'

interface Props {
  onClick: () => void
}

export const InfoButtonSettings = ({ onClick }: Props) => {
  const onBtnClick = (e: any) => {
    e.stopPropagation()
    onClick()
  }

  return (
    <div className={styles.root} onClick={onBtnClick}>
      <SvgItem id={'svg-settings'} width={25} height={25} />
    </div>
  )
}
