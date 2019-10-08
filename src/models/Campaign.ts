import { clearPhoneNumberValue } from 'src/helpers/PhoneHelper'
import dayjs, { Dayjs } from 'dayjs'

export type TCampaignStatus = 'draft' | 'scheduled' | 'launched' | 'finished' | 'failed'

const initialData = {
  id: 0,
  name: '',
  message: '',
  sourceNumber: { id: 0, number: '' },
  targetNumbers: [] as string[],
  status: 'draft' as TCampaignStatus,
  draft: { scheduled: false, countryCode: '' },
  reason: '',
  chatId: 0,
  roleId: null as null | number,
  startDate: null as null | Dayjs,
  createdAt: null as null | Dayjs,
  runtimeKey: 0,
}

export type TModel = typeof initialData

export const create = (data?: Partial<TModel>): TModel => ({
  ...initialData,
  ...data,
  runtimeKey: (data && data.runtimeKey) || Math.random(),
})

export const filter = (statusFilter: string) => (item: TModel) => item.status === statusFilter || statusFilter === 'all'

export const map = (data: TObjectAny, defaultData = initialData): TModel => {
  return create({
    ...defaultData,
    id: parseInt(data.campaignId) || defaultData.id,
    name: data.name || defaultData.name,
    message: data.body || defaultData.message,
    targetNumbers: data.recipients || [],
    sourceNumber: data.srcNumber || defaultData.sourceNumber,
    status: statusMap[data.status] || defaultData.status,
    reason: data.status === 'failed' ? (data.reason || 'Error') : defaultData.reason,
    draft: { ...defaultData.draft, ...data.draft },
    chatId: parseInt(data.chatId) || defaultData.chatId,
    roleId: parseInt(data.roleId) || defaultData.roleId,
    startDate: data.startDate ? dayjs(data.startDate) : defaultData.startDate,
    createdAt: data.createdAt ? dayjs(data.createdAt) : defaultData.createdAt,
  })
}

export const toServer = (item: TModel): TObjectAny => {
  const result: TObjectAny = {
    name: item.name,
    body: item.message,
    recipients: item.targetNumbers.map(clearPhoneNumberValue),
    status: getServerItemStatus(item),
    srcNumberId: item.sourceNumber.id,
    draft: item.draft,
    startDate: '',
  }

  if (item.id) {
    result.campaignId = item.id
  }

  if (item.startDate) {
    result.startDate = item.startDate.toISOString()
  }

  return result
}

export const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'launched', label: 'Launched' },
  { value: 'finished', label: 'Finished' },
  { value: 'failed', label: 'Failed' },
]

export const statusMap: { [key: string]: TCampaignStatus } = {
  draft: 'draft',
  created: 'scheduled',
  started: 'launched',
  ended: 'finished',
  failed: 'failed',
}

const getServerItemStatus = (item: TModel): string => {
  switch (item.status) {
    case 'scheduled': return 'created'
    case 'launched': return 'started'
    case 'finished': return 'ended'
    case 'failed': return 'failed'
    case 'draft':
    default: return 'draft'
  }
}
