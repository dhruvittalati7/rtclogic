import React from 'react'
import classNames from 'classnames'
import { useDropzone } from 'react-dropzone'
import styles from './Dropzone.module.scss'

interface Props {
  message: string
  onUpload: (files: File[]) => void
  multiple?: boolean
  accept?: string | string[]
  className?: string
}

export const Dropzone = ({ message, onUpload, multiple, accept, className }: Props) => {
  const { getRootProps, getInputProps } = useDropzone({ multiple, accept, onDrop: onUpload })

  return (
    <div className={classNames(styles.root, styles.dark, className)} {...getRootProps()}>
      <input {...getInputProps()} />
      {message}
    </div>
  )
}
