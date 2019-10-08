// @ts-ignore
import React from 'react'
import { FormFieldSelect } from 'src/components/shared/ui/form/formField/Select'
import { accountsToOptions } from 'src/helpers/CommonHelper'
import { Tags } from 'src/components/shared/ui/Tags'
import { TAccount } from 'src/models/Account'

interface Props {
  name: string
  label: string
  isMulti?: boolean
  readonly?: boolean
  placeholder?: string
  available: TAccount[]
  selected: TAccount[]
  onChange: (accountId: number) => void
  onRemove?: (accountId: number) => void
  validateFunc?: (accountId: number) => boolean
  disableFunc?: (accountId: number) => boolean
}

export const FormFieldMember = (props: Props) => {
  const { isMulti, available, selected, onChange, onRemove, readonly } = props
  const availableOptions = accountsToOptions(available)
  const selectedOptions = accountsToOptions(selected)
  const value = !isMulti && !!selectedOptions.length && selectedOptions[0].value

  return (
    <>
      <FormFieldSelect
        hideBottom
        readonly={readonly}
        name={props.name}
        label={props.label}
        placeholder={props.placeholder}
        reactSelectProps={{ maxMenuHeight: 100, isDisabled: readonly }}
        options={availableOptions}
        value={value}
        onChange={onChange}
        onBlur={() => {}}
      />

      {isMulti && selected.length > 0 && (
        <Tags
          options={selectedOptions}
          onClickRemove={({ value }) => onRemove && onRemove(value)}
          validateFunc={props.validateFunc}
          disableFunc={props.disableFunc}
        />
      )}
    </>
  )
}
