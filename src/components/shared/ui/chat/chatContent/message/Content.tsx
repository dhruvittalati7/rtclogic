import React from 'react'
import { TMessage } from 'src/models/Message'
import { isEmoji } from 'src/helpers/CommonHelper'
import styles from './Content.module.scss'
import classNames from 'classnames'

interface Props {
  item: TMessage
  incoming?: boolean
}

export const MessageContent = React.memo(({ item, incoming }: Props) => {
  const isOnlyEmoji = React.useMemo(() => isEmoji(item.body), [item])

  const rootClasses = classNames(
    styles.root,
    isOnlyEmoji && item.body.length <= 6 && styles.emojiFew,
    isOnlyEmoji && item.body.length <= 2 && styles.emojiOne,
    incoming && styles.in,
    incoming || styles.out
  )

  if (!item.body) {
    return null
  }

  return (
    <div className={rootClasses}>
      {renderMultiline(item.body)}
    </div>
  )
})

const renderMultiline = (string: string) => {
  const lines = string.split('\n')
  const length = lines.length
  return lines.map((l, i) => (
    <React.Fragment key={i}>
      {renderUrls(l)}
      {i !== length - 1 && <br />}
    </React.Fragment>
  ))
}

const renderUrls = (string: string) => {
  const parts = string.split(/(https?:\/\/[^ ]*)/)
  return parts.map((part, i) =>
    part.substr(0, 4).toLocaleLowerCase() === 'http' ? (
      <a key={i} href={part} className={styles.link} target="_blank" rel="noopener noreferrer">
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}
