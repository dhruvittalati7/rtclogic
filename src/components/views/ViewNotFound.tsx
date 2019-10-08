import React from 'react'
import { Switch, Redirect } from 'react-router-dom'
import { layoutService } from 'src/services/LayoutService'
import { IState } from 'src/store'
import { accessSelector } from 'src/services/selectors/AccountSelectors'
import { connect } from 'react-redux'

type TType = 'permission' | 'notFound'

interface Props {
  type: TType
  currentAccountPermissions: TPermission[]
}

const getNotification = (type: TType) => {
  let notification

  if (type === 'permission') {
    notification = 'You do not have permissions to view this page'
  }

  if (type === 'notFound') {
    notification = 'Route not found'
  }

  return notification
}

const getUrl = (currentAccountPermissions: TPermission[]) => {
  let result = '/'
  if (currentAccountPermissions.includes('admin') || currentAccountPermissions.includes('manager')) {
    result =  '/admin'
  }
  return result
}

const ViewNotFound = ({ currentAccountPermissions, type = 'notFound' }: Props) => {
  layoutService.showNotification(getNotification(type), 'default')
  return (
    <Switch>
      <Redirect to={getUrl(currentAccountPermissions)} />
    </Switch>
  )
}

const mapStateToProps = (state: IState, ownProps: Pick<Props, 'type'>): Props => ({
  ...ownProps,
  currentAccountPermissions: accessSelector(state.app),
})

const Connected = connect(mapStateToProps)(ViewNotFound)
export { Connected as ViewNotFound }
