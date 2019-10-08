import { TModel as TNumber, create } from 'src/models/dids/Number'
import { map as mapCapabilities } from 'src/models/dids/Capabilities'

export interface TAdminModel extends TNumber {
  status: string
}

export const map = (data: TObjectAny): TAdminModel => {
  const model = create(data)

  return  {
    ...model,
    countryCode: data.countryName,
    status: data.status,
    provider: data.provider,
    capabilities: mapCapabilities(data.capabilities || 0),
  }
}
