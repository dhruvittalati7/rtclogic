import React from 'react'
import { TModel as TNumber } from 'src/models/dids/Number'
import styles from './NumberLabel.module.scss'
import { formatPhoneNumber } from 'src/helpers/PhoneHelper'

interface Props {
  number: TNumber
  showWay?: boolean
  showType?: boolean
  showVoice?: boolean
  showBulk?: boolean
  showMobile?: boolean
}

export const NumberLabel = ({ number, showWay, showType, showVoice, showBulk, showMobile }: Props) => {
  const badges: string[] = []

  if (showMobile) {
    badges.push(number.provider === 'tirade' ? 'mobile' : 'virtual')
  }

  if (showWay) {
    if (number.capabilities.oneWay) {
      badges.push('one-way')
    } else if (number.capabilities.twoWay) {
      badges.push('two-way')
    }
  }

  if (showType) {
    if (number.capabilities.sms) {
      badges.push('sms')
    }
    if (number.capabilities.mms) {
      badges.push('mms')
    }
  }

  if (showVoice && number.capabilities.voice) {
    badges.push('voice')
  }

  if (showBulk) {
    if (number.capabilities.bulkSms) {
      badges.push('bulkSms')
    }
    if (number.capabilities.bulkMms) {
      badges.push('bulkMms')
    }
  }

  return (
    <div className={styles.root}>
      <span>{formatPhoneNumber(number.number)}</span>
      {badges.map(badge => (
        <span key={badge} className={styles.badge}>{badge}</span>
      ))}
    </div>
  )

}
