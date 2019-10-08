import React from 'react'
import classNames from 'classnames'
import styles from './Selector.module.scss'

interface Props {
  value1: any
  value2: any
  label1: React.ReactNode
  label2: React.ReactNode
  selected?: any
  onChange: (value: any) => void
  className?: string
}

export const Selector = ({ value1, value2, label1, label2, selected, className, onChange }: Props) => {
  const [ref1, setRef1] = React.useState<HTMLDivElement | null>(null)
  const [ref2, setRef2] = React.useState<HTMLDivElement | null>(null)
  const [refS, setRefS] = React.useState<HTMLDivElement | null>(null)

  if (ref1 && ref2 && refS) {
    if (selected === value1) {
      refS.style.left = `4px`
      refS.style.width = `${ref1.clientWidth - 8}px`
    }
    if (selected === value2) {
      refS.style.left = `${ref1.clientWidth + 4}px`
      refS.style.width = `${ref2.clientWidth - 8}px`
    }
  }

  return (
    <div className={classNames(styles.root, className)}>
      <div ref={setRefS} className={styles.selector} />
      <div ref={setRef1} className={styles.item} onClick={() => onChange(value1)}>{label1}</div>
      <div ref={setRef2} className={styles.item} onClick={() => onChange(value2)}>{label2}</div>
    </div>
  )
}
