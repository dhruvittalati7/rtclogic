import React from 'react'
import { mem } from 'src/utils/mem'
import styles from 'src/components/shared/ui/form/InputReadonly.module.scss'
import classNames from 'classnames'

interface Props {
  value: string
  icon?: React.ReactNode
  className?: string
}

export const InputReadonly = mem(({ value, icon, className }: Props) => {
  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.input}>
        <div className={styles.pseudoInput}>
          <span>{value}</span>
          {icon}
        </div>
      </div>
    </div>
  )
})
