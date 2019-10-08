import React from 'react'

interface State {
  scrollTop: number
}

export const withScroll = (Component: React.ComponentClass<any> | React.FunctionComponent<any>) => {
  return class extends React.PureComponent<any, State> {
    public state: State = {
      scrollTop: window.scrollY,
    }

    public handleScroll = () => {
      const { scrollTop } = this.state
      if (window.scrollY !== scrollTop) {
        this.setState({ scrollTop: window.scrollY })
      }
    }

    public componentDidMount(): void {
      window.addEventListener('scroll', this.handleScroll)
    }

    public componentWillUnmount(): void {
      window.removeEventListener('scroll', this.handleScroll)
    }

    public render() {
      const { scrollTop } = this.state
      return <Component {...this.props} scrollTop={scrollTop} />
    }
  }
}
