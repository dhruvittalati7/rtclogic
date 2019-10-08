import React, { useEffect, useState } from 'react'
import styles from './Pagination.module.scss'
import classNames from 'classnames'
import { debounce } from 'src/helpers/CommonHelper'

interface Props {
  total: number
  page: number
  size: number
  onChange: (page: number, size: SizeOption) => void
}

const performSetCustomPage = debounce((page: number, count: number, rowsPerPage: number, callback: (page: number) => void) => {
  if (page <= Math.ceil(count / rowsPerPage) && page > 0) {
    callback(page)
  }

  return
}, 500)

export const Pagination = React.memo(({ total, page, size, onChange }: Props) => {
  const onChangePage = React.useCallback(
    (page: number) => {
      onChange(page, size as SizeOption)
    },
    [onChange, size]
  )

  return <Paginator page={page} count={total} rowsPerPage={size as SizeOption} onChangePage={onChangePage} />
})

interface PaginatorProps {
  page: number
  rowsPerPage: SizeOption
  count: number
  onChangePage: (page: number) => void
}

export const Paginator = React.memo(({ page, rowsPerPage, count, onChangePage }: PaginatorProps) => {
  const [customPage, setCustomPage] = useState<number>(page)
  useEffect(() => {
    if (customPage !== page) {
      setCustomPage(page)
    }
  }, [page, customPage])

  const handleBack = () => {
    if (page > 1) {
      return onChangePage(page - 1)
    }
    return
  }
  const handleNext = () => {
    if (page <= Math.ceil(count / rowsPerPage) - 1) {
      return onChangePage(page + 1)
    }
    return
  }

  const handleCustom = (page: string) => {
    setCustomPage(parseInt(page))
    performSetCustomPage(parseInt(page) || 0, count, rowsPerPage, (page: number) => {
      onChangePage(page)
    })
  }

  return (
    <div className={styles.paginator}>
      PAGE <input type={'text'} placeholder={String(customPage)} onChange={e => handleCustom(e.target.value)} /> of {Math.ceil(count / rowsPerPage)}
      <div className={classNames({ [styles.disabled]: page === 1 })} onClick={() => handleBack()}>
        {'<'}
      </div>
      <div className={classNames({ [styles.disabled]: page === Math.ceil(count / rowsPerPage) })} onClick={() => handleNext()}>{'>'}</div>
    </div>
  )
})
