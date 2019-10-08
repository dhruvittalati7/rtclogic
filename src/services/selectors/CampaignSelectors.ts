import { IAppState } from 'src/store'
import { createSelector } from 'reselect'
import { create as createCampaign } from 'src/models/Campaign'

export const editCampaignIdSelector = (state: IAppState) => state.campaigns.editId

export const activeCampaignIdSelector = (state: IAppState) => state.campaigns.activeId

export const CampaignListSelector = (state: IAppState) => state.campaigns.list

export const CampaignChatsSelector = (state: IAppState) => state.chats.list.filter(i => !!i.campaignId)

export const editCampaignSelector = createSelector(
  editCampaignIdSelector,
  CampaignListSelector,
  (editCampaignId, campaignList) => {
    if (editCampaignId === null) {
      return null
    }
    return campaignList.find(i => i.id === editCampaignId) || createCampaign()
  }
)

export const activeCampaignSelector = createSelector(
  activeCampaignIdSelector,
  CampaignListSelector,
  (activeCampaignId, campaignList) => campaignList.find(i => i.id === activeCampaignId) || null
)

export const activeCampaignChatSelector = createSelector(
  activeCampaignSelector,
  CampaignChatsSelector,
  (activeCampaign, campaignChats) => {
    if (activeCampaign && activeCampaign.chatId) {
      return campaignChats.find(i => i.chatId === activeCampaign.chatId) || null
    }
    return null
  }
)
