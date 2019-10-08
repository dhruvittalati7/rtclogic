import React from 'react'
import { connect } from 'react-redux'
import { IState } from 'src/store/state'
import classNames from 'classnames'
import ReactTooltip from 'react-tooltip'
import { CallIcon } from 'src/components/shared/ui/Icons'
import { TChat } from 'src/models/Chat'
import { TAccount } from 'src/models/Account'
import { TModel as TNumber } from 'src/models/dids/Number'
import { activeChatSelector, activeChatSourceNumberSelector, activeChatTargetsSelector } from 'src/services/selectors/ChatSelectors'
import { dialService } from 'src/services/DialService'
import styles from './CallButton.module.scss'

interface Props {
  activeChat: TChat | null
  targets: {
    targetAccount: TAccount | null
    targetNumber: string | null
  }
  sourceNumber: TNumber | null
}

const CallButton = ({ activeChat, targets: { targetAccount, targetNumber }, sourceNumber }: Props) => {
  let disabled = ''

  if (!activeChat) {
    disabled = 'Select a conversation'

  } else if (!targetAccount && !targetNumber) {
    disabled = 'Sorry, you party is not available'

  } else if (targetNumber) {
    if (sourceNumber) {
      if (!sourceNumber.capabilities.voice) {
        disabled = 'Source number has no voice capability'
      }
    } else {
      disabled = 'Source number is not defined'
    }
  }

  const onClick = () => {
    if (targetAccount) {
      dialService.callInternal(targetAccount).catch(window.logger.error)

    } else if (targetNumber && sourceNumber) {
      dialService.callExternal(targetNumber, sourceNumber.number).catch(window.logger.error)
    }
  }

  return (
    <div
      data-tip
      data-for="call-button"
      className={classNames(styles.root, styles.dark, !!disabled && styles.buttonDisabled)}
      onClick={onClick}
    >
      <CallIcon width={15} height={16} />
      {disabled && (
        <ReactTooltip id="call-button" effect="solid" className={'Tooltip'}>
          <span>{disabled}</span>
        </ReactTooltip>
      )}
    </div>
  )
}

const mapStateToProps = (state: IState): Props => ({
  activeChat: activeChatSelector(state.app),
  targets: activeChatTargetsSelector(state.app),
  sourceNumber: activeChatSourceNumberSelector(state.app),
})

const CallButtonConnected = connect(mapStateToProps)(CallButton)
export { CallButtonConnected as CallButton }
