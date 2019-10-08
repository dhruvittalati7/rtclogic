import { appGetState, appUpdateState } from 'src/store'
import { TAccount } from 'src/models/Account'
import { Caller } from 'src/classes/Caller'
import { ICallInstance } from 'src/classes/Pbx'
import { play } from 'src/helpers/AudioHelper'
import { accountService } from 'src/services/AccountService'
import { defaultDialSourceNumberSelector } from 'src/services/selectors/DidsSelectors'
import { layoutService } from 'src/services/LayoutService'

export type TCallStatus = 'incoming' | 'outgoing' | 'connected' | 'hold'

export interface TCallItem {
  id: string
  account?: TAccount
  displayName: string
  isMinimized: boolean
  status: TCallStatus
  call: null | ICallInstance
}

class DialService {
  private appGetState = appGetState
  private appUpdateState = appUpdateState
  private soundStop?: () => void
  private caller?: Caller

  public toggleDial = (openDial: boolean) => {
    this.appUpdateState(s => s.calls.openDial = openDial)
  }

  public hideDial = () => {
    this.toggleDial(false)
  }

  public minimize = (id: string) => {
    this.updateCallItem(id, { isMinimized: true })
  }

  public expand = (id: string) => {
    this.updateCallItem(id, { isMinimized: false })
  }

  public init = async () => {
    this.requestMediaCredentials().catch(window.logger.error)
  }

  /**
   */
  public callInternal = async (account: TAccount) => {
    if (!this.caller) {
      this.showCallerError()
      return
    }

    this.soundStop && this.soundStop()
    const accountFull = await accountService.fetchById(account.id)
    const extension = accountFull && accountFull.extension
    if (extension) {
      const call = this.caller.call(extension, '')
      if (call) {
        this.soundStop = play('call', true)
        const item = this.addCallItem(account.profile.displayName, 'outgoing', call)
        this.setOtherOnHold(item.id)
        this.updateCallItem(item.id, { account })
      }
    }
  }

  /**
   */
  public callExternal = async (targetNumber: string, sourceNumberValue?: string) => {
    if (!this.caller) {
      this.showCallerError()
      return
    }

    this.soundStop && this.soundStop()
    let sourceNumber = sourceNumberValue
    if (!sourceNumberValue) {
      const sourceNumberItem = defaultDialSourceNumberSelector(appGetState())
      sourceNumber = sourceNumberItem ? sourceNumberItem.number : ''
    }

    if (sourceNumber) {
      const call = this.caller.call(targetNumber, sourceNumber)
      if (call) {
        this.soundStop = play('call', true)
        const item = this.addCallItem(targetNumber, 'outgoing', call)
        this.setOtherOnHold(item.id)
      }
    } else {
      const text = 'Current source number is undefined'
      layoutService.showNotification(text, 'error')
      window.logger.error(text)
    }
  }

  /**
   */
  public answer = (id: string) => {
    this.soundStop && this.soundStop()
    const callItem = this.getCallItem(id)
    if (callItem && callItem.call) {
      callItem.call.accept()
      this.updateCallItem(id, { status: 'connected' })
    }
  }

  /**
   */
  public cancel = (id: string) => {
    const callItem = this.getCallItem(id)
    if (callItem) {
      this.deleteCallItem(id)
      if (callItem.call) {
        if (callItem.status === 'connected') {
          callItem.call.terminate()
        }
        if (callItem.status === 'outgoing') {
          callItem.call.terminate()
        }
        if (callItem.status === 'incoming') {
          callItem.call.terminate({ statusCode: '486' })
        }
      }
    }
  }

  /**
   */
  private onCallerIncomingCall = ({ call }: { call: ICallInstance }) => {
    this.soundStop = play('answer', true)
    let name = 'Unknown number'
    if (call.remoteIdentity.displayName && call.remoteIdentity.displayName.toLowerCase() !== 'unavailable') {
      name = call.remoteIdentity.displayName
    } else if (call.remoteIdentity.uri.user) {
      name = call.remoteIdentity.uri.user
    }
    const item = this.addCallItem(name, 'incoming', call)

    if (call.remoteIdentity.uri.user && item.id) {
      const account = accountService.getByExtension(call.remoteIdentity.uri.user)
      if (account) {
        this.updateCallItem(item.id, { account })
      }
    }
  }

  /**
   */
  private onCallerAcceptedCall = ({ call }: { call: ICallInstance }) => {
    this.soundStop && this.soundStop()
    this.setOtherOnHold(call.id)
    this.updateCallItem(call.id, { status: 'connected' })
  }

  /**
   */
  private onCallerCanceledCall = ({ call }: { call: ICallInstance }) => {
    this.soundStop && this.soundStop()
    this.deleteCallItem(call.id)
  }

  /**
   */
  private addCallItem = (displayName: string, status: TCallStatus, call: ICallInstance): TCallItem => {
    const id = call.id
    const item = { id, displayName, status, call, isMinimized: false }
    this.appUpdateState(s => s.calls.callBlock.unshift(item))
    return item
  }

  /**
   */
  private setOtherOnHold = (id: string) => {
    this.appGetState().calls.callBlock.forEach(i => {
      if (i.id !== id) {
        this.cancel(i.id)
      }
    })
  }

  /**
   */
  private getCallItem = (id: string): TCallItem | undefined => {
    return this.appGetState().calls.callBlock.find(i => i.id === id)
  }

  /**
   */
  private updateCallItem = (id: string, payload: Partial<TCallItem>) => {
    this.appUpdateState(s => {
      const idx = s.calls.callBlock.findIndex(i => i.id === id)
      if (idx !== -1) {
        s.calls.callBlock[idx] = { ...s.calls.callBlock[idx], ...payload }
      }
    })
  }

  /**
   */
  private deleteCallItem = (id: string) => {
    this.appUpdateState(s => {
      s.calls.callBlock = s.calls.callBlock.filter(i => i.id !== id)
    })
  }

  /**
   */
  private createCaller = () => {
    const account = this.appGetState().current.account
    const endpoint = account.endpoints.find(i => i.type === 'browser')
    if (endpoint) {
      const { domainName } = account
      const { login, password } = endpoint
      this.caller = new Caller(login, password, domainName)
      this.caller.on(Caller.EVENT_CALL_IN, this.onCallerIncomingCall)
      this.caller.on(Caller.EVENT_CALL_ACCEPTED, this.onCallerAcceptedCall)
      this.caller.on(Caller.EVENT_CALL_CANCELED, this.onCallerCanceledCall)
    }
  }

  /**
   */
  private requestMediaCredentials = async () => {
    const constraints = { audio: true, video: false }

    try {
      await navigator.mediaDevices.getUserMedia(constraints)
      this.createCaller()
      /* use the stream */
    } catch (err) {
      window.logger.warn(err)
      /* handle the error */
    }
  }

  /**
   */
  private showCallerError = () => {
    window.logger.error('Caller is not initialized')
    layoutService.showNotification('An error occurred', 'error')
  }
}

const dialService = new DialService()
export { dialService }
