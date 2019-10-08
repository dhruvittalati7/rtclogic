import { IAppState } from 'src/store'
import { createSelector } from 'reselect'
import { TAccount } from 'src/models/Account'
import { TModel as TNumber } from 'src/models/dids/Number'
import { accountsSelector, currentAccountIdSelector } from 'src/services/selectors/AccountSelectors'
import { currentSourceNumbersSelector } from 'src/services/selectors/DidsSelectors'

export const isSearchSelector = (state: IAppState) => !!state.chats.searchQuery

export const chatListSelector = (state: IAppState) => state.chats.list

export const chatListWithoutCampaign = createSelector(chatListSelector , list => {
  return list.filter(i => !i.campaignId)
})

export const searchChatListSelector = (state: IAppState) => state.chats.searchList

export const activeChatIdSelector = (state: IAppState) => state.chats.activeId

export const activeChatSelector = createSelector(
  isSearchSelector,
  searchChatListSelector,
  chatListSelector,
  activeChatIdSelector,
  (isSearch, searchChatList, chatList, activeChatId) => {
    return isSearch
      ? searchChatList.find(i => i.chatId === activeChatId) || null
      : chatList.find(i => i.chatId === activeChatId) || null
  }
)

export const unAnsweredChatsCountSelector = createSelector(
  chatListSelector,
  chatList => chatList.filter(i => !i.campaignId).reduce((a, i) => a + (!i.isAnswered ? 1 : 0), 0)
)

export const currentChatAccountsSelector = createSelector(
  activeChatSelector,
  accountsSelector,
  (activeChat, accounts) => {
    let result: TAccount[] | null = accounts
    if (activeChat && activeChat.accounts.length) {
      result = activeChat
        ? (activeChat.accounts
            .map(i => {
              return accounts.find(j => j.id === i.id) || null
            })
            .filter(i => i !== null) as TAccount[])
        : null
    }
    return result
  }
)

interface Targets {
  targetAccount: TAccount | null
  targetNumber: string | null
}
export const activeChatTargetsSelector = createSelector(
  activeChatSelector,
  currentAccountIdSelector,
  accountsSelector,
  (activeChat, currentAccountId, stateAccounts): Targets => {
    const result: Targets = {
      targetAccount: null,
      targetNumber: null,
    }

    if (activeChat && activeChat.srcNumber) {
      if (activeChat.accounts.length) {
        const accounts = activeChat.accounts.filter(i => i.id !== currentAccountId) || []
        let account
        if (accounts.length === 1) {
          account = stateAccounts.find(i => i.id === accounts[0].id)
        }
        if (account && account.status === 'online') {
          result.targetAccount = account
        }
      } else if (activeChat.numbers.length) {
        result.targetNumber = activeChat.numbers[0]
      }
    }

    return result
  }
)

export const activeChatSourceNumberSelector = createSelector(
  activeChatSelector,
  currentSourceNumbersSelector,
  (activeChat, currentSourceNumbers): TNumber | null => {
    if (activeChat && activeChat.srcNumber) {
      const srcNumberId = activeChat.srcNumber && activeChat.srcNumber.id
      return currentSourceNumbers.find(i => i.id === srcNumberId) || null
    }
    return null
  }
)
