import * as React from 'react'
import { mem } from 'src/utils/mem'
import classNames from 'classnames'
import styles from './Loader.module.scss'
import { LoaderIcon } from 'src/components/shared/ui/Icons'

interface Props {
  size?: number
  color?: string
  className?: string
}

export const Loader = mem(({ size = 60, color, className }: Props) => {
  const style = React.useMemo(() => ({ color }), [color])

  return (
    <div className={classNames(styles.root, className)} style={style}>
      <LoaderIcon width={size} height={size} />
    </div>
  )
})
