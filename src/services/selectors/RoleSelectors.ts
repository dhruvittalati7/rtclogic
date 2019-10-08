import { IAppState } from 'src/store'
import { createSelector } from 'reselect'

export const currentRolesSelector = (state: IAppState) => state.current.roles

export const currentRolesIdsSelector = createSelector(
  currentRolesSelector,
  roles => roles.map(i => i.id)
)

export const isRoleManagerSelector = createSelector(
  currentRolesSelector,
  currentRoles => !!currentRoles.find(i => i.isManager)
)

export const isMemberSelector = createSelector(
  currentRolesSelector,
  currentRoles => currentRoles.length > 0
)
