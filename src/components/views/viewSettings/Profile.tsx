import React from 'react'
import { LayoutApp } from 'src/components/shared/layouts/LayoutApp'
import { ViewSettingsProfileContent } from 'src/components/views/viewSettings/profile/Content'
import { VewSettingsNavigation } from 'src/components/views/viewSettings/Navigation'
import { VewSettingsSidebarHeader } from 'src/components/views/viewSettings/SidebarHeader'

export const ViewSettingsProfile = () => (
  <LayoutApp
    title={'Admin Profile'}
    sideHeader={<VewSettingsSidebarHeader />}
    sideBar={<VewSettingsNavigation />}
    content={<ViewSettingsProfileContent />}
  />
)
