import React from 'react'
import { Redirect, Switch } from 'react-router'
import { PrivateRoute } from 'src/components/shared/PrivateRoute'
import { ViewSettingsProfile } from 'src/components/views/viewSettings/Profile'
import { ViewSettingsSecurity } from 'src/components/views/viewSettings/Security'
import { ViewSettingsSettings } from 'src/components/views/viewSettings/Settings'

export const ViewSettings = () => (
  <Switch>
    <Redirect exact from={'/settings'} to={'/settings/profile'} />
    <PrivateRoute requiredPermissions={['member', 'manager']} path={'/settings/profile'} component={ViewSettingsProfile} />
    <PrivateRoute requiredPermissions={['member', 'manager']} path={'/settings/security'} component={ViewSettingsSecurity} />
    <PrivateRoute requiredPermissions={['member', 'manager']} path={'/settings/options'} component={ViewSettingsSettings} />
  </Switch>
)
