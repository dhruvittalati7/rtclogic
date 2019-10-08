import { api } from 'src/classes/Api'
import { appGetState, appNextState, appUpdateState } from 'src/store'
import { TChat } from 'src/models/Chat'
import { map as messageMap } from 'src/models/Message'
import { createQueryPattern, debounce, uniqueByField } from 'src/helpers/CommonHelper'
import { findChatById } from 'src/helpers/ChatHelper'
import { chatService } from 'src/services/ChatService'

class ChatSearchService {
  private appGetState = appGetState
  private appNextState = appNextState
  private appUpdateState = appUpdateState

  /**
   */
  public setSearchQuery = (query: string = '') => {
    this.appUpdateState(s => {
      s.chats.searchQuery = query
      s.chats.searchLoading = !!query
    })
    const p = this.performSearch()
    p && p.catch(window.logger.error)
  }

  /**
   */
  public setSearchInFocus = (focus: boolean) => {
    this.appUpdateState(s => (s.chats.searchInFocus = focus))
  }

  /**
   */
  protected performSearch = debounce(async () => {
    const query = this.appGetState().chats.searchQuery
    if (!query) {
      return
    }

    const pattern = createQueryPattern(query)
    const resultChatsByMessages = await this.performSearchChatMessages(query)
    const resultChatsByTitles = this.performSearchChatTitles(query, pattern)
    const resultChatsByNumbers = this.performSearchChatNumbers(query, pattern)
    const resultChatsByMembers = this.performSearchChatMembers(query, pattern)

    const chats = uniqueByField([
      ...resultChatsByTitles,
      ...resultChatsByMessages,
      ...resultChatsByNumbers,
      ...resultChatsByMembers,
    ], 'chatId')

    this.appUpdateState(s => (s.chats.searchList = chats))
    this.appUpdateState(s => (s.chats.searchLoading = false))
  }, 500)

  /**
   */
  protected performSearchChatMessages = async (query: string): Promise<TChat[]> => {
    try {
      const payload = { pattern: query, count: 50 }
      const response = await api.call('chats', 'messagesSearch', payload)
      const chats: TChat[] = []
      const strChatIds = Object.keys(response)
      for await (const strChatId of strChatIds) {
        const chatId = parseInt(strChatId)
        if (chatId) {
          await chatService.loadChatById(chatId)

          const state = this.appGetState()
          const chatFromList = findChatById(state.chats.list, chatId)

          if (chatFromList) {
            const chat: TChat = {
              ...chatFromList,
              messages: response[chatId].map(messageMap).reverse(),
            }
            chats.push(chat)
          }
        }
      }

      return chats
    } catch (e) {}

    return []
  }

  /**
   */
  protected performSearchChatTitles = (query: string, pattern: RegExp): TChat[] => {
    return this.appGetState().chats.list.filter(i => i.name.search(pattern) !== -1)
  }

  /**
   */
  protected performSearchChatNumbers = (query: string, pattern: RegExp): TChat[] => {
    return this.appGetState().chats.list.filter(chat => {
      const foundSourceNumber = chat.numbers.length > 0 && chat.srcNumber && chat.srcNumber.number.search(pattern) !== -1
      const foundTargetNumber = chat.numbers.join(' ').search(pattern) !== -1
      return foundSourceNumber || foundTargetNumber
    })
  }

  /**
   */
  protected performSearchChatMembers = (query: string, pattern: RegExp): TChat[] => {
    return this.appGetState().chats.list.filter(chat => {
      const accountIds = chat.accounts.map(i => i.id)
      if (accountIds.length > 0) {
        const accounts = this.appGetState().accounts.list.filter(i => accountIds.includes(i.id))
        const names = accounts.map(i => i.profile.displayName).join(' ')
        return names.search(pattern) !== -1
      }
      return false
    })
  }
}

const chatSearchService = new ChatSearchService()
export { chatSearchService }
