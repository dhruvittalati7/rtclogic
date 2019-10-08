import React from 'react'
import styles from './Error.module.scss'

interface Props {
  children: React.ReactNode
}

export const CampaignsFormError = ({ children }: Props) => (
  <div className={styles.root}>
    {children}
  </div>
)
