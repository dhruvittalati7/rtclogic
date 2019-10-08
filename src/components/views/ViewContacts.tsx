import React from 'react'
import { LayoutApp } from 'src/components/shared/layouts/LayoutApp'
import { ViewContactsContent } from './viewContacts/Content'

interface Props {}

export class ViewContacts extends React.PureComponent<Props> {
  public render() {
    return <LayoutApp title={'Contacts'} content={<ViewContactsContent />} />
  }
}
