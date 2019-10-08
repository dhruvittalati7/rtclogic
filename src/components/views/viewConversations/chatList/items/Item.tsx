import React from 'react'
import { mem } from 'src/utils/mem'
import { TChat } from 'src/models/Chat'
import { chatDateFormat, secondsToTimeString } from 'src/helpers/DateHelper'
import { SideCard } from 'src/components/shared/ui/side/Card'
import { SideCardStatus } from 'src/components/shared/ui/side/CardStatus'
import { voiceCallResultMap } from 'src/helpers/ChatHelper'
import { create } from 'src/models/Message'

interface Props {
  item: TChat
  onClick: (chat: TChat) => void
  isActive: boolean
  innerRef?: React.RefObject<HTMLDivElement>
}

export const ChatListItemsItem = mem(({ item, onClick, isActive, innerRef }: Props) => {
  const activeType = item.numbers.length ? 'green' : 'blue'
  const lastMessage = item.lastMsg ? item.lastMsg : create()
  const timestamp = lastMessage.timestamp
  let body = lastMessage.body
  if (lastMessage.voiceCall) {
    body = voiceCallResultMap[lastMessage.voiceCall.result]
    if (lastMessage.voiceCall.duration > 0) {
      body += ` ${secondsToTimeString(lastMessage.voiceCall.duration)}`
    }
  }

  return (
    <SideCard
      isActive={isActive}
      activeType={activeType}
      mark={!item.isAnswered}
      title={item.name}
      content={body}
      titleRight={timestamp ? chatDateFormat(timestamp) : ''}
      bottomRight={
        item.status === 'active'
          ? (
            !item.numbers.length && (
              <SideCardStatus isActive={isActive} activeType={activeType} colorType={'gray'}>
                Internal
              </SideCardStatus>
            )
          )
          : (
            <SideCardStatus isActive={isActive} activeType={activeType} colorType={'gray'}>
              <>
                {item.status === 'archived' ? 'Archived' : ''}
                {item.status === 'readonly' ? 'Read-Only' : ''}
              </>
            </SideCardStatus>
          )
      }
      onClick={() => onClick(item)}
      innerRef={innerRef}
    />
  )
})
