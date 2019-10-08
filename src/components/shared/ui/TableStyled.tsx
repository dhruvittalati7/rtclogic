import React from 'react'
import styles from './TableStyled.module.scss'
import { Table, TColumn, TSortColumn } from 'src/components/shared/Table'

interface Props {
  columns: TColumn[]
  items: TObjectAny[]
  sort?: TSortColumn
  footer?: React.ReactNode
  onSort?: (name: string, dir?: 'asc' | 'desc') => void
  renderRow?: (item: any, column: TColumn[]) => React.ReactNode
}

export const TableStyled = (props: Props) => (
  <Table
    classes={{
      table: styles.table,
      th: styles.th,
      td: styles.td,
      tbody: styles.tbody,
    }}
    {...props}
  />
)
