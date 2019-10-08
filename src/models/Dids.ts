import { TModel as TProvider, create as createProvider } from 'src/models/dids/Provider'
import { create as createNumber } from 'src/models/dids/Number'
import { map as mapCapabilities } from 'src/models/dids/Capabilities'
import { uniqueByField } from 'src/helpers/CommonHelper'

const initialData = {
  providers: [] as TProvider[],
}

export type TModel = typeof initialData

export const create = (data?: Partial<TModel>): TModel => ({ ...initialData, ...data })

export const map = (data: TObjectAny): TModel => {
  const providers: TProvider[] = []

  Object.keys(data).forEach(providerName => {
    const providerData = data[providerName]
    const providerNumbersData = providerData.numbers || {}

    const provider = createProvider({ name: providerName })
    provider.capabilities = mapCapabilities(providerData.capabilities || 0)
    provider.numbers = []

    Object.keys(providerNumbersData).forEach(countryCode => {
      const numbersData = providerNumbersData[countryCode] || []
      numbersData.forEach((numberData: TObjectAny) => {
        provider.numbers.push(
          createNumber({
            countryCode,
            id: numberData.id,
            number: numberData.number,
            provider: providerName,
            capabilities: mapCapabilities(numberData.capabilities || 0),
          })
        )
      })
    })

    providers.push(provider)
  })

  return create({ providers })
}

export const merge = (didsCollection: TModel[]): TModel => {
  const providersMap: { [key: string]: TProvider } = {}
  didsCollection.forEach(dids => {
    if (dids && dids.providers) {
      dids.providers.forEach(provider => {
        if (!providersMap[provider.name]) {
          providersMap[provider.name] = provider
        } else {
          providersMap[provider.name].numbers = [...providersMap[provider.name].numbers, ...provider.numbers]
        }
      })
    }
  })

  const providers = Object.values(providersMap)
  providers.forEach(provider => {
    provider.numbers = uniqueByField(provider.numbers, 'id')
  })

  return create({ providers })
}
