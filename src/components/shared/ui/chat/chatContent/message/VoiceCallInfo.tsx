import React from 'react'
import { CallIcon } from 'src/components/shared/ui/Icons'
import { TMessage } from 'src/models/Message'
import styles from './VoiceCallInfo.module.scss'
import { secondsToTimeString } from 'src/helpers/DateHelper'
import { voiceCallResultMap } from 'src/helpers/ChatHelper'

interface Props {
  item: TMessage
}

export const MessageVoiceCallInfo = ({ item }: Props) => {
  return item.voiceCall && (
    <div className={styles.root}>
      <CallIcon width={15} height={16} />
      <div className={styles.info}>
        {voiceCallResultMap[item.voiceCall.result]}
        {item.voiceCall.duration > 0 && (
          <div className={styles.time}>{secondsToTimeString(item.voiceCall.duration)}</div>
        )}
      </div>
    </div>
  )
}
