import React from 'react'
import classNames from 'classnames'
import styles from 'src/components/views/viewSettings/Box.module.scss'

interface Props {
  className?: string
}

export class ViewSettingsBox extends React.PureComponent<Props> {
  public render() {
    return <div className={classNames(styles.root, this.props.className)}>{this.props.children}</div>
  }
}
