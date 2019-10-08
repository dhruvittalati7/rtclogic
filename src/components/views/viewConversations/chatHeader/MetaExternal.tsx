import React from 'react'
import classNames from 'classnames'
import { TChat } from 'src/models/Chat'
import { formatPhoneNumber } from 'src/helpers/PhoneHelper'
import styles from './MetaExternal.module.scss'
import { IState } from 'src/store'
import { activeChatSelector } from 'src/services/selectors/ChatSelectors'
import { connect } from 'react-redux'

interface Props {
  chat: TChat | null
}

const ChatHeaderMetaExternal = ({ chat }: Props) => {
  const chatSource = getChatSource(chat)
  const chatTarget = getChatTarget(chat)

  return (
    <div className={classNames(styles.root, styles.dark)}>
      <div className={styles.item}>
        <div className={styles.title}>Source Number</div>
        <div className={styles.content}>{chatSource}&nbsp;</div>
      </div>
      <div className={styles.item}>
        <div className={styles.title}>Target Number</div>
        <div className={styles.content}>{chatTarget}&nbsp;</div>
      </div>
      <div className={styles.item}>
        <div className={styles.title}>CNAM</div>
        <div className={styles.content}>&nbsp;</div>
      </div>
      {/*<div className={styles.item}>*/}
      {/*  <div className={styles.title}>Imei</div>*/}
      {/*  <div className={styles.content}>&nbsp;</div>*/}
      {/*</div>*/}
      {/*<div className={styles.item}>*/}
      {/*  <div className={styles.title}>Gateway</div>*/}
      {/*  <div className={styles.content}>&nbsp;</div>*/}
      {/*</div>*/}
    </div>
  )
}

const getChatSource = (chat: TChat | null) => (chat && chat.srcNumber)
  ? formatPhoneNumber(`${chat.srcNumber.number}`)
  : ''

const getChatTarget = (chat: TChat | null) => (chat && chat.numbers.length)
  ? chat.numbers.map(i => formatPhoneNumber(`${i}`)).join(',')
  : ''

const mapStateToProps = (state: IState): Props => ({
  chat: activeChatSelector(state.app),
})

const ChatHeaderMetaExternalConnected = connect(mapStateToProps)(ChatHeaderMetaExternal)
export { ChatHeaderMetaExternalConnected as ChatHeaderMetaExternal }
