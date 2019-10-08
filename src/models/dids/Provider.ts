import { TModel as TNumber } from 'src/models/dids/Number'
import { create as createCapabilities } from 'src/models/dids/Capabilities'

const initialData = {
  name: '',
  numbers: [] as TNumber[],
  capabilities: createCapabilities(),
}

export type TModel = typeof initialData

export const create = (data?: Partial<TModel>): TModel => ({ ...initialData, ...data })
