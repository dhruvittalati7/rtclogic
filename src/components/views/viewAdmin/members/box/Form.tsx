import React from 'react'
import { IState } from 'src/store'
import { connect } from 'react-redux'
import * as yup from 'yup'
import { FormFrame } from 'src/components/shared/ui/form/FormFrame'
import { FormTitle } from 'src/components/shared/ui/form/FormTitle'
import { useForm } from 'src/hooks/useForm'
import { TAccount, TStatus } from 'src/models/Account'
import { accountService } from 'src/services/AccountService'
import { deepClone, getYupErrorsMap } from 'src/helpers/CommonHelper'
import { FormFieldText } from 'src/components/shared/ui/form/formField/Text'
import { FormFieldSubmit } from 'src/components/shared/ui/form/formField/Submit'
import { FormFieldPassword } from 'src/components/shared/ui/form/formField/Password'
import { accessSelector } from 'src/services/selectors/AccountSelectors'
import { adminMemberService } from 'src/services/admin/MemberService'
import styles from './Form.module.scss'

interface Props {
  onSuccess: () => void
  account: TAccount
  currentAccountPermissions: TPermission[]
}

const formInitialValues = {
  login: '',
  email: '',
  displayName: '',
  password: '',
  status: 'pending' as TStatus,
}

export type TForm = typeof formInitialValues

const createInitialValues = (account: TAccount): TForm => {
  const result: TForm = deepClone({ ...formInitialValues, ...account.profile })
  result.login = account.login
  return result
}

const NewMemberBoxForm = ({ onSuccess, account }: Props) => {
  const validate = (values: TForm) => {
    const createRules = {
      login: yup.string().required('Login is required'),
      displayName: yup.string().required('Name is required'),
      password: yup.string().required('Password is required'),
    }

    const updateRules = {
      displayName: yup.string().required('Name is required'),
      password: yup.string(),
    }

    const fields = account.id ? updateRules : createRules
    return getYupErrorsMap(values, yup.object().shape(fields)) || {}
  }

  const isValid = (values: TForm) => {
    const err = validate(values)
    return !err || !Object.keys(err).length
  }

  async function submit(values: TForm) {
    const result = account.id
      ? await accountService.update(account.id, { ...account.profile, ...values })
      : await accountService.create(values.login, values.displayName, values.password)

    if (result) {
      adminMemberService.loadMembers().then(() => {
        onSuccess()
      })
    }
  }

  const initialValues = createInitialValues(account)
  const { handleForm, handleField, canSubmit } = useForm(initialValues, validate, submit, isValid(initialValues))

  return (
    <div className={styles.root}>
      <FormFrame {...handleForm()}>
        <FormTitle>{account.id ? 'Edit' : 'Add'} User</FormTitle>

        {!account.id && (
          <FormFieldText
            label={'Login'}
            placeholder={'login'}
            inputProps={{ autoFocus: true }}
            {...handleField('login')}
          />
        )}

        <FormFieldText
          label={'Display Name'}
          placeholder={'Display name'}
          inputProps={{ autoComplete: 'new-password' }}
          {...handleField('displayName')}
        />

        <FormFieldPassword label={'Password'} placeholder={'Password'} {...handleField('password')} />

        <FormFieldSubmit disabled={!canSubmit}>
          Submit
        </FormFieldSubmit>
      </FormFrame>
    </div>
  )
}

const mapStateToProps = (state: IState, ownProps: Pick<Props, 'onSuccess' | 'account'>): Props => {
  return {
    ...ownProps,
    currentAccountPermissions: accessSelector(state.app),
  }
}

const NewMemberBoxFormConnected = connect(mapStateToProps)(NewMemberBoxForm)
export { NewMemberBoxFormConnected as NewMemberBoxForm }
