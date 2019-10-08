import React from 'react'
import classNames from 'classnames'
import { FormLabel } from 'src/components/shared/ui/form/FormLabel'
import { Dropzone } from 'src/components/shared/ui/Dropzone'
import { TForm } from '../CampaignsForm'
import { Tags } from 'src/components/shared/ui/Tags'
import { parseCsvNumbers, readFileContent } from 'src/helpers/CommonHelper'
import { isPhoneNumber, getCallingCode, formatPhoneNumber } from 'src/helpers/PhoneHelper'
import styles from './TargetNumbers.module.scss'
import { useBreakpoints } from 'src/hooks/useBreakpoints'
import { FormFieldPhone } from 'src/components/shared/ui/form/formField/Phone'

interface Props {
  values: TForm
  setValue: (name: keyof TForm, value: any) => void
  handleField: (name: keyof TForm) => any
}

export const CampaignsFormTargetNumbers = React.memo(({ values, setValue, handleField }: Props) => {
  const [key, setKey] = React.useState(1)
  const [userInput, setUserInput] = React.useState('')
  const [lastCode, setLastCode] = React.useState('+1')
  const [error, setError] = React.useState('')
  const itemWidth = useBreakpoints(itemWidthBreakpoints)
  const handleProps = handleField('targetNumber')
  const { readonly } = handleProps
  const callingCode = values.country === 'US' ? getCallingCode(values.country) : undefined
  const label = 'Target numbers'

  const addNumbers = (number: string[]) => {
    setValue('targetNumbers', Array.from(new Set([...values.targetNumbers, ...number])))
  }

  const removeNumber = ({ value }: TOption) => {
    setValue('targetNumbers', values.targetNumbers.filter(i => i !== value))
  }

  const onEnter = () => {
    if (isPhoneNumber(userInput, callingCode)) {
      addNumbers([userInput])
      setUserInput('')
      setError('')
      setKey(key + 1)
    } else {
      setError('Target number is wrong')
    }
  }

  const onUpload = async (files: File[]) => {
    const contents = await Promise.all(files.map(readFileContent))
    const results = contents.map(parseCsvNumbers)
    const numbers = results.reduce((a, i) => [...a, ...i], [])
    addNumbers(numbers)
  }

  const validatePhoneNumber = React.useCallback((number: string) => isPhoneNumber(number, callingCode), [callingCode])
  const tagsOptions = values.targetNumbers.map(i => ({ value: i, label: formatPhoneNumber(i) }))

  return (
    <div className={classNames(styles.root, styles.dark)}>
      {!readonly && (
        <>
          <FormFieldPhone
            key={key}
            label={label}
            readonly={readonly}
            defaultCode={lastCode}
            placeholder={'Enter number and hit RETURN'}
            inputProps={{ autoFocus: !!values.targetNumbers.length }}
            {...handleProps}
            error={error}
            onChange={setUserInput}
            onChangeCode={setLastCode}
            onEnter={onEnter}
          />

          <Dropzone
            multiple
            accept={'.csv'}
            message={'Or upload .csv file with a list of phone numbers'}
            onUpload={onUpload}
            className={styles.dropzone}
          />
        </>
      )}

      {readonly && <FormLabel>{label}</FormLabel>}

      <Tags
        options={tagsOptions}
        onClickRemove={readonly ? undefined : removeNumber}
        itemWidth={itemWidth}
        validateFunc={validatePhoneNumber}
        showMoreAfter={9}
        showMoreMaxHeight={100}
      />
    </div>
  )
})

const itemWidthBreakpoints = {
  default: 'calc((100% - 15px) / 7)',
  1400: 'calc((100% - 15px) / 6)',
  1280: 'calc((100% - 15px) / 3)',
  960: 'calc((100% - 15px) / 2)',
}
