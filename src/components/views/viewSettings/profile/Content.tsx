import React from 'react'
import { mem } from 'src/utils/mem'
import { ViewSettingsBox } from '../Box'
import styles from 'src/components/views/viewSettings/profile/Content.module.scss'
import { connect } from 'react-redux'
import { IState } from 'src/store'
import { TAccount } from 'src/models/Account'
import { currentAccountSelector } from 'src/services/selectors/AccountSelectors'
import { ViewSettingsProfileForm } from 'src/components/views/viewSettings/profile/Form'
import { ITimeZone, timezoneService } from 'src/services/TimezoneService'
import { useOnMount } from 'src/hooks/useOnMount'

interface Props {
  account: TAccount
  timezone: string
}

const ViewSettingsProfileContent = mem(({ account, timezone }: Props) => {
  if (!account.id) {
    return null
  }

  const [timezones, setTimezoneOptions] = React.useState<ITimeZone[]>([])

  useOnMount(() => {
    async function fetchTimezone() {
      const timezoneOptions = await timezoneService.getTimezoneOffsetOptions()
      setTimezoneOptions(timezoneOptions)
    }
    fetchTimezone().catch(window.logger.error)
  })

  if (!timezones) {
    return null
  }

  return (
    <div className={styles.root}>
      <ViewSettingsBox className={styles.box}>
        <ViewSettingsProfileForm
          timezones={timezones}
          account={account}
          currentTimezone={timezone}
        />
      </ViewSettingsBox>
    </div>
  )
})

const mapStateToProps = (state: IState): Props => ({
  account: currentAccountSelector(state.app),
  timezone: state.app.current.timezone,
})

const ViewSettingsProfileContentConnected = connect(mapStateToProps)(ViewSettingsProfileContent)

export { ViewSettingsProfileContentConnected as ViewSettingsProfileContent }
