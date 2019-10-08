import React from 'react'
import posed from 'react-pose'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { IState } from 'src/store'
import { layoutService } from 'src/services/LayoutService'
import styles from './Dialog.module.scss'
import { Button } from 'src/components/shared/ui/Button'

interface Props {
  open: boolean
  title: React.ReactNode
  content: React.ReactNode
  cancel: boolean
  actionLabel: React.ReactNode
  action: () => void
  close: () => void
}

const Dialog = ({ open, title, content, cancel, actionLabel, action, close }: Props) => {
  const [disabled, setDisabled] = React.useState(false)
  const [pose, setPose] = React.useState('show')

  const onClose = () => {
    setPose('hide')
    setTimeout(() => {
      close()
      setPose('show')
      setDisabled(false)
    }, ANIMATION)
  }

  const onAction = async () => {
    setDisabled(true)
    await action()
    onClose()
  }

  if (!open) {
    return null
  }

  return (
    <div className={classNames(styles.root, styles.dark)}>
      <div className={styles.shader} onClick={onClose} />
      <AnimatedModal initialPose={'hide'} pose={pose} className={styles.modal}>
        {title && <div className={styles.title}>{title}</div>}
        {content && <div className={styles.content}>{content}</div>}
        <div className={styles.actions}>
          {cancel && <button onClick={onClose} className={styles.cancel}>Cancel</button>}
          <Button disabled={disabled} onClick={onAction}>{actionLabel}</Button>
        </div>
      </AnimatedModal>
    </div>
  )
}

const ANIMATION = 300

const AnimatedModal = posed.div({
  hide: { x: '-50%', y: '-80%', opacity: 0, transition: { duration: ANIMATION } },
  show: { x: '-50%', y: '-50%', opacity: 1, transition: { duration: ANIMATION } },
})

const DialogConnected = connect(
  (state: IState): Props => ({
    open: state.app.layout.dialog.open,
    title: state.app.layout.dialog.title,
    content: state.app.layout.dialog.content,
    cancel: state.app.layout.dialog.cancel,
    actionLabel: state.app.layout.dialog.actionLabel,
    action: state.app.layout.dialog.action,
    close: layoutService.closeDialog,
  })
)(Dialog)

export { DialogConnected as Dialog }
