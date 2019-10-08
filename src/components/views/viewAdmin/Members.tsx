import React from 'react'
import { LayoutApp } from 'src/components/shared/layouts/LayoutApp'
import { AdminNavigation } from 'src/components/views/viewAdmin/AminNavigation'
import { ViewAdminMembersContent } from 'src/components/views/viewAdmin/members/Content'

export const ViewAdminMembers = () => {
  return (
    <LayoutApp
      title={'Members'}
      header={<AdminNavigation />}
      content={<ViewAdminMembersContent />}
    />
  )
}
