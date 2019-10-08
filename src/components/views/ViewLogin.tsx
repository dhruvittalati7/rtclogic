import * as React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { IState } from 'src/store'
import { RouteComponentProps, withRouter } from 'react-router'
import { Meta } from 'src/components/shared/Meta'
import { LayoutSimple } from 'src/components/shared/layouts/LayoutSimple'
import { authService } from 'src/services/AuthService'
import styles from './ViewLogin.module.scss'
import { LogoProject } from 'src/components/shared/ui/LogoProject'
import { LoginForm } from 'src/components/views/viewLogin/Login'
import { bootstrap } from 'src/Bootstrap'

export interface Props {
  errorMessage: string
}

interface State {
  error: string
  next: null | Function
}

class ViewLogin extends React.Component<Props & RouteComponentProps, State> {
  public state: State = {
    error: '',
    next: null,
  }

  public onLogin = async (email: string, password: string, rememberMe: boolean) => {
    const next = await authService.login(email, password, rememberMe)
    const errorText = 'Your username or password was wrong. Please try again!'
    this.setState({ next, error: next ? '' : errorText })
    if (next) {
      next()
      await bootstrap.onAfterLogin()
      const location = this.props.history.location
      this.props.history.push((location.state && location.state.from) || '/')
    }
  }

  public render() {
    const { errorMessage } = this.props
    const { error } = this.state

    return (
      <LayoutSimple>
        <Meta title="Login" />
        <div className={classNames(styles.root, styles.dark)}>
          <div className={styles.brand}>{/*<div className={styles.bg} />*/}</div>
          <div className={styles.main}>
            <LogoProject className={styles.logo} />
            <div className={styles.formArea}>
              <div className={styles.title}>Sign In</div>
              <LoginForm error={errorMessage || error} onSubmit={this.onLogin} />
            </div>
          </div>
        </div>
      </LayoutSimple>
    )
  }
}

const ViewLoginConnected = connect(
  (state: IState): Props => ({
    errorMessage: state.app.system.errorMessage,
  })
)(withRouter(ViewLogin))

export { ViewLoginConnected as ViewLogin }
