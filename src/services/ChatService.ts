import dayjs from 'dayjs'
import { api } from 'src/classes/Api'
import { appGetState, appUpdateState } from 'src/store'
import { TChat, map as chatMap, TChatStatus, CHAT_STATUS } from 'src/models/Chat'
import { TMessage, map as messageMap, ISendAttachment } from 'src/models/Message'
import { play } from 'src/helpers/AudioHelper'
import { endOfTheDay, startOfTheDay, toServerFormat } from 'src/helpers/DateHelper'
import { findChatById, sortChats } from 'src/helpers/ChatHelper'
import { pushNotification } from 'src/helpers/WebNotificationHelper'
import { accountService } from 'src/services/AccountService'
import { storageService } from 'src/services/StorageService'
import { uniqueByField } from 'src/helpers/CommonHelper'

const CHATS_FROM_DATE = dayjs().add(-5, 'year').toDate()
const CHATS_TO_DATE = dayjs().toDate()
const LOAD_COUNT = 50

class ChatService {
  private appGetState = appGetState
  private appUpdateState = appUpdateState
  private isSubscribed = false

  public subscribe = () => {
    api.ready.then(() => {
      if (!this.isSubscribed) {
        api.call('chats', 'consume')
        api.on('chats:chat', this.handleNewChat)
        api.on('chats:message', this.handleNewMessage)
        api.on('chats:status', this.handleStatus)
        this.isSubscribed = true
      }
    })
  }

  /**
   *
   */
  public setActiveChatId = (id: number | null) => {
    this.appUpdateState(s => s.chats.activeId = id)
    id && storageService.set('lastActiveChatId', id)
  }

  /**
   *
   */
  public loadChatsWithMessages = async () => {
    this.appUpdateState(s => s.chats.listLoading = true)

    try {
      const data: any = await api.call('chats', 'list', {
        startDate: toServerFormat(startOfTheDay(CHATS_FROM_DATE)),
        endDate: toServerFormat(endOfTheDay(CHATS_TO_DATE)),
        count: LOAD_COUNT,
      })
      await this.processChatsData(data.chats || [], true)
    } catch (e) {
      window.logger.error(e)
    }

    this.appUpdateState(s => s.chats.listLoading = false)
  }

  /**
   *
   */
  public loadChatById = async (chatId: number) => {
    try {
      const state = this.appGetState()
      if (!state.chats.list.find(i => i.chatId === chatId)) {
        const data: any = (await api.call('chats', 'getById', { chatsId: [chatId] })) || {}
        if (data[chatId]) {
          data[chatId].chatId = chatId
          await this.processChatsData([data[chatId]])
        } else {
          window.logger.error(`Chat not found: ${chatId}`)
        }
      }
    } catch (e) {
      window.logger.error(e)
    }
  }

  /**
   *
   */
  public loadPrevMessages = async (chatId: number): Promise<number> => {
    const chat = this.getChat(chatId)
    if (chat && chat.firstLoadedId !== true) {
      const firstMessage = chat.messages.find(i => i.id === chat.firstLoadedId)
      if (firstMessage) {
        this.setChatIsLoading(chatId, true)
        const prevMessages = await this.fetchChatMessages(chatId, 'desc', LOAD_COUNT, firstMessage)

        this.appUpdateState(s => {
          const chat = s.chats.list.find(i => i.chatId === chatId)
          if (chat) {
            chat.messages = [...prevMessages, ...chat.messages]
            chat.firstLoadedId = prevMessages.length < LOAD_COUNT ? true : prevMessages[0].id
          }
        })

        this.setChatIsLoading(chatId, false)
        return prevMessages.length
      }
    }

    return 0
  }

