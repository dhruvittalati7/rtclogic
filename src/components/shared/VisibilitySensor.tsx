import React from 'react'
import ReactVisibilitySensor from 'react-visibility-sensor'

interface Props {
  enable?: boolean
  children: (visible: boolean) => React.ReactNode
}

export const VisibilitySensor = ({ enable = true, children }: Props) => {
  const [wasVisible, setWasVisible] = React.useState(!enable)
  return (
    <ReactVisibilitySensor
      onChange={visible => setWasVisible(wasVisible || visible)}
    >
      {children(wasVisible)}
    </ReactVisibilitySensor>
  )
}
