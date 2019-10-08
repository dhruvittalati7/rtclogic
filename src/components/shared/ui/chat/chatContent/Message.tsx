import React from 'react'
import classNames from 'classnames'
import { TMessage } from 'src/models/Message'
import { TAccount } from 'src/models/Account'
import { MessageTitle } from './message/Title'
import { MessageAttachment } from './message/Attachment'
import { MessageContent } from './message/Content'
import styles from './Message.module.scss'

interface Props {
  item: TMessage
  account: TAccount | null
  currentAccount: TAccount
  highlight?: boolean
  hideTitle?: boolean
  outColor?: 'green' | 'blue'
  onClick?: () => void
  call: (targetNumber: string) => void
}

export const ChatMessage = React.memo(({ item, account, highlight, hideTitle, outColor = 'green', currentAccount, onClick, call }: Props) => {
  const incoming = item.accountId !== currentAccount.id || item.type === 'system'

  const rootClasses = classNames(styles.root, styles.dark, styles[outColor], {
    [styles.in]: incoming,
    [styles.out]: !incoming,
    [styles.clickable]: !!onClick,
    [styles.highlight]: highlight,
  })

  return (
    <div id={`msg_${item.id}`} className={rootClasses} onClick={() => onClick && onClick()}>
      {(!hideTitle || !!item.voiceCall) && (
        <MessageTitle
          item={item}
          account={account}
          call={call}
        />
      )}

      {!item.voiceCall && (
        <>
          {item.attachments.map(attachment => (
            <MessageAttachment
              key={attachment.mediaUrl}
              attachment={attachment}
              incoming={incoming}
            />
          ))}
          <MessageContent
            item={item}
            incoming={incoming}
          />
        </>
      )}
    </div>
  )
})
