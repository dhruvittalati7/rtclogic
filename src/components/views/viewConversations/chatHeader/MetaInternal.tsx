import React, { useState } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { IState } from 'src/store'
import { TChat } from 'src/models/Chat'
import { TAccount } from 'src/models/Account'
import { Avatar } from 'src/components/shared/ui/Avatar'
import { activeChatSelector, currentChatAccountsSelector } from 'src/services/selectors/ChatSelectors'
import ReactTooltip from 'react-tooltip'
import styles from './MetaInternal.module.scss'
import posed from 'react-pose'

interface Props {
  chat: TChat | null
  accounts: TAccount[] | null
}

const ChatHeaderMetaInternal = React.memo(({ chat, accounts }: Props) => {
  const [showAllAccount, setShowAllAccount] = useState<boolean>(false)

  if (!chat) {
    return null
  }

  const count = chat.accounts.length
  const rest = count > 3 ? count - 3 : 0
  const chatAccounts = chat.accounts.slice(0, count - rest)
  const restAccounts = chat.accounts.slice(count - rest, count)

  const mouseOut = () => {
    window.logger.info('out')
    setShowAllAccount(false)
  }

  const mouseOver = () => {
    window.logger.info('over')
    setShowAllAccount(true)
  }

  return (
    <div className={classNames(styles.root, styles.dark)}>
      <div className={styles.item}>
        <div className={styles.title}>Private conversation: {chat.name}</div>
      </div>
      <div
        className={classNames(styles.item, styles.avatars)}
        style={{ width: (count - rest + 1) * 25 }}
        onMouseLeave={() => mouseOut()}
        onMouseEnter={() => mouseOver()}
      >
        {accounts &&
          chatAccounts.map((i, index) => {
            const account = accounts.find(a => a.id === i.id)
            const displayName = account ? account.profile.displayName : ''
            const accountId = i.id

            return (
              <div
                style={{ position: 'absolute', left: index * 25 }}
                data-tip={displayName}
                data-for={`tooltip${accountId}`}
                key={`avatar-list${accountId}`}
              >
                <Avatar type={'profile'} account={account} />
                <ReactTooltip id={`tooltip${accountId}`} effect="solid" className={'Tooltip'} place={'bottom'} />
              </div>
            )
          })}

        {!!rest && (
          <div className={styles.rest} style={{ left: (count - rest) * 25 }}>
            +{rest}
            {accounts && (
              <Animated className={styles.extra} initialPose="start" pose={!showAllAccount ? 'finish' : 'active'}>
                {restAccounts.map((i, index) => {
                  const account = accounts.find(a => a.id === i.id)
                  const displayName = account ? account.profile.displayName : ''
                  const accountId = i.id

                  return (
                    <div
                      style={{ position: 'absolute', top: index * 35 }}
                      data-tip={displayName}
                      data-for={`tooltip${accountId}`}
                      key={`avatar-list${accountId}`}
                    >
                      <Avatar type={'profile'} account={account} />
                      <ReactTooltip id={`tooltip${accountId}`} effect="solid" className={'Tooltip'} place={'left'} />
                    </div>
                  )
                })}
              </Animated>
            )}
          </div>
        )}
      </div>
    </div>
  )
})

const mapStateToProps = (state: IState): Props => ({
  chat: activeChatSelector(state.app),
  accounts: currentChatAccountsSelector(state.app),
})

const ChatHeaderMetaInternalConnected = connect(mapStateToProps)(ChatHeaderMetaInternal)
export { ChatHeaderMetaInternalConnected as ChatHeaderMetaInternal }

const Animated = posed.div({
  start: { opacity: 0 },
  active: { opacity: 1, transition: { duration: 500 } },
  finish: { opacity: 0, transition: { duration: 500 } },
})
