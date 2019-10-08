import React from 'react'
import { Toggle } from 'src/components/shared/ui/Toggle'
import { ViewSettingsBox } from '../Box'
import { ViewSettingsSettingsItem } from './Item'
import styles from './Content.module.scss'
import { connect } from 'react-redux'
import { IState } from 'src/store'
import { extrasService } from 'src/services/ExtrasService'

interface Props {
  allowWebPush: boolean
  allowNewMessageSound: boolean
}

const ViewSettingsSettingsContent = ({ allowWebPush, allowNewMessageSound }: Props) => {
  const toggleAllowWebPush = (value: boolean) => {
    extrasService.setAllowWebPush(value).catch(window.logger.error)
  }

  const toggleAllowNewMessageSound = (value: boolean) => {
    extrasService.setAllowNewMessageSound(value).catch(window.logger.error)
  }

  return (
    <div className={styles.root}>
      <ViewSettingsBox>
        <ViewSettingsSettingsItem
          title={'Allow notifications'}
          subtitle={'Allows web push notifications when Tirade tab is unfocused'}
          toggle={
            <Toggle
              checked={allowWebPush}
              name={'allowWebPush'}
              onChange={e => {
                toggleAllowWebPush(e.target.checked)
              }}
            />
          }
        />

        <ViewSettingsSettingsItem
          title={'Allow sound'}
          subtitle={'New message sound will be disabled'}
          toggle={
            <Toggle
              checked={allowNewMessageSound}
              name={'allowNewMessageSound'}
              onChange={e => {
                toggleAllowNewMessageSound(e.target.checked)
              }}
            />
          }
        />
      </ViewSettingsBox>
    </div>
  )
}

const mapStateToProps = (state: IState): Props => ({
  allowWebPush: state.app.current.extras.allowWebPush,
  allowNewMessageSound: state.app.current.extras.allowNewMessageSound,
})

const ViewSettingsSettingsContentConnected = connect(mapStateToProps)(ViewSettingsSettingsContent)

export { ViewSettingsSettingsContentConnected as ViewSettingsSettingsContent }
