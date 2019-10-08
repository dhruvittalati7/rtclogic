import { appGetState, appNextState, appUpdateState } from 'src/store'
import { TAccount } from 'src/models/Account'
import { TModel as TExtras, map } from 'src/models/Extras'
import { api } from 'src/classes/Api'

class ExtrasService {
  private appGetState = appGetState
  private appNextState = appNextState
  private appUpdateState = appUpdateState

  public initFrom = (account: TAccount) => {
    const extras = map(account.profile.extras)
    this.appUpdateState(s => s.current.extras = extras)
  }

  public setDialSourceNumberId = async (id: number) => {
    return this.update('dialSourceNumberId', id)
  }

  public setChatSourceNumberId = async (id: number) => {
    return this.update('chatSourceNumberId', id)
  }

  public setAllowWebPush = async (value: boolean) => {
    return this.update('allowWebPush', value)
  }

  public setAllowNewMessageSound = async (value: boolean) => {
    return this.update('allowNewMessageSound', value)
  }

  private update = async <K extends keyof TExtras>(key: K, value: TExtras[K]) => {
    this.appUpdateState(s => s.current.extras[key] = value)

    try {
      const payload = {
        accountId: this.appGetState().current.accountId,
        extras: JSON.stringify(this.appGetState().current.extras),
      }
      await api.call('accounts', 'update', payload)
    } catch (e) {
      window.logger.error(e)
    }
  }
}

export const extrasService = new ExtrasService()
