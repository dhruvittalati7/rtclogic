import React from 'react'
import { connect } from 'react-redux'
import { history, IState } from 'src/store'
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { PrivateRoute } from 'src/components/shared/PrivateRoute'
import { TAccount, TStatus } from 'src/models/Account'
import { ViewNotFound } from 'src/components/views/ViewNotFound'
import { ViewLogin } from 'src/components/views/ViewLogin'
import { ViewConversations } from 'src/components/views/ViewConversations'
import { ViewContacts } from 'src/components/views/ViewContacts'
import { ViewCampaigns } from 'src/components/views/ViewCampaigns'
import { ViewSettings } from 'src/components/views/ViewSettings'
import { ViewAdmin } from 'src/components/views/ViewAdmin'
import { ViewChangePassword } from 'src/components/views/ViewChangePassword'

interface Props {
  isLoggedIn: boolean
  currentAccount: TAccount
}

const Routes = ({ isLoggedIn, currentAccount }: Props) => {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        {currentAccount.profile.status === ('pending' as TStatus) && <Route path="/" component={ViewChangePassword} />}
        {!isLoggedIn && <Route exact path="/" component={ViewLogin} />}
        <Route exact path="/login" component={ViewLogin} />
        <PrivateRoute requiredPermissions={['member']} exact path="/" component={ViewConversations} />
        <PrivateRoute requiredPermissions={['member']} exact path="/chat/new" component={ViewConversations} />
        <PrivateRoute requiredPermissions={['member']} exact path="/chat/:id" component={ViewConversations} />
        <PrivateRoute requiredPermissions={['member']} exact path="/contacts" component={ViewContacts} />
        <PrivateRoute requiredPermissions={['member']} exact path="/campaigns" component={ViewCampaigns} />
        <PrivateRoute requiredPermissions={['member']} path="/settings" component={ViewSettings} />
        <PrivateRoute requiredPermissions={['admin', 'manager']} path="/admin" component={ViewAdmin} />
        <Route render={(props: RouteComponentProps<any>) => <ViewNotFound type={'notFound'} />} />
      </Switch>
    </ConnectedRouter>
  )
}

const mapStateToProps = (state: IState): Props => ({
  isLoggedIn: !!state.app.current.accountId,
  currentAccount: state.app.current.account,
})

const RoutesConnected = connect(mapStateToProps)(Routes)
export { RoutesConnected as Routes }
