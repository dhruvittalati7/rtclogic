import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import classNames from 'classnames'
import { FormFieldText } from 'src/components/shared/ui/form/formField/Text'
import { FormFieldSubmit } from 'src/components/shared/ui/form/formField/Submit'
import { FormFrame } from 'src/components/shared/ui/form/FormFrame'
import { useForm } from 'src/hooks/useForm'
import { getYupErrorsMap } from 'src/helpers/CommonHelper'
import { clearPhoneNumberValue } from 'src/helpers/PhoneHelper'
import { accountService } from 'src/services/AccountService'
import { ViewSettingsProfileFormAvatar } from 'src/components/views/viewSettings/profile/Form/Avatar'
import { ITimeZone } from 'src/services/TimezoneService'
import { IAccountProfile, TAccount } from 'src/models/Account'
import { Button } from 'src/components/shared/ui/Button'
import { FormFieldPhone } from 'src/components/shared/ui/form/formField/Phone'
import styles from './Form.module.scss'

export interface ViewSettingsProfileFormValues {
  id: number
  email: string
  displayName: string
  mobile: string
  avatarUrl: string
  avatar: string
  tz: string
}

const formInitialValues: ViewSettingsProfileFormValues = {
  id: 0,
  email: '',
  displayName: '',
  mobile: '',
  tz: '',
  avatarUrl: '',
  avatar: '',
}

type TForm = ViewSettingsProfileFormValues

interface Props {
  account: TAccount
  timezones: ITimeZone[]
  currentTimezone: string
}

const validate = (values: TForm) => {
  const errors = {
    ...getYupErrorsMap(
      values,
      yup.object().shape({
        displayName: yup.string().required(),
        mobile: yup.string(),
      })
    ),
  }
  const clearNumber = clearPhoneNumberValue(values.mobile)
  if (!errors['mobile'] && clearNumber.length > 1 && clearNumber.length < 12) {
    errors['mobile'] = 'Is not correct format'
  }

  return errors
}

const hasChanges = (item: TAccount, values: ViewSettingsProfileFormValues) => {
  if (item.profile.displayName !== values.displayName) {
    return true
  }

  if (clearPhoneNumberValue(item.profile.mobile) !== clearPhoneNumberValue(values.mobile)) {
    return true
  }

  return !!values.avatar || item.profile.avatarUrl !== values.avatarUrl
}

const prepareAvatar = (base64: string | null) => {
  if (base64) {
    const regexp = /data:(.+);base64,(.+)/
    const match = base64.match(regexp)
    if (match && match[1] && match[2]) {
      return {
        mime: match[1],
        data: match[2],
      }
    }
  }

  if (base64 === null) {
    return null
  }
  return
}

const createInitialValues = (account: TAccount, timezones: ITimeZone[], currentTimezoneString: string): TForm => {
  const result: TForm = { ...formInitialValues, ...account.profile, tz: account.profile.tz.name, id: account.id, avatar: '' }
  if (!result.tz && timezones.length) {
    const currentTimezone = timezones.find(i => i.label === currentTimezoneString)
    if (currentTimezone) {
      result.tz = currentTimezone.label
    } else {
      result.tz = timezones[0].label
    }
  }

  return result
}

export const ViewSettingsProfileForm = ({ currentTimezone, timezones, account }: Props) => {
  const initialValues = createInitialValues(account, timezones, currentTimezone)
  const { setValues, handleForm, handleField, canSubmit, isSubmitting, values, reset } = useForm(initialValues, validate, submit)

  const [hasChanged, setHasChanged] = useState<boolean>(false)
  useEffect(() => {
    setHasChanged(hasChanges(account, values))
  }, [account, values])

  async function submit(values: TForm) {
    const timezone = timezones.find(i => i.value === values.tz)
    const payload: IAccountProfile = {
      ...account.profile,
      ...values,
      avatar: prepareAvatar(values.avatar),
      tz: {
        name: values.tz,
        offset: timezone ? timezone.offset : 0,
      },
    }
    await accountService.update(formInitialValues.id, payload).catch(window.logger.error)
    setHasChanged(false)
  }

  const onChangeAvatar = (value: HTMLInputElement & any) => {
    const nextValues = { ...values, avatar: value, avatarUrl: value }
    setValues(nextValues)
  }

  return (
    <FormFrame {...handleForm()} className={styles.root}>
      <ViewSettingsProfileFormAvatar src={handleField('avatarUrl').value} name={'avatar'} onChange={onChangeAvatar} />
      <FormFieldText
        label={'Login'}
        value={initialValues.email}
        name={'email'}
        inputProps={{ disabled: true }}
        onChange={() => {}}
        onBlur={() => {}}
      />

      <FormFieldText
        label={'Name'}
        placeholder={'Enter name'}
        inputProps={{ autoComplete: 'off', autoFocus: true }}
        {...handleField('displayName')}
      />

      <FormFieldPhone
        label={'Mobile number'}
        placeholder={'Enter mobile number'}
        initialValue={values.mobile}
        {...handleField('mobile')}
      />

      <div className={styles.actions}>
        <Button disabled={!hasChanged} className={classNames(styles.button, hasChanged ? styles.cancel : '')} onClick={() => reset()}>
          Reset
        </Button>
        <FormFieldSubmit disabled={!canSubmit || isSubmitting || !hasChanged} className={styles.button}>
          {!isSubmitting ? 'Save' : 'Saving'}
        </FormFieldSubmit>
      </div>
    </FormFrame>
  )
}
