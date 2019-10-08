import React from 'react'

interface State {
  width: number
  height: number
}

export const withSize = (Component: React.ComponentClass<any> | React.FunctionComponent<any>) => {
  return class extends React.PureComponent<any, State> {
    public state: State = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    public handleResize = () => {
      const { width, height } = this.state
      if (window.innerWidth !== width || window.innerHeight !== height) {
        this.setState({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }
    }

    public componentDidMount(): void {
      window.addEventListener('resize', this.handleResize)
    }

    public componentWillUnmount(): void {
      window.removeEventListener('resize', this.handleResize)
    }

    public render() {
      const { width, height } = this.state
      return <Component {...this.props} width={width} height={height} />
    }
  }
}
