import React from 'react'
import classNames from 'classnames'
import ReactSelect from 'react-select'
import { ActionMeta, ValueType } from 'react-select/lib/types'
import { Props as SProps } from 'react-select/lib/Select'
import { DropdownIndicator, IndicatorProps } from 'react-select/lib/components/indicators'
import { DropDownIcon } from 'src/components/shared/ui/Icons'
import './Select.scss'

export type ReactSelectProps = SProps

interface Props {
  placeholder?: string
  value?: any
  options: TOption[]
  onSelect: (value: any) => void
  reactSelectProps?: Partial<ReactSelectProps>
  className?: string
}

export const Select = ({ placeholder, value, options, onSelect, reactSelectProps, className }: Props) => {
  const selectedValue = value ? options.find(i => i.value === value) : null

  const onClickOption = (option: ValueType<TOption>, action: ActionMeta) => {
    if (option && !Array.isArray(option) && action.action === 'select-option') {
      const value = (option as TOption).value
      onSelect(value)
    }
  }

  return (
    <ReactSelect<TOption>
      value={selectedValue}
      options={options}
      onChange={onClickOption}
      className={classNames('TiradeSelectRoot', className)}
      classNamePrefix={'TiradeSelect'}
      components={{
        DropdownIndicator: CustomDropdownIndicator,
      }}
      placeholder={placeholder}
      noOptionsMessage={() => 'No options found'}
      {...reactSelectProps}
    />
  )
}

const CustomDropdownIndicator = (props: IndicatorProps<TOption>) => (
  <DropdownIndicator {...props}>
    <DropDownIcon width={7} height={7} />
  </DropdownIndicator>
)
