import React from 'react'
import classNames from 'classnames'
import { DropDownIcon } from 'src/components/shared/ui/Icons'
import { ClickOutside } from 'src/components/shared/ClickOutside'
import styles from './TableSelect.module.scss'

interface Props {
  value?: any
  placeholder?: string
  className?: string
  options: TOption[]
  onSelect: (option: TOption) => void
}

export const TableSelect = ({ value, className, placeholder, options, onSelect }: Props) => {
  const [open, setOpen] = React.useState(false)
  const selectedOption = options.find(i => i.value === value)
  const otherOptions = options.filter(i => i.value !== value)
  const hasOptions = otherOptions.length > 0
  const handleSelect = (option: TOption) => {
    onSelect(option)
    setOpen(false)
  }

  return (
    <ClickOutside onClick={() => setOpen(false)}>
      <div className={classNames(styles.root, className)}>
        <div className={classNames(styles.field, hasOptions && styles.clickable)} onClick={() => setOpen(!open)}>
          {selectedOption
            ? <span>{selectedOption.label}</span>
            : <span className={styles.placeholder}>{placeholder}</span>
          }
          <DropDownIcon className={classNames(styles.icon, open && styles.open)} width={7} height={7} />
        </div>

        {hasOptions && open && (
          <div className={styles.dropdown}>
            {otherOptions.map(option => (
              <div key={option.value} className={styles.item} onClick={() => handleSelect(option)}>
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </ClickOutside>
  )
}
