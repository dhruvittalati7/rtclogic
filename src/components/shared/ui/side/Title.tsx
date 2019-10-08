import React from 'react'
import styles from './Title.module.scss'

interface Props {
  title: string
}

export const SideTitle = ({ title }: Props) => <div className={styles.root}>{title}</div>
