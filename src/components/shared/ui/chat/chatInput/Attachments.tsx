import React from 'react'
import { ISendAttachment } from 'src/models/Message'
import { Tags } from 'src/components/shared/ui/Tags'
import styles from './Attachments.module.scss'

interface Props {
  attachments: ISendAttachment[]
  onRemove: (uid: string) => void
}
export const ChatInputAttachments = ({ attachments, onRemove }: Props) => {
  if (!attachments.length) {
    return null
  }

  const options = attachments.map(i => ({ value: i.uid, label: i.name }))
  return (
    <div className={styles.root}>
      <div className={styles.title}>Attachments:</div>
      <Tags options={options} onClickRemove={a => onRemove(a.value)} />
    </div>
  )
}
