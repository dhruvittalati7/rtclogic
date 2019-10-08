import React from 'react'
import { mem } from 'src/utils/mem'
import classNames from 'classnames'
import { Avatar } from 'src/components/shared/ui/Avatar'
import { CallIcon, DeclineIcon } from 'src/components/shared/ui/Icons'
import { dialService, TCallItem } from 'src/services/DialService'
import { formatPhoneNumber } from 'src/helpers/PhoneHelper'
import { useTimer } from 'src/hooks/useTimer'
import styles from './Item.module.scss'

interface Props {
  call: TCallItem
}

export const Item = mem(({ call }: Props) => {
  let title: React.ReactNode = ''
  if (call.status === 'incoming') {
    title = 'Calling...'
  }

  if (call.status === 'outgoing') {
    title = 'Dialing...'
  }

  if (call.status === 'connected') {
    const timer = useTimer()
    title = `Call duration: ${timer.hours}:${timer.minutes < 10 ? `0${timer.minutes}` : timer.minutes}:${
      timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds
    }`
  }

  return call.isMinimized ? (
    <div className={classNames(styles.minimized, styles.dark)} onClick={() => dialService.expand(call.id)}>
      <Avatar type={'callingMinimized'} className={styles.shadow} account={call.account} />
    </div>
  ) : (
    <div className={classNames(styles.root, styles.dark)}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.control}>{call.status === 'connected' && <span onClick={() => dialService.minimize(call.id)}>>></span>}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.image}>
          <Avatar type={'calling'} account={call.account} />
        </div>
        <div className={styles.name}>{formatPhoneNumber(`${call.displayName}`)}</div>
        <div className={styles.actions}>
          {call.status === 'incoming' && (
            <>
              <div onClick={() => dialService.answer(call.id)} className={classNames(styles.button, styles.call)}>
                <CallIcon width={15} height={16} />
              </div>
              <div onClick={() => dialService.cancel(call.id)} className={classNames(styles.button, styles.decline)}>
                <DeclineIcon width={15} height={16} />
              </div>
            </>
          )}

          {call.status === 'outgoing' && (
            <div onClick={() => dialService.cancel(call.id)} className={classNames(styles.button, styles.decline)}>
              <DeclineIcon width={15} height={16} />
            </div>
          )}

          {call.status === 'connected' && (
            <div onClick={() => dialService.cancel(call.id)} className={classNames(styles.button, styles.decline)}>
              <DeclineIcon width={15} height={16} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
