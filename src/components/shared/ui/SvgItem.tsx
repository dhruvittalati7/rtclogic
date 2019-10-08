import React from 'react'

interface Props {
  id: string
  width?: number
  height?: number
  className?: string
  onClick?: (event: any) => void
}

export const SvgItem = ({ id, width, height, className, onClick }: Props) => {
  return (
    <svg width={width} height={height} className={className} onClick={onClick}>
      <use xlinkHref={`#${id}`} />
    </svg>
  )
}
