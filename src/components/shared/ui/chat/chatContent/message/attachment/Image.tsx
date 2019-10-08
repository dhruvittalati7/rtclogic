import React from 'react'
import classNames from 'classnames'
import Img from 'react-image'
import brokenImage from 'src/assets/img/broken.png'
import { ChevronIcon } from 'src/components/shared/ui/Icons'
import { IAttachment } from 'src/models/Message'
import { VisibilitySensor } from 'src/components/shared/VisibilitySensor'
import { Loader } from 'src/components/shared/ui/Loader'
import styles from './Image.module.scss'

interface Props {
  attachment: IAttachment
  incoming?: boolean
}

export const AttachmentImage = ({ attachment, incoming }: Props) => {
  const [open, setOpen] = React.useState(true)

  const onClickOpen = React.useCallback(() => {
    setOpen(!open)
  }, [open])

  if (!attachment.isImage) {
    return null
  }

  return (
    <VisibilitySensor>
      {visible => (
        <div className={classNames(styles.root, incoming && styles.in)}>
          <div className={styles.name} onClick={onClickOpen}>
            {attachment.name} ({Math.round(attachment.size / 1024)}kb)
            <ChevronIcon className={classNames(styles.icon, open && styles.open)} />
          </div>
          {visible && (
            <Img
              decode={false}
              className={classNames(styles.image, open && styles.open)}
              alt={attachment.name}
              title={attachment.name}
              src={[attachment.mediaUrl, brokenImage]}
              loader={<Loader size={30} className={styles.loader} />}
            />
          )}
        </div>
      )}
    </VisibilitySensor>
  )
}
