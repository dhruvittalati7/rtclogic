import React from 'react'
import { IState } from 'src/store'
import { mem } from 'src/utils/mem'
import { connect } from 'react-redux'
import { LayoutApp } from 'src/components/shared/layouts/LayoutApp'
import { ChatContent } from 'src/components/shared/ui/chat/ChatContent'
import { CampaignsList } from './viewCampaigns/CampaignsList'
import { CampaignsSearch } from './viewCampaigns/CampaignsSearch'
import { CampaignsHeader } from './viewCampaigns/CampaignsHeader'
import { currentAccountSelector } from 'src/services/selectors/AccountSelectors'
import { activeCampaignChatSelector, editCampaignSelector } from 'src/services/selectors/CampaignSelectors'
import { CampaignsForm } from './viewCampaigns/CampaignsForm'
import { TModel as TCampaign } from 'src/models/Campaign'
import { TAccount } from 'src/models/Account'
import { TChat } from 'src/models/Chat'

interface Props {
  editCampaign: null | TCampaign
  campaignChat: TChat | null
  currentAccount: TAccount | null
}

const ViewCampaigns = mem(({
  editCampaign,
  campaignChat,
  currentAccount,
}: Props) => {

  const content = () => {
    if (editCampaign !== null) {
      return <CampaignsForm key={editCampaign.runtimeKey} campaign={editCampaign} />
    }

    if (campaignChat) {
      return (
        <ChatContent
          chat={campaignChat}
          currentAccount={currentAccount}
          currentChatAccounts={null}
        />
      )
    }

    return null
  }

  return (
    <LayoutApp
      title={'Campaigns'}
      sideBar={<CampaignsList />}
      sideHeader={<CampaignsSearch />}
      header={<CampaignsHeader />}
      content={content()}
    />
  )
})

const mapStateToProps = (state: IState): Props => ({
  editCampaign: editCampaignSelector(state.app),
  campaignChat: activeCampaignChatSelector(state.app),
  currentAccount: currentAccountSelector(state.app),
})

const ViewCampaignsConnected = connect(mapStateToProps)(ViewCampaigns)

export { ViewCampaignsConnected as ViewCampaigns }
