import React from 'react'
import { FormFieldSelect } from 'src/components/shared/ui/form/formField/Select'
import { NumberLabel } from 'src/components/shared/ui/NumberLabel'
import { TModel as TNumber } from 'src/models/dids/Number'
import { TForm } from '../CampaignsForm'

interface Props {
  values: TForm
  countryCode: string
  availableSourceNumbers: TNumber[]
  setValues: (values: TForm) => void
  handleField: (name: keyof TForm) => any
}

export const CampaignsFormSourceNumbers = ({ values, setValues, countryCode, availableSourceNumbers, handleField }: Props) => {
  const filteredSourceNumbers = availableSourceNumbers.filter(i => !countryCode || i.countryCode === countryCode || i.countryCode === '*')
  if (!filteredSourceNumbers) {
    return null
  }

  const handleProps = handleField('sourceNumber')
  const { readonly } = handleProps

  const onChange = (id: number) => {
    const numberItem = filteredSourceNumbers.find(i => i.id === id)
    const number = numberItem ? numberItem.number : ''
    setValues({
      ...values,
      country: numberItem ? numberItem.countryCode : countryCode,
      sourceNumber: { id, number, anyCountry: numberItem ? numberItem.countryCode === '*' : false },
    })
  }

  const options = filteredSourceNumbers.map(i => ({ value: i.id, label: <NumberLabel showWay number={i} /> }))

  return (
    <FormFieldSelect
      label={'Source number'}
      placeholder={'Select number'}
      options={options}
      reactSelectProps={{ maxMenuHeight: 100, isDisabled: readonly }}
      {...handleProps}
      onChange={onChange}
      value={values.sourceNumber.id}
    />
  )
}
