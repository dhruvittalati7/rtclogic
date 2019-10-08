import React from 'react'
import { TAdminModel as TAdminNumber } from 'src/models/admin/Number'
import { TableSelect } from 'src/components/shared/ui/TableSelect'
import { adminNumberService } from 'src/services/admin/NumberService'
import styles from './Status.module.scss'

interface Props {
  item: TAdminNumber
}

export const TableStatus = ({ item }: Props) => {
  const options: TOption[] = [
    { value: item.status, label: item.status },
  ]

  if (item.status === 'active') {
    options.push({ value: 'available', label: 'available' })
  }

  if (item.status === 'assigned') {
    options.push({ value: 'released', label: 'release' })
  }

  if (item.status === 'released') {
    options.push({ value: 'assigned', label: 'assigned' })
  }

  const handleSelect = (option: TOption) => {
    adminNumberService.setStatus(item.id, option.value).catch(window.logger.error)
  }

  return (
    <TableSelect
      className={styles.select}
      options={options}
      value={item.status}
      onSelect={handleSelect}
    />
  )
}
