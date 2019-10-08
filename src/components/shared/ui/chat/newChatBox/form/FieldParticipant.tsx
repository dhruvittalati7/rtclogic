import React, { useState } from 'react'
import { connect, Omit } from 'react-redux'
import { IState } from 'src/store'
import classNames from 'classnames'
import { accountsToOptions } from 'src/helpers/CommonHelper'
import { BaseFormInputProps } from 'src/hooks/useForm'
import { Dropdown } from 'src/components/shared/ui/Dropdown'
import { FormField } from 'src/components/shared/ui/form/FormField'
import { TAccount } from 'src/models/Account'
import { accountSearchService } from 'src/services/AccountSearchService'
import styles from './FieldParticipant.module.scss'
import { ClickOutside } from 'src/components/shared/ClickOutside'

interface Props extends BaseFormInputProps<TAccount[]> {
  currentAccountId: number | null
  value: TAccount[]
  placeholder?: string
  className?: string
  onChange: (value: TAccount[]) => void
  onBlur: () => void
  inputProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
}

const FormFieldRoleParticipant = (props: Props) => {
  const [inputRef, setInputRef] = React.useState<null | HTMLInputElement>(null)
  const [blurCount, setBlurCount] = React.useState(0)
  const [userInput, setUserInput] = React.useState('')
  const { value, onChange, currentAccountId } = props
  const [searching, setSearching] = useState<boolean>(false)
  const [searchAccounts, setSearchAccounts] = useState<TAccount[]>([])

  const search = (query: string) => {
    setSearching(true)
    const p = accountSearchService.performSearch(query, async (items: TAccount[] | undefined) => {
      setSearchAccounts(items || [])
      setSearching(false)
    })
    p && p.catch(window.logger.error)
  }

  const clear = () => {
    setUserInput('')
    search('')
  }

  const onChangeUserInput = (e: any) => {
    const val = e.target.value
    setUserInput(val)
    search(val)
  }

  const onBlur = () => {
    setBlurCount(blurCount + 1)
    props.onBlur()
  }

  const onSelectAccount = (id: number) => {
    const account = searchAccounts.find(i => i.id === id)
    if (account) {
      search('')
      setUserInput('')
      onChange([...value, account])
      if (inputRef) {
        inputRef.focus()
      }
    }
  }

  const getHint = (): string => {
    if (!userInput) {
      return ''
    }
    if (searching) {
      return 'Searching...'
    }
    if (searchAccounts.length) {
      return 'Select an account'
    }
    return 'Nothing is found'
  }

  const filteredAccounts = searchAccounts.filter(filterSearchAccounts(currentAccountId, value))

  return (
    <FormField
      label={props.label}
      error={blurCount === 0 && userInput ? '' : props.error}
      hintTopRight={getHint()}
      hintBottomRight={props.hintBottomRight}
    >
      <input
        ref={setInputRef}
        {...props.inputProps}
        className={classNames(styles.root, styles.dark, props.className)}
        autoComplete={'off'}
        type={'text'}
        name={props.name}
        value={userInput}
        placeholder={'Enter name'}
        onBlur={onBlur}
        onKeyPress={(e: any) => e.charCode === 13 && e.preventDefault()}
        onChange={onChangeUserInput}
      />

      <ClickOutside onClick={clear}>
        <Dropdown open={filteredAccounts.length > 0} options={accountsToOptions(filteredAccounts)} onSelect={onSelectAccount} />
      </ClickOutside>
    </FormField>
  )
}

const filterSearchAccounts = (currentAccountId: number | null, selectedAccounts: TAccount[]) => (account: TAccount) =>
  !selectedAccounts.find(i => i.id === account.id) && account.id !== currentAccountId

const mapStateToProps = (state: IState, ownProps: Omit<Props, 'currentAccountId'>): Props => ({
  ...ownProps,
  currentAccountId: state.app.current.accountId,
})

const FormFieldParticipantConnected = connect(mapStateToProps)(FormFieldRoleParticipant)

export { FormFieldParticipantConnected as FormFieldParticipant }