  /**
   *
   */
  public loadNextMessages = async (chatId: number): Promise<number> => {
    const chat = this.getChat(chatId)
    if (chat && chat.lastLoadedId !== true) {
      const lastMessage = chat.messages.find(i => i.id === chat.lastLoadedId)
      if (lastMessage) {
        this.setChatIsLoading(chatId, true)
        const nextMessages = await this.fetchChatMessages(chatId, 'asc', LOAD_COUNT, lastMessage)

        this.appUpdateState(s => {
          const chat = s.chats.list.find(i => i.chatId === chatId)
          if (chat) {
            chat.messages = [...chat.messages, ...nextMessages]
            chat.lastLoadedId = nextMessages.length < LOAD_COUNT ? true : nextMessages[nextMessages.length - 1].id
          }
        })

        this.setChatIsLoading(chatId, false)
        return nextMessages.length
      }
    }
    return  0
  }

  /**
   *
   */
  public loadLastMessages = async (chatId: number) => {
    const chat = this.getChat(chatId)
    if (chat) {
      this.setChatIsLoading(chatId, true)
      const messages = await this.fetchChatMessages(chatId)

      this.appUpdateState(s => {
        const chat = s.chats.list.find(i => i.chatId === chatId)
        if (chat) {
          chat.messages = messages
          chat.firstLoadedId = messages.length ? messages[0].id : true
          chat.lastLoadedId = true
        }
      })

      this.setChatIsLoading(chatId, false)
    }
  }

  /**
   *
   */
  public loadMessageContext = async (chatId: number, message: TMessage) => {
    const chat = this.getChat(chatId)
    if (chat) {
      this.setChatIsLoading(chatId, true)
      this.appUpdateState(s => {
        const chat = s.chats.list.find(i => i.chatId === chatId)
        if (chat) {
          chat.messages = []
        }
      })

      const prevMessages = await this.fetchChatMessages(chatId, 'desc', LOAD_COUNT, message)
      const nextMessages = await this.fetchChatMessages(chatId, 'asc', LOAD_COUNT, message)

      this.appUpdateState(s => {
        const chat = s.chats.list.find(i => i.chatId === chatId)
        if (chat) {
          chat.firstLoadedId = prevMessages.length < LOAD_COUNT ? true : prevMessages[0].id
          chat.lastLoadedId = nextMessages.length < LOAD_COUNT ? true : nextMessages[nextMessages.length - 1].id
          chat.messages = [...prevMessages, message, ...nextMessages]
        }
      })
      this.setChatIsLoading(chatId, false)
    }
  }

  /**
   *
   */
  public sendMessage = (chatId: number, message: string, attachments: ISendAttachment[]) => {
    const payload = {
      chatId,
      attachments,
      body: message,
    }
    api.call('chats', 'messageSend', payload)
  }

  /**
   * @error 2201 - chat already exists
   */
  public createChatWithNumbers = async (srcNumberId: number, numbers: string[], name: string): Promise<{ chatId: number; status: string } | null> => {
    const payload = {
      name,
      srcNumberId,
      numbers,
      accountsId: [],
      rolesId: [appGetState().current.roles[0].id],
    }

    return this.createChat(payload)
  }

  /**
   * @error 2201 - chat already exists
   */
  public createChatWithAccounts = async (
    accountsId: number[],
    name: string
  ): Promise<{ chatId: number; status: string } | null> => {
    const payload = {
      name,
      accountsId,
      numbers: [],
      rolesId: [],
    }

    return this.createChat(payload)
  }

  /**
   */
  private createChat = async (payload: any): Promise<{ chatId: number; status: string } | null> => {
    const result = {
      chatId: 0,
      status: '',
    }

    try {
      const { chatId, warn } = await api.call('chats', 'create', payload)

      if (chatId) {
        if (warn && warn.code === 2201) {
          result.chatId = chatId
          result.status = 'exists'
        } else {

          await this.loadChatById(chatId)
          result.chatId = chatId
          result.status = 'success'
        }
      }
    } catch (e) {
      window.logger.error(e)
    }

    return result
  }

