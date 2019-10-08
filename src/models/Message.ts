type TMessageType = '' | 'message' | 'system'
type TMessageSubType = '' | 'message' | 'voiceCall'

export interface ISendAttachment {
  uid: string
  name: string
  mime: string
  data: string
}

export interface IAttachment {
  isImage: boolean
  mediaUrl: string
  mime: string
  name: string
  size: number
}

const initialData = {
  id: '',
  accountId: 0,
  body: '',
  timestamp: 0,
  number: '',
  type: 'message' as TMessageType,
  subType: 'message' as TMessageSubType,
  attachments: [] as IAttachment[],
  voiceCall: null as null | IVoiceCall,
}

export type TMessage = typeof initialData

export const create = (data?: Partial<TMessage>): TMessage => ({ ...initialData, ...data })

export const map = (data: TObjectAny): TMessage => ({
  ...initialData,
  id: data.id || `${data.accountId || data.number}_${Date.parse(data.timestamp) || 0}`,
  accountId: parseInt(data.accountId) || initialData.accountId,
  body: data.body === 'test_voicemail' ? '' : `${data.body || initialData.body}`, // TODO remove test case
  timestamp: Date.parse(data.timestamp) || initialData.timestamp,
  number: `${data.number || initialData.number}`,
  type: data.type || initialData.type,
  subType: data.subType || initialData.subType,
  voiceCall: data.subType === 'voiceCall' ? mapVoiceCall(data.body) : null,
  attachments: data.body === 'test_voicemail' // TODO remove test case
    ? [tmpVoicemail]
    : data.attachments || [],
})

const VOICE_RESULT = ['MISSED', 'ANSWERED', 'NOT_ANSWERED', 'BUSY', 'CANCELED'] as const

interface IVoiceCall {
  direction: 'inbound' | 'outboundInternal'
  duration: number
  result: string
  from: null | string
}

const mapVoiceCall = (body: string): IVoiceCall | null => {
  try {
    const data = JSON.parse(body)
    return {
      direction: data.direction,
      duration: data.duration,
      result: VOICE_RESULT[data.result],
      from: data.from,
    }
  } catch (e) {
    return null
  }
}
const tmpVoicemail: IAttachment = { // TODO remove tmp var
  isImage: false,
  mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  mime: '',
  name: '',
  size: 0,
}
