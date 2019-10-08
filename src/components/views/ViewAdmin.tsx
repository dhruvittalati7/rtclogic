import React from 'react'
import { Switch, Redirect } from 'react-router'
import { PrivateRoute } from 'src/components/shared/PrivateRoute'
import { ViewAdminNumbers } from './viewAdmin/Numbers'
import { ViewAdminGroups } from './viewAdmin/Groups'
import { ViewAdminMembers } from './viewAdmin/Members'
import { adminMemberService } from 'src/services/admin/MemberService'
import { adminRoleService } from 'src/services/admin/RoleService'

export class ViewAdmin extends React.PureComponent {
  public componentDidMount() {
    adminMemberService.loadMembers().catch(window.logger.error)
    adminRoleService.loadRoles().catch(window.logger.error)
  }

  public render() {
    return (
      <Switch>
        <Redirect exact from={'/admin'} to={'/admin/members'} />
        <PrivateRoute requiredPermissions={['admin', 'manager']} path={'/admin/members'} component={ViewAdminMembers} />
        <PrivateRoute requiredPermissions={['admin', 'manager']} path={'/admin/groups'} component={ViewAdminGroups} />
        <PrivateRoute requiredPermissions={['admin', 'manager']} path={'/admin/numbers/:type'} component={ViewAdminNumbers} />
      </Switch>
    )
  }
}
