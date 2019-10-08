import React from 'react'
import { ListPlaceholder } from 'src/components/shared/ui/placeholders/ListPlaceholder'
import { TModel as TCampaign } from 'src/models/Campaign'
import { CampaignsListItemsItem } from './items/Item'
import styles from './Items.module.scss'

interface Props {
  campaigns: TCampaign[]
  highlightCampaignId: number | null
  isLoading: boolean
  onSelect: (campaign: TCampaign) => void
  onEdit: (campaign: TCampaign) => void
}

export const CampaignsListItems = ({ campaigns, highlightCampaignId, isLoading, onSelect, onEdit }: Props) => (
  <div className={styles.root}>
    <div className={styles.scrollable}>
      {isLoading ? (
        <ListPlaceholder num={3} />
      ) : (
        campaigns.length > 0
          ? (
            campaigns.map(campaign => (
              <CampaignsListItemsItem
                key={campaign.id}
                item={campaign}
                highlight={highlightCampaignId === campaign.id}
                onSelect={onSelect}
                onEdit={onEdit}
              />
            ))
          )
          : (<div className={styles.empty}>List is empty</div>)
      )}
    </div>
  </div>
)
