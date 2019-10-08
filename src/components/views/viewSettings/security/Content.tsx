import React from 'react'
import * as yup from 'yup'
import { connect } from 'react-redux'
import { IState } from 'src/store'
import { mem } from 'src/utils/mem'
import { ViewSettingsBox } from '../Box'
import { getYupErrorsMap } from 'src/helpers/CommonHelper'
import { accountService } from 'src/services/AccountService'
import { currentAccountSelector } from 'src/services/selectors/AccountSelectors'
import { IAccountProfile, TAccount } from 'src/models/Account'
import { useForm } from 'src/hooks/useForm'
import { FormFrame } from 'src/components/shared/ui/form/FormFrame'
import { FormFieldSubmit } from 'src/components/shared/ui/form/formField/Submit'
import { ViewSettingsSecurityItem } from 'src/components/views/viewSettings/security/Item'
import { Toggle } from 'src/components/shared/ui/Toggle'
import { FormFieldPassword } from 'src/components/shared/ui/form/formField/Password'
import styles from './Content.module.scss'

interface Props {
  account: TAccount
}

const formInitialValues = {
  password: '',
  oldPassword: '',
  is2fa: false,
}
type TForm = typeof formInitialValues

const validate = (values: TForm) => {
  const errors = {
    ...getYupErrorsMap(
      values,
      yup.object().shape({
        password: yup.string(),
        oldPassword: yup.string().required('Current password is required'),
      })
    ),
  }

  if (values.password.length > 0 && values.oldPassword.length === 0) {
    errors['oldPassword'] = 'Should not be empty'
  }

  return errors
}

const ViewSettingsSecurityContent = mem(({ account }: Props) => {
  if (!account.id) {
    return null
  }

  if (account.profile.mobile && account.profile.is2fa) {
    formInitialValues.is2fa = account.profile.is2fa
  }

  const { handleForm, handleField, canSubmit, setError, isSubmitting } = useForm(formInitialValues, validate, submit, false)

  async function submit(values: TForm) {
    const payload: IAccountProfile = {
      ...account.profile,
      ...values,
    }
    const result = await accountService.update(account.id, payload)
    if (!result) {
      setError('oldPassword', 'Password mismatch')
    }
  }

  return (
    <div className={styles.root}>
      <ViewSettingsBox>
        <FormFrame {...handleForm()}>
          <FormFieldPassword label={'Current Password'} placeholder={'Enter current password'} {...handleField('oldPassword')} />
          <FormFieldPassword label={'New Password'} placeholder={'Enter new password'} {...handleField('password')} />

          {/*https://app.clickup.com/t/v7g0t*/}
          <div style={{ display: 'none' }}>
            <ViewSettingsSecurityItem
              title={'Two factor authentication'}
              subtitle={'Add an extra layer of security by verifying a text each time you log in'}
              toggle={<Toggle checked={handleField('is2fa').value} name={'is2fa'} onChange={e => handleField('is2fa').onChange(e.target.checked)} />}
            />
          </div>

          <FormFieldSubmit disabled={!canSubmit || isSubmitting} className={styles.button}>
            {!isSubmitting ? 'Save' : 'Saving'}
          </FormFieldSubmit>
        </FormFrame>
      </ViewSettingsBox>
    </div>
  )
})

const mapStateToProps = (state: IState): Props => ({
  account: currentAccountSelector(state.app),
})

const ViewSettingsSecurityContentConnected = connect(mapStateToProps)(ViewSettingsSecurityContent)
export { ViewSettingsSecurityContentConnected as ViewSettingsSecurityContent }
