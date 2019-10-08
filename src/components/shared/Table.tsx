import React from 'react'
import classNames from 'classnames'

export interface TColumn {
  label: React.ReactNode
  code: string
  renderCell?: (item: any) => any
  renderSort?: (
    label: React.ReactNode,
    code: string,
    onSort: (code: string, currentDir?: 'asc' | 'desc') => void,
    dir?: 'asc' | 'desc'
  ) => React.ReactNode
  thProps?: React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>
  tdProps?: React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>
}

export interface TSortColumn {
  name: string
  dir?: 'asc' | 'desc'
}

interface Props {
  columns: TColumn[]
  items: TObjectAny[]
  sort?: TSortColumn
  onSort?: (code: string, dir?: 'asc' | 'desc') => void
  renderRow?: (item: any, columns: TColumn[]) => React.ReactNode
  hideHeader?: boolean
  tableProps?: React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>
  theadProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>
  tbodyProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>
  tfootProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>
  trProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>
  thProps?: React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>
  tdProps?: React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>
  classes?: {
    table?: string
    thead?: string
    tbody?: string
    tfoot?: string
    th?: string
    td?: string
    tr?: string
  }
  footer?: React.ReactNode
}

export const Table = ({
  onSort,
  sort,
  columns,
  items,
  footer,
  renderRow,
  hideHeader,
  classes,
  tableProps,
  theadProps,
  tbodyProps,
  tfootProps,
  trProps,
  thProps,
  tdProps,
}: Props) => (
  <table {...tableProps} className={classNames(classes && classes.table)}>
    {!hideHeader && (
      <thead {...theadProps} className={classNames(classes && classes.table)}>
        <tr {...trProps} className={classNames(classes && classes.tr)}>
          {columns.map((column, i) => {
            let dir: 'asc' | 'desc' | undefined
            if (sort && sort.name === column.code) {
              dir = sort.dir
            }
            return (
              <th key={`${i}:${column.label}`} {...thProps} className={classNames(classes && classes.th)}>
                <div>{column.renderSort && onSort ? column.renderSort(column.label, column.code, onSort, dir) : column.label}</div>
              </th>
            )
          })}
        </tr>
      </thead>
    )}
    {footer && (
      <tfoot {...tfootProps} className={classNames(classes && classes.tfoot)}>
        {footer}
      </tfoot>
    )}
    <tbody {...tbodyProps} className={classNames(classes && classes.tbody)}>
      {items.map((item, i) => renderRow ? renderRow(item, columns) : (
        <tr key={item.id || i} {...trProps} className={classNames(classes && classes.tr)}>
          {columns.map((column, i) => (
            <td key={`${i}:${column.label}`} {...tdProps} className={classNames(classes && classes.td)}>
              {column.renderCell && column.renderCell(item)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)
