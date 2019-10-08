import { createSelector } from 'reselect'
import { IAppState } from 'src/store/state'
import { TModel as TDids, merge as mergeDids } from 'src/models/Dids'
import { TModel as TNumber } from 'src/models/dids/Number'
import { currentAccountSelector } from 'src/services/selectors/AccountSelectors'
import { currentRolesSelector } from 'src/services/selectors/RoleSelectors'

export const currentAccountDidsSelector = createSelector(
  currentAccountSelector,
  currentAccount => currentAccount.dids
)

export const currentRolesDidsSelector = createSelector(
  currentRolesSelector,
  (currentRoles): TDids => {
    const didsCollection = currentRoles.reduce((a, i) => [...a, i.dids], [] as TDids[])
    return mergeDids(didsCollection)
  }
)

export const currentDidsSelector = createSelector(
  currentAccountDidsSelector,
  currentRolesDidsSelector,
  (currentAccountDids, currentRolesDids): TDids => mergeDids([currentAccountDids, currentRolesDids])
)

export const currentSourceNumbersSelector = createSelector(
  currentDidsSelector,
  (currentDids): TNumber[] => {
    const numbers: TNumber[] = []
    currentDids.providers.forEach(provider => {
      provider.numbers.forEach(number => numbers.push(number))
    })
    return numbers
  }
)

const defaultChatSourceNumberIdSelector = (state: IAppState) => state.current.extras.chatSourceNumberId
const defaultDialSourceNumberIdSelector = (state: IAppState) => state.current.extras.dialSourceNumberId

export const defaultChatSourceNumberSelector = createSelector(
  defaultChatSourceNumberIdSelector,
  currentSourceNumbersSelector,
  (sourceNumberId, currentSourceNumbers): TNumber | undefined => {
    return currentSourceNumbers.find(i => i.id === sourceNumberId)
  }
)

export const defaultDialSourceNumberSelector = createSelector(
  defaultDialSourceNumberIdSelector,
  currentSourceNumbersSelector,
  (sourceNumberId, currentSourceNumbers): TNumber | undefined => {
    return currentSourceNumbers.find(i => i.id === sourceNumberId)
  }
)

