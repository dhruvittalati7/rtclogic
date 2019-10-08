import { TRole, map as roleMap, create as createRole } from 'src/models/Role'
import { TAccount, map as mapAccount } from 'src/models/Account'
import { TModel as TDids } from 'src/models/Dids'
import { TModel as TNumber } from 'src/models/dids/Number'

const initialData = {
  totalMembers: 0,
  totalNumbers: 0,
  manager: null,
  members: [],
  numbers: [],
}

export interface TAdminModel extends TRole {
  totalMembers: number
  totalNumbers: number
  manager: TAccount | null
  members: TAccount[]
  numbers: TNumber[]
}

export const map = (data: TObjectAny): TAdminModel => {
  const role = roleMap(data)
  const numbers = flatNumbers(role.dids)
  return {
    ...role,
    numbers,
    totalNumbers: numbers.length,
    totalMembers: 0,
    manager: data.manager ? mapAccount(data.manager) : null,
    members: data.members && data.members.map(mapAccount),
  }
}

export const create = (data?: Partial<TAdminModel>): TAdminModel => {
  const role = createRole(data)
  return { ...initialData, ...role, ...data }
}

const flatNumbers = (dids: TDids) => {
  const result: TNumber[] = []
  for (const did of dids.providers) {
    did.numbers.forEach(i => result.push(i))
  }
  return result
}
