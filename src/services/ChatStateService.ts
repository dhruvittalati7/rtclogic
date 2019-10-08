import { appGetState, appNextState, appUpdateState } from 'src/store'
import { storageService } from 'src/services/StorageService' // TODO to be replaced by core api functional (chats state)

interface TChatState {
  t: string // text
  s: [number, number] // cursor selection offset/length // TODO implement
}

interface TChatsState {
  [key: number]: TChatState
}

class ChatStateService {
  private appGetState = appGetState
  private appNextState = appNextState
  private appUpdateState = appUpdateState

  /**
   */
  public getChatState = async (chatId: number): Promise<TChatState | null> => {
    const key = this.key(chatId)
    return storageService.get(key, { t: '', s: [0, 0] })
  }

  /**
   */
  public setChatState = async (chatId: number, state: TChatState) => {
    const key = this.key(chatId)
    storageService.set(key, state)
  }

  /**
   */
  private key = (chatId: number) => {
    const currentAccountId = this.appGetState().current.accountId
    return `state:${currentAccountId}:${chatId}`
  }
}

export const chatStateService = new ChatStateService()
