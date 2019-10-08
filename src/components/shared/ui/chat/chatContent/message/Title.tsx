import React from 'react'
import classNames from 'classnames'
import { Avatar } from 'src/components/shared/ui/Avatar'
import { CallIcon } from 'src/components/shared/ui/Icons'
import { messageDateFormat, secondsToTimeString } from 'src/helpers/DateHelper'
import { TMessage } from 'src/models/Message'
import { TAccount } from 'src/models/Account'
import { voiceCallResultMap } from 'src/helpers/ChatHelper'
import styles from './Title.module.scss'

interface Props {
  item: TMessage
  account: TAccount | null
  call: (targetNumber: string) => void
}

export const MessageTitle = ({ item, account, call }: Props) => (
  <div className={styles.root}>
    {item.voiceCall
      ? (
        <div className={styles.callAvatar}>
          <CallIcon width={15} height={16} />
        </div>
      )
      : <Avatar type={'message'} account={account} system={item.type === 'system'} />}

    {renderWho(item, account, call)}
    <div className={styles.date}>{messageDateFormat(item.timestamp)}</div>

    {item.voiceCall && (
      <div className={styles.callStatus}>
        {voiceCallResultMap[item.voiceCall.result]}
        {item.voiceCall.duration > 0 && (
          <div className={styles.time}>({secondsToTimeString(item.voiceCall.duration)})</div>
        )}
      </div>
    )}
  </div>
)

const renderWho = (item: TMessage, account: TAccount | null, call: (targetNumber: string) => void) => {
  let result: React.ReactNode = ''
  if (item.number) {
    result = (
      <div className={classNames(styles.who, styles.clickable)} onClick={() => call(item.number)}>
        {item.number}
      </div>
    )
  } else if (account) {
    result = <div className={styles.who}>{account.profile.displayName}</div>
  }

  return result
}
