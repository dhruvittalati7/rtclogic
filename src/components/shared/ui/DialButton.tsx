import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { IState } from 'src/store'
import { DialPad } from 'src/components/shared/ui/DialPad'
import { dialService } from 'src/services/DialService'
import { KeyButtonsIcon } from 'src/components/shared/ui/Icons'
import styles from 'src/components/shared/ui/DialButton.module.scss'

interface Props {
  openDial: boolean
  toggleDial: (openDial: boolean) => void
}

const DialButton = ({ openDial, toggleDial }: Props) => (
  <div className={classNames(styles.root, styles.dark)}>
    <KeyButtonsIcon width={16} height={19} onClick={() => toggleDial(!openDial)} />
    <DialPad />
  </div>
)

const DialButtonConnected = connect(
  (state: IState): Props => ({
    openDial: state.app.calls.openDial,
    toggleDial: dialService.toggleDial,
  })
)(DialButton)

export { DialButtonConnected as DialButton }
