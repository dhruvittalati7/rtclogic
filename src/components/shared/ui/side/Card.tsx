import React from 'react'
import classNames from 'classnames'
import Dotdotdot from 'react-dotdotdot'
import styles from './Card.module.scss'

interface Props {
  title: React.ReactNode
  content: React.ReactNode
  mark?: boolean
  isActive?: boolean
  activeType?: 'green' | 'blue'
  titleRight?: React.ReactNode
  bottomLeft?: React.ReactNode
  bottomRight?: React.ReactNode
  className?: string
  onClick?: () => void
  onTitleClick?: () => void
  innerRef?: React.RefObject<HTMLDivElement>
}

export const SideCard = ({
  title,
  content,
  mark,
  isActive,
  titleRight,
  bottomLeft,
  bottomRight,
  className,
  onClick,
  onTitleClick,
  innerRef,
  activeType = 'green',
}: Props) => {
  const onClickCb = React.useCallback(() => {
    onClick && onClick()
  }, [onClick])

  const onTitleClickCb = React.useCallback(
    (e: React.SyntheticEvent) => {
      if (onTitleClick) {
        e.stopPropagation()
        onTitleClick()
      }
    },
    [onTitleClick]
  )

  const classes = classNames(styles.root, styles.dark, isActive && styles.active, styles[activeType], className)

  return (
    <div className={classes} onClick={onClickCb} ref={innerRef}>
      <div className={styles.main}>
        {mark && <div className={styles.mark} />}
        <div className={styles.title} onClick={onTitleClickCb}>
          {title}
          <div className={styles.titleRight}>{titleRight}</div>
        </div>
        <div className={styles.content}>
          <Dotdotdot clamp={3}>{content}</Dotdotdot>
        </div>
      </div>

      {(bottomLeft || bottomRight) && (
        <div className={styles.bottom}>
          {bottomLeft}
          <div className={styles.spacer} />
          {bottomRight}
        </div>
      )}
    </div>
  )
}
