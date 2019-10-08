import React, { useEffect, useState } from 'react'
import { mem } from 'src/utils/mem'

interface Props {
  src: string
  placeholder: JSX.Element
  alt: string
}

export const AppImage = mem(({ src, placeholder, alt }: Props) => {
  const [error, setLoadError] = useState<boolean>(false)

  useEffect(() => {
    setLoadError(false)
  }, [src])

  return src && !error ? (
    <img
      src={src}
      alt={alt}
      onErrorCapture={() => {
        setLoadError(true)
      }}
    />
  ) : (
    placeholder
  )
})
