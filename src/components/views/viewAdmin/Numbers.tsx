import React from 'react'
import { LayoutApp } from 'src/components/shared/layouts/LayoutApp'
import { AdminNavigation } from 'src/components/views/viewAdmin/AminNavigation'
import { ViewAdminNumbersContent } from 'src/components/views/viewAdmin/numbers/Content'

export const ViewAdminNumbers = () => {
  return <LayoutApp title={'Numbers'} header={<AdminNavigation />} content={<ViewAdminNumbersContent />} />
}
