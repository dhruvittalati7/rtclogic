import React from 'react'
import { LayoutApp } from 'src/components/shared/layouts/LayoutApp'
import { VewSettingsNavigation } from 'src/components/views/viewSettings/Navigation'
import { ViewSettingsSettingsContent } from 'src/components/views/viewSettings/settings/Content'
import { VewSettingsSidebarHeader } from 'src/components/views/viewSettings/SidebarHeader'

export const ViewSettingsSettings = () => (
  <LayoutApp
    title={'Profile settings'}
    sideHeader={<VewSettingsSidebarHeader />}
    sideBar={<VewSettingsNavigation />}
    content={<ViewSettingsSettingsContent />}
  />
)
