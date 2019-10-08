import React from 'react'
import { Block, SizeProps, PositionProps, MarginProps, PaddingProps } from './Block'

interface Props extends SizeProps, PositionProps, MarginProps, PaddingProps {
  color?: string
  size?: number
  bold?: boolean
  weight?: number
  italic?: boolean
  lineHeight?: number
  noWrap?: boolean
  alignLeft?: boolean
  alignRight?: boolean
  alignCenter?: boolean
  children?: any
}

export const Text = React.memo((props: Props) => {
  const styles = getStyles(props)

  return (
    <Block style={styles} {...props}>
      {props.children}
    </Block>
  )
})

const getStyles = (props: Props): React.CSSProperties => {
  const styles: React.CSSProperties = {}

  styles.display = 'inline'
  if (props.color) {
    styles.color = props.color
  }
  if (props.size) {
    styles.fontSize = props.size
  }
  if (props.bold) {
    styles.fontWeight = 600
  }
  if (props.weight) {
    styles.fontWeight = props.weight
  }
  if (props.lineHeight) {
    styles.lineHeight = props.lineHeight
  }
  if (props.noWrap) {
    styles.whiteSpace = 'nowrap'
  }
  if (props.italic) {
    styles.fontStyle = 'italic'
  }
  if (props.alignLeft) {
    styles.textAlign = 'left'
  }
  if (props.alignRight) {
    styles.textAlign = 'right'
  }
  if (props.alignCenter) {
    styles.textAlign = 'center'
  }

  return styles
}
