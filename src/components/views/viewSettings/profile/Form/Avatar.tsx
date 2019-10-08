import React, { useEffect, useState } from 'react'
import styles from './Avatar.module.scss'
import Dropzone from 'react-dropzone'
import { CloseIcon, PersonIcon } from 'src/components/shared/ui/Icons'
import { Modal } from 'src/components/shared/ui/Modal'
import { fetchBase64 } from 'src/helpers/CommonHelper'
import { Crop } from './Crop'
import { AppImage } from 'src/components/shared/ui/Image'

export interface Props {
  onChange: (value: HTMLInputElement & any) => void
  name: string
  className?: string
  inputProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  src: string
}

export const ViewSettingsProfileFormAvatar = (props: Props) => {
  const [show, setShow] = useState(false)
  const [src, setSrc] = useState(props.src)

  useEffect(() => {
    if (src !== props.src) {
      setSrc(props.src)
    }
  }, [props.src, src])

  const [nextSrc, setNextSrc] = useState(props.src)

  const onDrop = (files: File[]) => {
    // do nothing if no files
    if (files.length === 0) {
      return
    }

    const url = URL.createObjectURL(files[0])
    fetchBase64(url, (url: string) => {
      setNextSrc(url)
      setShow(true)
    })
  }

  const onClickDelete = (e: any) => {
    e.stopPropagation()
    e.preventDefault()
    props.onChange(null)
  }

  const onApply = (base64: string) => {
    props.onChange(base64)
    setShow(false)
  }
  return (
    <>
      <div className={styles.root}>
        <Dropzone accept="image/*" onDrop={acceptedFiles => onDrop(acceptedFiles)} multiple={false}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div className={styles.avatar}>
                {src && <CloseIcon className={styles.delete} onClick={(e: any) => onClickDelete(e)} /> }
                <AppImage src={src} placeholder={<PersonIcon width={40} />} alt={'profile'} />
              </div>
            </div>
          )}
        </Dropzone>
      </div>

      <Modal show={show} onClose={() => setShow(false)} width={'450px'}>
        {nextSrc && <Crop src={nextSrc} onApply={onApply} />}
      </Modal>
    </>
  )
}
