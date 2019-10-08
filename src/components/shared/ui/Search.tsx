import React from 'react'
import { mem } from 'src/utils/mem'
import classNames from 'classnames'
import { DeleteIcon, MagnifierIcon } from 'src/components/shared/ui/Icons'
import styles from './Search.module.scss'

interface Props {
  searchQuery: string
  setSearchQuery: (query: string) => void
  setSearchInFocus: (focus: boolean) => void
}

export const Search = mem(({ searchQuery, setSearchQuery, setSearchInFocus }: Props) => {
  const [inputRef, setInputRef] = React.useState<HTMLInputElement | null>(null)

  const onDelete = () => {
    setSearchQuery('')
    inputRef && inputRef.focus()
  }

  const focusInput = () => {
    inputRef && inputRef.focus()
  }

  return (
    <div className={classNames(styles.root, styles.dark)}>
      <div className={styles.searchBlock}>
        <div className={styles.inputBlock}>
          <input
            ref={setInputRef}
            className={styles.input}
            type={'text'}
            placeholder={'Search...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchInFocus(true)}
            onBlur={() => setSearchInFocus(false)}
          />
          {searchQuery ? (
            <button className={styles.icon}>
              <DeleteIcon width={19} height={14} className={styles.delete} onClick={onDelete} />
            </button>
          ) : (
            <button className={styles.icon} onClick={focusInput}>
              <MagnifierIcon width={20} height={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
})
