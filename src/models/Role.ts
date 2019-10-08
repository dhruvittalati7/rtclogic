import { create as createDids, map as mapDids } from 'src/models/Dids'

const initialData = {
  id: 0,
  name: '',
  extension: '',
  isManager: false,
  dids: createDids(),
}

export type TRole = typeof initialData

export const create = (data?: Partial<TRole>): TRole => ({ ...initialData, ...data })

export const map = (data: TObjectAny): TRole => {
  const dids = mapDids(data.dids || {})
  return {
    ...initialData,
    dids,
    id: parseInt(data.id) || initialData.id,
    name: `${data.name || initialData.name}`,
    isManager: !!data.isManager,
    extension: `${data.extension || initialData.name}`,
  }
}
