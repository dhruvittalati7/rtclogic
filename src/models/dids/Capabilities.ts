/* tslint:disable:no-bitwise */

const initialData = {
  sms: false,
  mms: false,
  bulkSms: false,
  bulkMms: false,
  voice: false,
  twoWay: false,
  oneWay: false,
}

export type TModel = typeof initialData

export const create = (data?: Partial<TModel>): TModel => ({ ...initialData, ...data })

export const map = (value: number): TModel => ({
  sms: !!(value & 0b00000001),
  mms: !!(value & 0b00000100),
  bulkSms: !!(value & 0b00000010),
  bulkMms: !!(value & 0b00001000),
  voice: !!(value & 0b00010000),
  twoWay: !!(value & 0b00100000),
  oneWay: !!(value & 0b01000000),
})

export const toArray = (item: TModel) => {
  const result = []
  if (item.sms) {
    result.push('SMS')
  }

  if (item.mms) {
    result.push('MMS')
  }

  if (item.bulkSms) {
    result.push('Bulk SMS')
  }

  if (item.bulkMms) {
    result.push('Bulk MMS')
  }

  if (item.voice) {
    result.push('Voice')
  }

  if (item.twoWay) {
    result.push('Two Way')
  }

  if (item.oneWay) {
    result.push('One Way')
  }

  return result
}
