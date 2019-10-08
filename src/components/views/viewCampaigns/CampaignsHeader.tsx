import React from 'react'
import classNames from 'classnames'
import { DialButton } from 'src/components/shared/ui/DialButton'
import styles from './CampaignsHeader.module.scss'

export const CampaignsHeader = () => (
  <div className={classNames(styles.root, styles.dark)}>
    <DialButton />
  </div>
)
