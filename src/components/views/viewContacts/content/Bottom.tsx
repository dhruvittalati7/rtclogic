import React from 'react'
import styles from './Bottom.module.scss'
import { Button } from 'src/components/shared/ui/Button'
import classNames from 'classnames'

interface Props {
  setShow: (value: boolean) => void
  clear: () => void
  values: number[]
}

export const ViewContactsContentBottom = ({ setShow, values, clear }: Props) => (
  <div className={styles.root}>
    <Button className={styles.btn} disabled={!values.length} onClick={() => setShow(true)}>
      Create chat
    </Button>
    <Button className={classNames(styles.btn, styles.clear)} onClick={() => clear()}>
      Clear
    </Button>
  </div>
)
