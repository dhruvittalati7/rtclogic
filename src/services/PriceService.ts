import { api } from 'src/classes/Api'
import { appGetState, appNextState, appUpdateState } from 'src/store'

class PriceService {
  private appGetState = appGetState
  private appNextState = appNextState
  private appUpdateState = appUpdateState

  /**
   */
  public getCampaignPrice = async (sourceNumberId: number, targetNumbers: string[], text: string): Promise<null | number> => {
    if (!text || !sourceNumberId || !targetNumbers.length) {
      return null
    }

    const response = await api.call('campaigns', 'price', {
      recipients: targetNumbers,
      srcNumberId: sourceNumberId,
      body: text,
    })

    if (response && response.totalPrice) {
      if (response.warn && response.warn.code === 1003) {
        return null
      }
      return response.totalPrice
    }

    return null
  }
}

export const priceService = new PriceService()
