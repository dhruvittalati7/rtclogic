const initialData = {
  chatSourceNumberId: 0,
  dialSourceNumberId: 0,
  allowWebPush: true,
  allowNewMessageSound: true,
}

export type TModel = typeof initialData

export const create = (data?: Partial<TModel>): TModel => ({ ...initialData, ...data })

export const map = (strData: string): TModel => {
  let data: TObjectAny = {}
  try {
    data = JSON.parse(strData) || {}
  } catch (e) {
  }
  return create({ ...data })
}
