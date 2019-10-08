import { create as createCapabilities } from 'src/models/dids/Capabilities'

const initialData = {
  id: 0,
  number: '',
  provider: '',
  countryCode: '',
  capabilities: createCapabilities(),
}

export type TModel = typeof initialData

export const create = (data?: Partial<TModel>): TModel => ({ ...initialData, ...data })
