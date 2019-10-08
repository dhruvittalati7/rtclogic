import React from 'react'
import { connect } from 'react-redux'
import { IState } from 'src/store'
import { TRole } from 'src/models/Role'
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router'
import { accessSelector, currentAccountIdSelector } from 'src/services/selectors/AccountSelectors'
import { currentRolesSelector } from 'src/services/selectors/RoleSelectors'
import { hasAccountPermission } from 'src/helpers/AccountHelper'
import { ViewNotFound } from 'src/components/views/ViewNotFound'

interface Props extends RouteProps {
  isLoggedIn: boolean
  roles: TRole[]
  currentAccountPermissions: TPermission[]
  requiredPermissions: TPermission[]
  accountHasLoaded: boolean
}

const PrivateRoute = ({ requiredPermissions, currentAccountPermissions, isLoggedIn, accountHasLoaded, component: Component, ...rest }: Props) => {
  return (
    <Route
      render={(props: RouteComponentProps<any>) => {
        if (isLoggedIn && accountHasLoaded && Component) {
          return hasAccountPermission(currentAccountPermissions, requiredPermissions) ? (
            <Component {...props} />
          ) : (
            <ViewNotFound type={'permission'} />
          )
        }
        return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      }}
      {...rest}
    />
  )
}

const mapStateToProps = (state: IState) => ({
  isLoggedIn: !!currentAccountIdSelector(state.app),
  roles: currentRolesSelector(state.app),
  currentAccountPermissions: accessSelector(state.app),
  accountHasLoaded: state.app.current.hasLoaded,
})

const PrivateRouteConnected = connect(mapStateToProps)(PrivateRoute)
export { PrivateRouteConnected as PrivateRoute }
