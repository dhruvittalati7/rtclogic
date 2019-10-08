import React from 'react'

const DEFAULT_NAME = 'Tirade'

interface Props {
  name?: string
  title?: string
}

export const Meta = ({ name, title }: Props) => {
  React.useEffect(() => {
    document.title = `${name || DEFAULT_NAME}${title ? ` — ${title}` : ''}`
  }, [name, title])

  return null
}
