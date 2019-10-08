import React from 'react'
import { LayoutApp } from 'src/components/shared/layouts/LayoutApp'
import { AdminNavigation } from 'src/components/views/viewAdmin/AminNavigation'
import { ViewAdminGroupContent } from 'src/components/views/viewAdmin/groups/Content'

export const ViewAdminGroups = () => {
  return (
    <LayoutApp
      title={'Groups'}
      header={<AdminNavigation />}
      content={<ViewAdminGroupContent />}
    />
  )
}