  /**
   *
   */
  private processChatsData = async (chatsData: TObjectAny[], sort = false) => {
    const chats: TChat[] = chatsData.map(chatMap)

    const promises = chats.map(
      chat =>
        new Promise(async resolve => {
          const messages = await this.fetchChatMessages(chat.chatId)
          chat.lastMsg = messages.length ? messages[messages.length - 1] : null
          chat.isAnswered = this.isAnswered(chat)
          chat.messages = messages
          chat.firstLoadedId = messages.length ? messages[0].id : true
          chat.lastLoadedId = true
          resolve()
        })
    )

    await Promise.all(promises)

    sort && chats.sort(sortChats)
    this.appUpdateState(s => {
      s.chats.list = uniqueByField([...chats, ...s.chats.list], 'chatId')
    })
  }

  /**
   */
  private fetchChatMessages = async (
    chatId: number,
    direction: string = 'desc',
    count: number = LOAD_COUNT,
    offsetMessage?: TMessage
  ): Promise<TMessage[]> => {

    const payload: TObjectAny = {
      chatId,
      count,
      direction,
      pattern: '*',
    }

    if (offsetMessage) {
      payload.id = offsetMessage.id
      payload.uTimestamp = offsetMessage.timestamp
    }

    let result = []
    try {
      const response = await api.call('chats', 'messagesSearch', payload)
      const messages = response[chatId] || []
      result = messages.map(messageMap)
    } catch (e) {
      window.logger.error(e)
    }

    return direction === 'desc' ? result.reverse() : result
  }

  /**
   *
   */
  private setChatIsLoading = (chatId: number, isLoading: boolean) => {
    this.appUpdateState(s => {
      const chat = s.chats.list.find(i => i.chatId === chatId)
      if (chat) {
        chat.isLoading = isLoading
      }
    })
  }

  /**
   *
   */
  private isAnswered = (item: TChat): boolean => {
    let result = true

    if (item.lastMsg) {
      if (item.numbers.length) {
        result = !item.lastMsg.number
      } else {
        result = item.lastMsg.accountId === this.appGetState().current.accountId
      }
    }

    return result
  }

  /**
   *
   */
  private handleNewChat = (data: any) => {
    const state = this.appGetState()
    const newChat = chatMap(data)

    if (!findChatById(state.chats.list, newChat.chatId)) {
      this.appUpdateState(s => {
        newChat.isAnswered = this.isAnswered(newChat)
        s.chats.list = [newChat, ...state.chats.list]
      })
    }
  }

  /**
   *
   */
  private handleNewMessage = (data: any) => {
    const message = messageMap(data)
    this.appUpdateState(state => {
      const chat = findChatById(state.chats.list, data.chatId)
      if (chat) {
        if (message.accountId !== state.current.accountId) {
          const chatName = chat.name
          if (!chat.campaignId && state.current.extras.allowNewMessageSound && chat.chatId !== state.chats.activeId) {
            play('sms')
          }
          if (state.current.extras.allowWebPush && message.type !== 'system') {
            this.messageFrom(message).then(messageFrom => {
              pushNotification(`${ chatName }`, this.getUrl(data.chatId), {
                body: `${ messageFrom }: ${ message.body }`,
                icon: `${ window.location.origin }/images/logo.png`,
              })
            })
          }
        }
        chat.lastMsg = message

        if (chat.lastLoadedId === true) {
          chat.messages.push(message)
          chat.isAnswered = this.isAnswered(chat)
        }
      }
    })
  }

  /**
   *
   */
  private handleStatus = (data: any) => {
    const chatId: number = data.chatId
    const status: TChatStatus = CHAT_STATUS[data.status]

    this.appUpdateState(s => {
      s.chats.list.forEach(chat => {
        if (chat.chatId === chatId) {
          chat.status = status
        }
      })
    })
  }

  /**
   *
   */
  private messageFrom = async (item: TMessage) => {
    if (item.number) {
      return item.number
    }

    if (item.accountId) {
      const account = await accountService.fetchById(item.accountId)
      if (account) {
        return account.profile.displayName
      }
    }

    return 'Unknown'
  }

  /**
   *
   */
  private getUrl = (chatId: number) => {
    return `${window.location.origin}/chat/${chatId}`
  }

  /**
   *
   */
  private getChat = (chatId: number) => {
    return this.appGetState().chats.list.find(i => i.chatId === chatId)
  }
}

const chatService = new ChatService()
export { chatService }
