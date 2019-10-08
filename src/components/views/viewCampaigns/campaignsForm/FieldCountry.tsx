import React from 'react'
import codes from 'src/config/codes.json'
import { toOptions } from 'src/helpers/CommonHelper'
import { FormFieldSelect } from 'src/components/shared/ui/form/formField/Select'
import { TModel as TNumber } from 'src/models/dids/Number'
import { TForm } from '../CampaignsForm'

interface Props {
  availableSourceNumbers: TNumber[]
  values: TForm
  setValues: (values: TForm) => void
  handleField: (name: keyof TForm) => any
}

const filterCountry = (codes: string[]) => (i: TOption) => codes.find(j => j === i.value)

export const CampaignsFormFieldCountry = ({ availableSourceNumbers, values, setValues, handleField }: Props) => {
  const number = availableSourceNumbers.find(i => i.id === values.sourceNumber.id)
  const selectedCountryCode = values.country || (number ? number.countryCode : '')

  const handleProps = handleField('country')
  const { readonly } = handleProps
  const options = React.useMemo(
    () => {
      const countryCodes = availableSourceNumbers.map(i => i.countryCode)
      const options = toOptions(codes, 'code', 'name').filter(filterCountry(countryCodes))
      const hasNumberAny = !!availableSourceNumbers.find(i => i.countryCode === '*')
      if (hasNumberAny) {
        options.unshift({ value: '*', label: 'Any country' })
      }
      return options
    },
    [availableSourceNumbers]
  )

  const onChange = (countryCode: string) => {
    setValues({
      ...values,
      country: countryCode,
      sourceNumber: { id: 0, number: '', anyCountry: countryCode === '*' },
    })
  }

  return (
    <FormFieldSelect
      label={'Country'}
      placeholder={'Select country'}
      options={options}
      reactSelectProps={{ maxMenuHeight: 100, isDisabled: readonly }}
      {...handleProps}
      value={selectedCountryCode}
      onChange={onChange}
      hintTopRight={(
        <a
          href="https://help.clicksend.com/category/mfdctha7f0-country-specific-features-and-restrictions"
          target="_blank"
          className="link blue"
          rel="noopener noreferrer"
        >
          Country Specific Features and Restrictions
        </a>
      )}
    />
  )
}
