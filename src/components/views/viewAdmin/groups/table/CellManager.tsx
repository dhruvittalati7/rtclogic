import React from 'react'
import { TAdminModel as TAdminRole } from 'src/models/admin/Role'
import { Avatar } from 'src/components/shared/ui/Avatar'
import styles from './CellManager.module.scss'

interface Props {
  item: TAdminRole
}

export const TableCellManager = ({ item }: Props) => (
  <div className={styles.root}>
    <div className={styles.avatar}>
      {item.manager && (
        <>
          <Avatar account={item.manager} type={'list'} />
          {item.manager.profile.displayName}
        </>
      )}
    </div>
  </div>
)
