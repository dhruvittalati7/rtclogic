import dayjs from 'dayjs'
import { api } from 'src/classes/Api'
import { Omit } from 'react-redux'
import { appGetState, appNextState, appUpdateState } from 'src/store'
import { endOfTheDay, startOfTheDay, toServerFormat } from 'src/helpers/DateHelper'
import { TModel as TCampaign, create, map, toServer, statusMap } from 'src/models/Campaign'
import { sortCampaigns } from 'src/helpers/CampaignHelper'
import { mapToArray } from 'src/helpers/CommonHelper'
import { chatService } from 'src/services/ChatService'

const FROM_DATE = dayjs().add(-1, 'month').toDate()
const TO_DATE = dayjs().toDate()

class CampaignService {
  private appGetState = appGetState
  private appNextState = appNextState
  private appUpdateState = appUpdateState
  private isSubscribed = false

  public subscribe = () => {
    api.ready.then(() => {
      if (!this.isSubscribed) {
        this.isSubscribed = true
        api.call('campaigns', 'consume')
        api.on('campaigns:campaign', this.handleCampaignNew)
        api.on('campaigns:update', this.handleCampaignUpdate)
        api.on('campaigns:delete', this.handleCampaignDelete)
        api.on('campaigns:status', this.handleCampaignStatus)
      }
    })
  }

  /**
   */
  public setActiveCampaign = (id: number) => {
    this.edit(null)
    const campaign = this.appGetState().campaigns.list.find(i => i.id === id)
    if (campaign) {
      this.appUpdateState(s => (s.campaigns.activeId = id))
      this.loadCampaignChat(campaign)
    }
  }

  /**
   */
  public loadCampaigns = async () => {
    this.appUpdateState(s => s.campaigns.listLoading = true)

    const data: any = await api.call('campaigns', 'list', {
      startDate: toServerFormat(startOfTheDay(FROM_DATE)),
      endDate: toServerFormat(endOfTheDay(TO_DATE)),
      count: 100,
    })
    delete data['totalCount']
    const campaigns = mapToArray(data, 'campaignId').map(data => map(data))
    this.appUpdateState(s => s.campaigns.list = campaigns)
    this.resort()

    this.appUpdateState(s => s.campaigns.listLoading = false)
  }

  /**
   */
  public edit = (campaignId: null | number) => {
    this.appUpdateState(s => s.campaigns.editId = campaignId)
  }

  /**
   */
  public save = async (data: Omit<TCampaign, 'id' | 'reason'>, id?: number): Promise<number | null> => {
    if (id) { // update
      const campaigns = this.appGetState().campaigns.list
      const campaign = campaigns.find(i => i.id === id)
      if (campaign) {
        const payload = toServer({ ...campaign, ...data })
        const response = await api.call('campaigns', 'update', payload)
        return response ? response.campaignId : null
      }

    } else { // create
      const campaign = create(data)
      const payload = toServer(campaign)
      const response = await api.call('campaigns', 'create', payload)
      return response ? response.campaignId : null
    }

    return 0
  }

  /**
   */
  public delete = async (id: number): Promise<void> => {
    this.edit(null)
    await api.call('campaigns', 'delete', { campaignsId: [id] })
  }

  /**
   */
  private resort = () => {
    const campaigns = this.appGetState().campaigns.list
    const sortedCampaigns = [...campaigns].sort(sortCampaigns)
    this.appUpdateState(s => s.campaigns.list = sortedCampaigns)
  }

  /**
   */
  private handleCampaignNew = (data: any) => {
    const campaign = map(data)
    this.appUpdateState(s => {
      s.campaigns.list = [...s.campaigns.list, campaign]
    })
    this.resort()
    this.loadCampaignChat(campaign)
  }

  /**
   */
  private handleCampaignUpdate = (data: any) => {
    const id = data.campaignId
    if (id) {
      const campaigns = this.appGetState().campaigns.list
      const idx = campaigns.findIndex(i => i.id === id)
      if (idx !== -1) {
        const campaign = campaigns[idx]
        const updatedCampaign = create({ ...map(data, campaign) })
        this.appUpdateState(s => {
          s.campaigns.list[idx] = updatedCampaign
        })
        this.resort()
        this.loadCampaignChat(campaign)
      }
    }
  }

  /**
   */
  private handleCampaignDelete = (data: any) => {
    const campaignIds = data['campaignsId']
    if (campaignIds) {
      this.appUpdateState(s => {
        s.campaigns.list = s.campaigns.list.filter(i => !campaignIds.includes(i.id))
      })
    }
  }

  /**
   */
  private handleCampaignStatus = (data: any) => {
    const campaignId = data['campaignId']
    const status = data['status']
    if (campaignId && status) {
      this.appUpdateState(s => {
        const campaign = s.campaigns.list.find(i => i.id === campaignId)
        if (campaign) {
          campaign.status = statusMap[status] || campaign.status
          campaign.reason = data['reason'] || ''
        }
      })
      this.resort()
    }
  }

  /**
   */
  private loadCampaignChat = (campaign: TCampaign) => {
    if (campaign.chatId) {
      chatService.loadChatById(campaign.chatId).catch(window.logger.error)
    }
  }
}

export const campaignService = new CampaignService()
