import { create as createDids, map as mapDids } from 'src/models/Dids'
import { clearPhoneNumberValue } from 'src/helpers/PhoneHelper'

export declare type TStatus = 'active' | 'suspended' | 'retired' | 'pending'

interface Endpoint {
  type: string
  login: string
  password: string
}

export interface IAccountStatus {
  accountId?: number
  status: 'online' | 'away' | 'dnd'
  expire?: number
}

interface IImage {
  mime: string
  data: string
}

export interface IAccountProfile {
  login: string
  displayName: string
  email: string
  tz: { name: string, offset: number }
  avatarUrl: string
  avatar?: IImage | null
  isAdmin: boolean
  mobile: string
  is2fa: boolean
  lastLogin: string
  status: TStatus
  extras: string
}

const initialData = {
  id: 0,
  login: '',
  domainName: '',
  isManagerOfGroupId: 0,
  isAdmin: false,
  profile: {
    displayName: '',
    email: '',
    tz: { name: '', offset: 0 },
    avatar: undefined,
    avatarUrl: '',
    mobile: '',
    is2fa: false,
    lastLogin: '',
    status: 'active',
    extras: '',
  } as IAccountProfile,
  extension: '',
  endpoints: [] as Endpoint[],
  dids: createDids(),
  status: '',
  lastLogin: '',
  group: { id: 0, name: '' },
}

export type TAccount = typeof initialData

export const create = (data?: Partial<TAccount>): TAccount => ({ ...initialData, ...data })

export const map = (data: TObjectAny): TAccount => {
  let tz = { name: '', offset: 0 }
  try {
    tz = { ...tz, ...JSON.parse(data.profile.tz) }
  } catch (e) {
    // Nothing to do
  }
  const profile = data.profile || initialData.profile
  profile.tz = tz
  return {
    ...initialData,
    id: parseInt(data.id) || initialData.id,
    login: profile.email,
    isAdmin: !!data.isAdmin,
    domainName: `${data.domainName || initialData.domainName}`,
    profile: {
      ...profile,
      avatarUrl: profile.avatarUrl || '',
    },
    extension: `${data.extension || initialData.extension}`,
    endpoints: (data.endpoints || []).map((i: any) => ({ type: i.type, login: i.login, password: i.password })),
    dids: mapDids(data.dids || {}),
    lastLogin: profile.lastLogin,
  }
}

export const toServer = (item: IAccountProfile): TObjectAny => {
  delete item.lastLogin
  delete item.isAdmin
  delete item.email
  delete item.avatarUrl
  if (item.avatar === undefined) {
    delete item.avatar
  }

  return {
    ...item,
    mobile: item.mobile ? clearPhoneNumberValue(item.mobile) : item.mobile,
    tz: JSON.stringify(item.tz),
  }
}
