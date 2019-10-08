import React from 'react'
import classNames from 'classnames'
import { SideCard } from 'src/components/shared/ui/side/Card'
import { SideCardStatus } from 'src/components/shared/ui/side/CardStatus'
import { TModel as TCampaign, TCampaignStatus } from 'src/models/Campaign'
import { InfoButtonSettings } from './info/ButtonSettings'
import styles from './Item.module.scss'

interface Props {
  item: TCampaign
  onSelect: (item: TCampaign) => void
  onEdit: (item: TCampaign) => void
  highlight: boolean
}

export const CampaignsListItemsItem = React.memo(({ item, highlight, onSelect, onEdit }: Props) => {
  const onSelectItem = React.useCallback(() => onSelect(item), [onSelect, item])

  const onClickSelect = () => {
    ['draft', 'scheduled'].includes(item.status)
      ? onEdit(item)
      : onSelectItem()
  }

  return (
    <SideCard
      className={classNames(styles.root, styles.dark)}
      isActive={highlight}
      title={item.name || `Draft campaign ${item.createdAt && item.createdAt.format('MM/DD/YYYY HH:ss')}`}
      content={item.message}
      titleRight={<InfoButtonSettings onClick={() => onEdit(item)}/>}
      bottomLeft={item.sourceNumber.number}
      bottomRight={
        <SideCardStatus isActive={highlight} colorType={statusColor(item.status)} onClick={onClickSelect}>
          {item.status}
        </SideCardStatus>
      }
      onTitleClick={onClickSelect}
      onClick={onClickSelect}
    />
  )
})

const statusColor = (status: TCampaignStatus) => {
  switch (status) {
    case 'scheduled':
      return 'orange'
    case 'launched':
      return 'blue'
    case 'finished':
      return 'green'
    case 'failed':
      return 'red'
    case 'draft':
    default:
      return 'default'
  }
}
