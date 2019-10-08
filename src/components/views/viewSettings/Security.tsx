import React from 'react'
import { LayoutApp } from 'src/components/shared/layouts/LayoutApp'
import { ViewSettingsSecurityContent } from 'src/components/views/viewSettings/security/Content'
import { VewSettingsNavigation } from 'src/components/views/viewSettings/Navigation'
import { VewSettingsSidebarHeader } from 'src/components/views/viewSettings/SidebarHeader'

export const ViewSettingsSecurity = () => (
  <LayoutApp
    title={'Admin Security'}
    sideHeader={<VewSettingsSidebarHeader />}
    sideBar={<VewSettingsNavigation />}
    content={<ViewSettingsSecurityContent />}
  />
)
