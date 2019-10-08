import React from 'react'
import { v4 as uuid } from 'uuid'
import classNames from 'classnames'
import { useDropzone } from 'react-dropzone'
import { usePasteFromClipboard } from 'src/hooks/usePasteFromClipboard'
import { SvgItem } from 'src/components/shared/ui/SvgItem'
import { ISendAttachment } from 'src/models/Message'
import { layoutService } from 'src/services/LayoutService'
import styles from './ButtonAttach.module.scss'

const settings = {
  mms: {
    limit: 250 * 1024,
    mime: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  },
  internal: {
    limit: 5 * 1024 * 1024,
    mime: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  },
}

interface Props {
  isMMS: boolean
  onUpload: (attachments: ISendAttachment[]) => void
}

export const ButtonAttach = ({ isMMS, onUpload }: Props) => {
  const attachSettings = isMMS ? settings.mms : settings.internal
  const onDrop = async (files: File[]) => {
    const promises = files.map(fileToBase64)

    const filesData: string[] = await Promise.all(promises)
    const attachments: ISendAttachment[] = filesData.map((base64data, k) => {
      const data = base64data.split('base64,')[1]
      return {
        data,
        name: files[k].name,
        mime: files[k].type,
        uid: uuid(),
      }
    })

    onUpload(attachments)
  }

  const onDropRejected = (files: File[], e?: any) => {
    files.forEach(file => {
      const sizeLimit = isMMS ? '250KB' : '5MB'
      layoutService.showNotification(file.size > attachSettings.limit
        ? `File size exceeded (${sizeLimit}): ${file.name}`
        : `File upload failed: ${file.name}`,
        'error'
      )
    })
  }

  usePasteFromClipboard({
    onPaste: onDrop,
    onPasteRejected: onDropRejected,
    accept: attachSettings.mime,
    maxSize: attachSettings.limit,
  })

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: false,
    accept: attachSettings.mime,
    maxSize: attachSettings.limit,
  })

  return (
    <button type="button" className={classNames(styles.root, styles.dark)} {...getRootProps()}>
      <input {...getInputProps()} />
      <SvgItem id={'svg-attach-img2'} width={25} height={25} />
    </button>
  )
}

const fileToBase64 = async (file: File): Promise<string> => {
  return new Promise<string>(resolve => {
    const reader = new FileReader()
    reader.onload = (e: any) => {
      resolve(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}
