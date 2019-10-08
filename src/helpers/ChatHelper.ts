import { TChat } from 'src/models/Chat'

export const findChatById = (chats: TChat[], id: number) => chats.find(i => i.chatId === id)

export const sortChats = (a: TChat, b: TChat) => {
  const aArchived = a.status === 'archived'
  const bArchived = b.status === 'archived'

  if (aArchived !== bArchived) {
    return +aArchived - +bArchived
  }

  if (a.isAnswered !== b.isAnswered) {
    return +a.isAnswered - +b.isAnswered
  }

  const aTs = a.lastMsg ? a.lastMsg.timestamp : 0
  const bTs = b.lastMsg ? b.lastMsg.timestamp : 0
  return bTs - aTs
}

export const voiceCallResultMap: any = {
  MISSED: 'Call status: recipient not answered',
  ANSWERED: 'Outgoing call',
  NOT_ANSWERED: 'Call status: recipient not answered',
  BUSY: 'Call status: recipient not answered',
  CANCELED: 'Call status: canceled',
}
