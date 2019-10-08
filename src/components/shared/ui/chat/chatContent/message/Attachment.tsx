import React from 'react'
import { IAttachment } from 'src/models/Message'
import { AttachmentImage } from './attachment/Image'
import { AttachmentVoicemail } from './attachment/Voicemail'

interface Props {
  attachment: IAttachment
  incoming?: boolean
}

export const MessageAttachment = React.memo(({ attachment, incoming }: Props) =>
  attachment.isImage
    ? <AttachmentImage attachment={attachment} incoming={incoming} />
    : <AttachmentVoicemail attachment={attachment} incoming={incoming} />
)
