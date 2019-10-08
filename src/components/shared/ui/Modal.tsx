import React, { PropsWithChildren } from 'react'
import ReactModal from 'react-modal'
import styles from './Modal.module.scss'

export interface Props {
  show: boolean
  width?: string
  height?: string
  onClose?: () => void
  children?: React.ReactNode
}

const Modal = ({ show, onClose, width, height, children }: Props) => {
  const overlay = {
    backgroundColor: 'rgba(57, 62, 70, 0.9)',
  }

  const content = {
    width: width || 'auto',
    height: height || 'auto',
  }

  return (
    <ReactModal className={styles.root} isOpen={show} onRequestClose={onClose} ariaHideApp={true} style={{ overlay }} closeTimeoutMS={500}>
      <div className={styles.content} style={content}>
        <ModalHeader>
          {onClose && <ModalClose onClick={onClose} /> }
        </ModalHeader>
        <div className="ReactModal__Content__Inner">
          {children}
        </div>
      </div>
    </ReactModal>
  )
}

interface IModalCloseProps {
  onClick?: () => void
}
const ModalClose = (props: IModalCloseProps) => <button onClick={props.onClick} className={styles.close} />
const ModalHeader = (props: PropsWithChildren<{}>) => <div className={styles.header}>{props.children}</div>

export { Modal, ModalHeader, ModalClose }
