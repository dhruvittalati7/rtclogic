import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { IState } from 'src/store'
import { ListTitle } from 'src/components/shared/ui/ListTitle'
import { EditIcon } from 'src/components/shared/ui/Icons'
import { ListFilter } from 'src/components/shared/ui/ListFilter'
import { CampaignsListItems } from './campaignsList/Items'
import { TModel as TCampaign, filter as campaignFilter, filterOptions } from 'src/models/Campaign'
import { campaignService } from 'src/services/CampaignService'
import { activeCampaignIdSelector } from 'src/services/selectors/CampaignSelectors'
import { isRoleManagerSelector } from 'src/services/selectors/RoleSelectors'
import styles from './CampaignsList.module.scss'

interface Props {
  isRoleManager: boolean
  isLoading: boolean
  campaigns: TCampaign[]
  activeCampaignId: number | null
  setActiveCampaign: (id: number) => void
  editCampaignId: number | null
  setEditCampaign: (id: null | number) => void
}

const CampaignsList = ({ isLoading, isRoleManager, campaigns, activeCampaignId, editCampaignId, setActiveCampaign, setEditCampaign }: Props) => {
  const [filter, setFilter] = React.useState('all')
  const visibleCampaigns = campaigns.filter(campaignFilter(filter))
  const highlightCampaignId = editCampaignId || activeCampaignId

  return (
    <div className={classNames(styles.root, styles.dark)}>
      <ListTitle
        title={'Campaigns'}
        badge={0}
        after={
          isRoleManager && (
            <EditIcon width={25} height={25} className={styles.newCampaign} onClick={() => setEditCampaign(0)} />
          )
        }
      />

      <ListFilter filter={filter} options={filterOptions} onChange={setFilter} className={styles.filter} />

      <CampaignsListItems
        isLoading={isLoading}
        highlightCampaignId={highlightCampaignId}
        campaigns={visibleCampaigns}
        onSelect={campaign => setActiveCampaign(campaign.id)}
        onEdit={campaign => setEditCampaign(campaign.id)}
      />
    </div>
  )
}

const mapStateToProps = (state: IState): Props => ({
  isRoleManager: isRoleManagerSelector(state.app),
  isLoading: state.app.campaigns.listLoading,
  campaigns: state.app.campaigns.list,
  activeCampaignId: activeCampaignIdSelector(state.app),
  setActiveCampaign: campaignService.setActiveCampaign,
  editCampaignId: state.app.campaigns.editId,
  setEditCampaign: campaignService.edit,
})

const CampaignsListConnected = connect(mapStateToProps)(CampaignsList)

export { CampaignsListConnected as CampaignsList }
