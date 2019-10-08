import React from 'react'
import codes from 'src/config/codes.json'
import { FormFieldText } from './Text'
import { FormFieldSelect } from 'src/components/shared/ui/form/formField/Select'
import { FormField } from 'src/components/shared/ui/form/FormField'
import { BaseFormInputProps } from 'src/hooks/useForm'
import { PhoneCodeLabel } from './phone/CodeLabel'
import { clearPhoneNumberValue } from 'src/helpers/PhoneHelper'
import styles from './Phone.module.scss'

const options: TOption[] = codes.map(i => ({
  value: `+${i.callingCode}`,
  label: <PhoneCodeLabel countryData={i} />,
  search: `+${i.callingCode} ${i.code.toLowerCase()}`,
}))

interface Props extends Omit<BaseFormInputProps, 'value'> {
  label: string
  name: string
  placeholder: string
  initialValue?: string
  defaultCode?: string
  valueCode?: string
  valueNumber?: string
  value?: string
  onChange: (value: string) => void
  onChangeCode?: (value: string) => void
  onChangeNumber?: (value: string) => void
  onEnter?: () => void
  onBlur: () => void
  inputProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
}

export const FormFieldPhone = (props: Props) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [initialPartCode, initialPartNumber] = getPhoneParts(props.initialValue || '')
  const [partCode, setPartCode] = React.useState(initialPartCode || props.defaultCode || '')
  const [partNumber, setPartNumber] = React.useState(initialPartNumber)

  React.useEffect(() => { props.valueCode !== undefined && setPartCode(props.valueCode) }, [props.valueCode])
  React.useEffect(() => { props.valueNumber !== undefined && setPartNumber(props.valueNumber) }, [props.valueNumber])

  const onChangeCode = (code: string) => {
    setPartCode(code)
    props.onChange(`${code}${partNumber}`.trim())
    props.onChangeCode && props.onChangeCode(code)
    const el: HTMLInputElement | null = ref.current && ref.current.querySelector(`input[name="${props.name}"]`)
    el && el.focus()
  }

  const onChangeNumber = (number: string) => {
    const filteredNumber = number.replace(/\D/g, '')
    setPartNumber(filteredNumber)
    props.onChange(`${partCode}${filteredNumber}`.trim())
    props.onChangeNumber && props.onChangeNumber(filteredNumber)
  }

  return (
    <div ref={ref} className={styles.root}>
      <FormField
        label={props.label}
        error={props.error}
        hideBottom={props.hideBottom}
        hintTopRight={props.hintTopRight}
        hintBottomLeft={props.hintBottomLeft}
        hintBottomRight={props.hintBottomRight}
        // hintBottomLeft={'Use the E.164 international format +13124563333'}
      >
        <div className={styles.inner}>
          <div className={styles.code}>
            <FormFieldSelect
              disableWrapper
              options={options}
              name={'code'}
              placeholder={'Country'}
              value={partCode}
              onChange={onChangeCode}
              reactSelectProps={reactSelectProps}
            />
          </div>
          <div className={styles.phone}>
            <FormFieldText
              disableWrapper
              type={'text'}
              placeholder={props.placeholder}
              name={props.name}
              value={partNumber}
              inputProps={props.inputProps}
              onChange={onChangeNumber}
              onBlur={props.onBlur}
              onFocus={props.onFocus}
              onEnter={props.onEnter}
            />
          </div>
        </div>
      </FormField>
    </div>
  )
}

const getPhoneParts = (phone: string): [string, string] => {
  const clearPhone = clearPhoneNumberValue(phone)

  if (clearPhone.length >= 12) {
    if (clearPhone.indexOf('+1') === 0) {
      const partCode = '+1'
      const partNumber = clearPhone.replace(partCode, '')
      return [partCode, partNumber]
    }

    const partNumber = clearPhone.substr(-10)
    const partCode = clearPhone.replace(partNumber, '')
    return [partCode, partNumber]
  }

  return ['', '']
}

const reactSelectProps = {
  filterOption: (i: any, s: string) => i.data.search.includes(s.toLowerCase()),
}

// @ts-ignore
window.getPhoneParts = getPhoneParts
