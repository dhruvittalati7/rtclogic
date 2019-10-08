import React from 'react'

export interface SizeProps {
  width?: number | string
  height?: number | string
  maxWidth?: number | string
  maxHeight?: number | string
}

export interface FlexProps {
  flex?: boolean
  grow?: boolean
  shrink?: boolean
  justifyStart?: boolean
  justifyCenter?: boolean
  justifyEnd?: boolean
  justifySpace?: boolean
  alignStart?: boolean
  alignCenter?: boolean
  alignEnd?: boolean
  alignStretch?: boolean
}

export interface PositionProps {
  block?: boolean
  inline?: boolean
  static?: boolean
  relative?: boolean
  absolute?: boolean
  top?: number | string
  left?: number | string
  right?: number | string
  bottom?: number | string
  centering?: boolean
}

export interface BorderProps {
  overflow?: boolean
  borderRadius?: number | string
  border?: string
}

export interface MarginProps {
  margin?: number | string
  mt?: number
  mr?: number
  mb?: number
  ml?: number
}

export interface PaddingProps {
  padding?: number | string
  pt?: number
  pr?: number
  pb?: number
  pl?: number
}

export interface Props extends SizeProps, FlexProps, PositionProps, BorderProps, MarginProps, PaddingProps {
  background?: string
  divProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  className?: string
  style?: React.CSSProperties
  children?: any
}

export const Block = React.memo((props: Props) => {
  const styles = getStyles(props, props.style || {})

  return (
    <div {...props.divProps} className={props.className} style={styles}>
      {props.children}
    </div>
  )
})

const getStyles = (props: Props, initStyles: React.CSSProperties): React.CSSProperties => {
  const styles: React.CSSProperties = { ...initStyles }

  if (props.width !== undefined) {
    styles.width = props.width
  }
  if (props.height !== undefined) {
    styles.height = props.height
  }
  if (props.maxWidth !== undefined) {
    styles.maxWidth = props.maxWidth
  }
  if (props.maxHeight !== undefined) {
    styles.maxHeight = props.maxHeight
  }

  if (props.flex) {
    styles.display = props.inline ? 'inline-flex' : 'flex'
    styles.alignItems = 'center'
    if (props.grow !== undefined) {
      styles.flexGrow = props.grow ? 1 : 0
    }
    if (props.shrink !== undefined) {
      styles.flexShrink = props.shrink ? 1 : 0
    }
    if (props.justifyStart) {
      styles.justifyContent = 'flex-start'
    }
    if (props.justifyCenter) {
      styles.justifyContent = 'center'
    }
    if (props.justifyEnd) {
      styles.justifyContent = 'flex-end'
    }
    if (props.justifySpace) {
      styles.justifyContent = 'space-between'
    }
    if (props.alignStart) {
      styles.alignItems = 'flex-start'
    }
    if (props.alignCenter) {
      styles.alignItems = 'center'
    }
    if (props.alignEnd) {
      styles.alignItems = 'flex-end'
    }
    if (props.alignStretch) {
      styles.alignItems = 'stretch'
    }
  }

  if (props.block) {
    styles.display = 'block'
  }
  if (props.inline) {
    styles.display = 'inline-block'
  }
  if (props.static) {
    styles.position = 'static'
  }
  if (props.relative) {
    styles.position = 'relative'
  }
  if (props.absolute) {
    styles.position = 'absolute'
  }
  if (props.top !== undefined) {
    styles.top = props.top
  }
  if (props.left !== undefined) {
    styles.left = props.left
  }
  if (props.right !== undefined) {
    styles.right = props.right
  }
  if (props.bottom !== undefined) {
    styles.bottom = props.bottom
  }
  if (props.centering) {
    styles.transform = 'translate(-50%, -50%)'
  }

  if (props.overflow !== undefined) {
    styles.overflow = props.overflow ? 'visible' : 'hidden'
  }
  if (props.border) {
    styles.border = props.border
  }
  if (props.borderRadius) {
    styles.borderRadius = props.borderRadius
  }

  if (props.margin) {
    styles.margin = props.margin
  }
  if (props.mt) {
    styles.marginTop = props.mt
  }
  if (props.mr) {
    styles.marginRight = props.mr
  }
  if (props.mb) {
    styles.marginBottom = props.mb
  }
  if (props.ml) {
    styles.marginLeft = props.ml
  }

  if (props.padding) {
    styles.padding = props.padding
  }
  if (props.pt) {
    styles.paddingTop = props.pt
  }
  if (props.pr) {
    styles.paddingRight = props.pr
  }
  if (props.pb) {
    styles.paddingBottom = props.pb
  }
  if (props.pl) {
    styles.paddingLeft = props.pl
  }

  if (props.background) {
    styles.background = props.background
  }

  return styles
}
