import { IAppState } from 'src/store/state'
import { TAccount } from 'src/models/Account'
import { createSelector } from 'reselect'
import { currentAccountIdSelector } from 'src/services/selectors/AccountSelectors'

export const membersSelector = (state: IAppState): TAccount[] => state.admin.members.list

export const currentMemberSelector = createSelector(
  currentAccountIdSelector,
  membersSelector,
  (accountId, members) => members.find(i => i.id === accountId)
)
