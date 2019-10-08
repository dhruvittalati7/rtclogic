import React from 'react'
import * as Sentry from '@sentry/browser'
import config from 'src/config'

export interface Props {
  errorView?: any
}
interface State {
  error: null | Error
  errorInfo: null | React.ErrorInfo
  hasError: boolean
}

export class ErrorBoundary extends React.PureComponent<Props, State> {
  public state: State = {
    error: null,
    errorInfo: null,
    hasError: false,
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    window.logger.error(error, errorInfo)
    if (!error) {
      this.setState({ hasError: true })
    } else {
      this.setState({ error, errorInfo, hasError: true })
    }

    if (process.env.NODE_ENV === 'production' && config.sentryDSN) {
      Sentry.withScope(scope => {
        Sentry.captureException(error)
      })
    }
  }

  public render() {
    const { errorView, children } = this.props
    const { hasError } = this.state

    return hasError ? errorView || this.renderDefaultError() : children
  }

  protected renderDefaultError = () => {
    return (
      <div>
        Something goes wrong. Try to return to{' '}
        <button
          onClick={() => {
            window.location.href = '/'
          }}
        >
          Main Page
        </button>
      </div>
    )
  }
}
