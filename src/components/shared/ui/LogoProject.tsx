import React from 'react'
import { mem } from 'src/utils/mem'
import { LogoIcon } from 'src/components/shared/ui/Icons'

interface Props {
  className?: string
}

export const LogoProject = mem(({ className }: Props) => (
  <div className={className}>
    <LogoIcon className={className} />
    <span>TIRADE</span>
  </div>
))
