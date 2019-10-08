import React from 'react'
import { Emoji } from 'emoji-mart'
import styles from './CodeLabel.module.scss'

interface Props {
  countryData: {
    name: string
    code: string
    callingCode: string
  }
}

export const PhoneCodeLabel = ({ countryData }: Props) => (
  <div className={styles.root}>
    <Emoji size={16} emoji={`:flag-${countryData.code.toLowerCase()}:`} />
    <div className={styles.code}>
      {countryData.code}
    </div>
    <div className={styles.num}>
      +{countryData.callingCode}
    </div>
  </div>
)
