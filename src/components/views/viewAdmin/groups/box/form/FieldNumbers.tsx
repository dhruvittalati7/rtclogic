// @ts-ignore
import React from 'react'
import { connect } from 'react-redux'
import { IState } from 'src/store'
import classNames from 'classnames'
import { toOptions } from 'src/helpers/CommonHelper'
import { BaseFormInputProps } from 'src/hooks/useForm'
import { Dropdown } from 'src/components/shared/ui/Dropdown'
import { FormField } from 'src/components/shared/ui/form/FormField'
import { TAdminModel as TAdminNumber } from 'src/models/admin/Number'
import styles from './FieldNumbers.module.scss'
import { Tags } from 'src/components/shared/ui/Tags'
import { ClickOutside } from 'src/components/shared/ClickOutside'

interface Props extends BaseFormInputProps<TAdminNumber[]> {
  isMulti?: boolean
  onRemove: (id: number) => void
  onChange: (value: TAdminNumber[]) => void
  search: (query: string) => void
  selected: TOption[]
  searchNumbers: TAdminNumber[]
  searchLoading: boolean
  value: TAdminNumber[]
  placeholder?: string
  className?: string
  inputProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
}

const isNumber = (value: string) => {
  if (value) {
    const pattern = /^\d+$/
    return pattern.test(value)
  }
  return true
}

const filterAlreadyAdded = (items: TOption[], selected: TOption[]) => {
  return items.filter(i => selected.findIndex(j => j.value === i.value) === -1)
}

const FormFieldNumbers = (props: Props) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [userInput, setUserInput] = React.useState('')
  const { onRemove, selected, value, onChange, searchNumbers, isMulti = true } = props

  const search = (query: string) => {
    props.search(query)
  }

  const onChangeUserInput = (e: any) => {
    const val = e.target.value
    if ((!isMulti && value.length > 0) || !isNumber(val)) {
      return
    }
    setUserInput(val)
    search(val)
  }

  const clear = () => {
    setUserInput('')
    search('')
  }

  const onSelect = (id: number) => {
    const item = searchNumbers.find(i => i.id === id)
    if (item) {
      search('')
      setUserInput('')
      onChange([...value, item])
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const getHint = (): string => {
    if (!userInput) {
      return ''
    }
    if (props.searchLoading) {
      return 'Searching...'
    }
    if (searchNumbers.length) {
      return 'Select an account'
    }
    return 'Nothing is found'
  }

  return (
    <>
      <FormField
        hideBottom
        label={props.label}
        error={props.error}
        hintTopRight={getHint()}
        hintBottomRight={props.hintBottomRight}
      >
        <input
          ref={inputRef}
          {...props.inputProps}
          className={classNames(styles.root, styles.dark, props.className)}
          autoComplete={'off'}
          type={'text'}
          name={props.name}
          value={userInput}
          placeholder={'Enter number'}
          onChange={onChangeUserInput}
          onKeyPress={e => e.charCode === 13 && e.preventDefault()}
        />

        <ClickOutside onClick={clear}>
          <Dropdown
            open={searchNumbers.length > 0}
            options={filterAlreadyAdded(toOptions(searchNumbers, 'id', 'number'), selected)}
            onSelect={onSelect}
          />
        </ClickOutside>
      </FormField>
      {selected.length > 0 && <Tags options={selected} onClickRemove={({ value }) => onRemove(value)} />}
    </>
  )
}

const mapStateToProps = (state: IState, ownProps: Props): Props => ({
  ...ownProps,
})

const FormFieldNumbersConnected = connect(mapStateToProps)(FormFieldNumbers)
export { FormFieldNumbersConnected as FormFieldNumbers }
