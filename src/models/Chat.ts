import { TMessage } from 'src/models/Message'
import { TAccount, map as accountMap } from 'src/models/Account'
import { TRole, map as roleMap } from 'src/models/Role'

interface ISrcNumber {
  id: number
  number: string
}

export const CHAT_STATUS = ['active', 'archived', 'readonly'] as const
export type TChatStatus = 'active' | 'archived' | 'readonly'

const initialData = {
  chatId: 0,
  name: '',
  campaignId: 0,
  accountId: 0,
  status: 'active' as TChatStatus,
  srcNumber: null as null | ISrcNumber,
  accounts: [] as TAccount[],
  roles: [] as TRole[],
  numbers: [] as string[],
  messages: [] as TMessage[],
  firstLoadedId: true as string | boolean, // true if full loaded
  lastLoadedId: true as string | boolean, // true if full loaded
  isLoading: false,
  lastMsg: null as null | TMessage,
  isAnswered: true,
}

export type TChat = typeof initialData

export const create = (data?: Partial<TChat>): TChat => ({ ...initialData, ...data })

export const map = (data: TObjectAny): TChat => {
  const numbers = data.numbers || initialData.numbers

  return create({
    numbers,
    chatId: parseInt(data.chatId) || initialData.chatId,
    campaignId: parseInt(data.campaignId) || initialData.campaignId,
    accountId: parseInt(data.accountId) || initialData.accountId,
    name: `${data.name || initialData.name}`,
    accounts: data.accounts && data.accounts.map ? data.accounts.map(accountMap) : [],
    roles: data.roles && data.roles.map ? data.roles.map(roleMap) : [],
    srcNumber: { ...initialData.srcNumber, ...data.srcNumber },
    status: CHAT_STATUS[data.status] || 'active',
  })
}

export const filter = (filter: string, currentAccountId: number | null) => (item: TChat) =>
  filter === 'all' ||
  (filter === 'replied' && item.isAnswered) ||
  (filter === 'unreplied' && !item.isAnswered) ||
  (filter === 'mine' && item.accountId === currentAccountId)
