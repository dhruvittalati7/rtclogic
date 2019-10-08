import React from 'react'
import classNames from 'classnames'
import { IAttachment } from 'src/models/Message'
import { AudioPlayer } from 'src/components/shared/ui/AudioPlayer'
import styles from './Voicemail.module.scss'

interface Props {
  attachment: IAttachment
  incoming?: boolean
}

export const AttachmentVoicemail = ({ attachment, incoming }: Props) => (
  <div className={classNames(styles.root, incoming && styles.in)}>
    <AudioPlayer url={attachment.mediaUrl} />
  </div>
)
