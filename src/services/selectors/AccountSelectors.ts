import { IAppState } from 'src/store/state'
import { createSelector } from 'reselect'
import { TAccount } from 'src/models/Account'
import {
  isMemberSelector,
  isRoleManagerSelector,
} from 'src/services/selectors/RoleSelectors'

export const currentAccountIdSelector = (state: IAppState) => state.current.accountId
export const isAdminSelector = (state: IAppState) => state.current.isAdmin
export const accountsSelector = (state: IAppState): TAccount[] => state.accounts.list
export const currentAccountSelector = (state: IAppState) => state.current.account
export const isSearchSelector = (state: IAppState) => !!state.accounts.searchQuery
export const searchAccountListSelector = (state: IAppState) => state.accounts.searchList

export const accountListSelector = createSelector(
  isSearchSelector,
  accountsSelector,
  searchAccountListSelector,
  (isSearch, accounts, searchAccounts): TAccount[] => {
    return isSearch ? searchAccounts || null : accounts || null
  }
)

export const accountListSelectorWithoutCurrent = createSelector(
  isSearchSelector,
  accountsSelector,
  searchAccountListSelector,
  currentAccountIdSelector,
  (isSearch, accounts, searchAccounts, currentAccountId): TAccount[] => {
    let result = isSearch ? searchAccounts || null : accounts || null
    if (result) {
      result = result.filter(i => i.id !== currentAccountId)
    }

    return result
  }
)

export const contactAccountListSelector = createSelector(
  isSearchSelector,
  accountsSelector,
  searchAccountListSelector,
  currentAccountIdSelector,
  (isSearch, accounts, searchAccounts, currentAccountId): TAccount[] => {
    let result = isSearch ? searchAccounts || null : accounts || null
    if (result) {
      result = result.filter(i => i.id !== currentAccountId && i.profile.status === 'active')
    }

    return result
  }
)

export const accessSelector = createSelector(
  isAdminSelector,
  isRoleManagerSelector,
  isMemberSelector,
  (isAdmin, isManager, isMember): TPermission[] => {
    const result: TPermission[] = []
    if (isAdmin) {
      result.push('admin')
    }

    if (isManager) {
      result.push('manager')
    }

    if (isMember) {
      result.push('member')
    }

    return result
  }
)
