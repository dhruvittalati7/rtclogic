import React from 'react'
import { mem } from 'src/utils/mem'
import classNames from 'classnames'
import memoizeOne from 'memoize-one'
import { CloseIcon } from 'src/components/shared/ui/Icons'
import styles from './Tags.module.scss'

type Validate = (value: any) => boolean
type Disable = (value: any) => boolean

interface Tag extends TOption {
  className?: string
  isValid?: boolean
  isDisabled?: boolean
}

interface Props {
  options: Tag[]
  onClickRemove?: (option: TOption) => void
  className?: string
  itemClassName?: string
  itemWidth?: number | string
  showMoreAfter?: number
  showMoreMaxHeight?: number
  validateFunc?: Validate
  disableFunc?: Disable
}

export const Tags = mem((
  { options, onClickRemove, className, itemClassName, itemWidth, showMoreAfter, showMoreMaxHeight, validateFunc, disableFunc }: Props
) => {

  const [showAll, setShowAll] = React.useState(false)
  let allItems = options
  if (validateFunc) {
    allItems = processValidate(options, validateFunc)
  }
  if (disableFunc) {
    allItems = processDisable(options, disableFunc)
  }

  const items = showMoreAfter && !showAll ? allItems.slice(0, showMoreAfter) : allItems
  const moreCount = allItems.length - items.length
  const classes = classNames(styles.root, (moreCount || showAll) && styles.hasMore, showAll && styles.showAll, className)

  return (
    <div className={classes}>
      <div className={styles.list} style={{ maxHeight: showMoreMaxHeight }}>
        {items.map(item => (
          <TagItem key={item.value} item={item} itemClassName={itemClassName} itemWidth={itemWidth} onClickRemove={onClickRemove} />
        ))}
      </div>

      {moreCount > 0 && !showAll && (
        <button onClick={() => setShowAll(true)} className={classNames(styles.btn, styles.more)}>
          Show all {allItems.length}
        </button>
      )}

      {showAll && <div className={styles.total}>Total: {options.length}</div>}
    </div>
  )
})

interface ITag {
  item: Tag
  itemClassName?: string
  itemWidth?: number | string
  onClickRemove?: (option: TOption) => void
}

const TagItem = ({ item, itemClassName, itemWidth, onClickRemove }: ITag) => {
  const className = classNames(styles.item, item.isValid === false && styles.notValid, item.isDisabled && styles.isDisabled, itemClassName)
  const style = React.useMemo(() => ({ width: itemWidth }), [itemWidth])

  return (
    <div key={item.value} className={className} style={style}>
      <div className={styles.label}>{item.label}</div>
      {onClickRemove && !item.isDisabled && <CloseIcon width={7} className={styles.remove} onClick={() => onClickRemove(item)} />}
    </div>
  )
}

const processValidate = memoizeOne(
  (items: Tag[], validateFunc: Validate): Tag[] => {
    return sortByValid(items.map(validateItems(validateFunc)))
  }
)

const processDisable = memoizeOne(
  (items: Tag[], disableFunc: Disable): Tag[] => {
    return sortByDisable(items.map(disableItems(disableFunc)))
  }
)

const validateItems = (validate: Validate) => (item: Tag): Tag => ({ ...item, isValid: validate(item.value) })
const disableItems = (disable: Disable) => (item: Tag): Tag => ({ ...item, isDisabled: disable(item.value) })

const sortByValid = (items: Tag[]): Tag[] => {
  return [...items].sort((a, b) => {
    const validA = a.isValid ? 1 : -1
    const validB = b.isValid ? 1 : -1
    return validA - validB
  })
}

const sortByDisable = (items: Tag[]): Tag[] => {
  return [...items].sort((a, b) => {
    const validA = a.isDisabled ? -1 : 1
    const validB = b.isDisabled ? -1 : 1
    return validA - validB
  })
}
