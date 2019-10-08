import React from 'react'
import { connect, Omit } from 'react-redux'
import { IState } from 'src/store'
import * as yup from 'yup'
import gsm from 'gsm'
import { deepClone, getYupErrorsMap } from 'src/helpers/CommonHelper'
import { getCallingCode, isPhoneNumber } from 'src/helpers/PhoneHelper'
import { useForm } from 'src/hooks/useForm'
import { FormFrame } from 'src/components/shared/ui/form/FormFrame'
import { FormTitle } from 'src/components/shared/ui/form/FormTitle'
import { FormFieldText } from 'src/components/shared/ui/form/formField/Text'
import { TCampaignStatus, TModel as TCampaign } from 'src/models/Campaign'
import { TAccount } from 'src/models/Account'
import { TModel as TNumber } from 'src/models/dids/Number'
import { campaignService } from 'src/services/CampaignService'
import { currentSourceNumbersSelector } from 'src/services/selectors/DidsSelectors'
import { currentAccountSelector } from 'src/services/selectors/AccountSelectors'
import { layoutService } from 'src/services/LayoutService'
import { isRoleManagerSelector } from 'src/services/selectors/RoleSelectors'
import { CampaignsFormError } from './campaignsForm/Error'
import { CampaignsFormFieldMessage } from './campaignsForm/FieldMessage'
import { CampaignsFormSourceNumbers } from './campaignsForm/SourceNumbers'
import { CampaignsFormTargetNumbers } from './campaignsForm/TargetNumbers'
import { CampaignsFormFieldCountry } from './campaignsForm/FieldCountry'
import { CampaignsFormFieldSchedule } from './campaignsForm/FieldSchedule'
import { CampaignsFormActions } from './campaignsForm/Actions'
import { useOnMount } from 'src/hooks/useOnMount'
import { dateTimeToDayJs } from 'src/helpers/DateHelper'
import styles from './CampaignsForm.module.scss'

const formInitialValues = {
  name: '',
  message: '',
  country: '',
  sourceNumber: { id: 0, number: '', anyCountry: false },
  targetNumber: '',
  targetNumbers: [] as string[],
  scheduled: false,
  dateTime: { date: '', time: '' } as IDateTime,
}
export type TForm = typeof formInitialValues

const validate = (values: TForm) => {
  const errors =
    getYupErrorsMap(
      values,
      yup.object().shape({
        name: yup.string().required(),
        message: yup.string().required(),
        country: yup.string().required(),
      })
    ) || {}

  if (values.message) {
    const parts = gsm(values.message)
    if (parts.sms_count > 6) {
      errors['message'] = 'SMS count limit is 6'
    }
  }

  if (!values.sourceNumber.id) {
    errors['sourceNumber'] = 'Source number is a required field'
  }

  if (!values.targetNumbers.length) {
    errors['targetNumber'] = 'Target numbers is a required field'
  }

  const callingCode = values.country === 'US' ? getCallingCode(values.country) : undefined
  if (!values.targetNumbers.reduce((a, i) => a && isPhoneNumber(i, callingCode), true)) {
    errors['targetNumber'] = 'Remove incorrect numbers'
  }

  if (values.scheduled && (!values.dateTime.date || !values.dateTime.time)) {
    errors['dateTime'] = 'Launch date and time are required'
    if (values.dateTime.date) {
      errors['dateTime'] = 'Launch time is required'
    }
    if (values.dateTime.time) {
      errors['dateTime'] = 'Launch date is required'
    }
  }

  return errors
}

interface Props {
  account: TAccount
  isRoleManager: boolean
  sourceNumbers: TNumber[]
  campaign: TCampaign
  setEditCampaign: (id: null | number) => void
  onSuccess?: () => void
}

const CampaignsForm = ({ account, isRoleManager, sourceNumbers, campaign, onSuccess, setEditCampaign }: Props) => {
  const debounceRef = React.useRef<any>()
  const canDelete = !!campaign.id && ['draft', 'scheduled'].find(i => i === campaign.status)
  const canSaveDraft = ['draft', 'scheduled'].find(i => i === campaign.status)
  const readOnly = !!['launched', 'finished', 'failed'].find(i => i === campaign.status)
    || !account.isManagerOfGroupId
    || (campaign.roleId !== null && account.isManagerOfGroupId !== campaign.roleId)

  useOnMount(() => () => clearTimeout(debounceRef.current))

  const initialValues = React.useMemo(
    () => createInitialValues(campaign, account, sourceNumbers),
    [campaign, account, sourceNumbers]
  )
  const initialValid = Object.keys(validate(initialValues)).length === 0
  const { values, setValue, setValues, handleForm, handleField, canSubmit } =
    useForm(initialValues, validateAndSaveDraft, submit, initialValid, readOnly)

  const title = getTitle(campaign, values, readOnly)
  const availableSourceNumbers = sourceNumbers.filter(i => i.capabilities.bulkSms || i.capabilities.bulkMms)

  function validateAndSaveDraft(values: TForm) {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (!readOnly && canSaveDraft) {
        const status = (!values.scheduled && campaign.draft.scheduled)
          ? 'draft' // ! important to avoid launch on auto save
          : campaign.status

        saveCampaign(values, status, !campaign.id).catch(window.logger.error)
      }
    }, 1000)

    return validate(values)
  }

  async function submit(values: TForm) {
    await saveCampaign(values)
  }

  const deleteCampaign = async (values: TForm) => {
    layoutService.confirm(
      'Delete campaign',
      'Are you sure you want to delete the campaign?',
      'Delete',
      async () => {
        clearTimeout(debounceRef.current)
        await campaignService.delete(campaign.id)
        onSuccess && onSuccess()
      }
    )
  }

  const saveCampaign = async (values: TForm, status: TCampaignStatus = 'scheduled', updateEditId = true) => {
    if (readOnly) {
      onSuccess && onSuccess()
      return
    }

    const data: Omit<TCampaign, 'id' | 'reason'> = {
      ...campaign,
      status,
      name: values.name,
      message: values.message,
      sourceNumber: values.sourceNumber,
      targetNumbers: values.targetNumbers,
      draft: { scheduled: values.scheduled, countryCode: values.country },
      startDate: null,
    }

    if (values.scheduled && values.dateTime.date && values.dateTime.time) {
      data.startDate = dateTimeToDayJs(values.dateTime)
    }

    clearTimeout(debounceRef.current)
    const resultId = await campaignService.save(data, campaign && campaign.id)

    if (resultId) {
      updateEditId && setEditCampaign(resultId)
      onSuccess && onSuccess()
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.form}>
        <FormFrame {...handleForm()}>
          <FormTitle>{title}</FormTitle>

          {campaign.reason && <CampaignsFormError>{campaign.reason}</CampaignsFormError>}

          <FormFieldText
            hideBottom
            label={'Campaign name'}
            placeholder={'Enter campaign name'}
            inputProps={{ autoComplete: 'off', autoFocus: true }}
            {...handleField('name')}
          />

          <CampaignsFormFieldMessage
            sourceNumberId={values.sourceNumber.id}
            targetNumbers={values.targetNumbers}
            label={'Message'}
            placeholder={'Enter message'}
            {...handleField('message')}
          />

          <div className={styles.row}>
            <CampaignsFormFieldCountry
              availableSourceNumbers={availableSourceNumbers}
              values={values}
              setValues={setValues}
              handleField={handleField}
            />

            <CampaignsFormSourceNumbers
              countryCode={values.country}
              availableSourceNumbers={availableSourceNumbers}
              values={values}
              setValues={setValues}
              handleField={handleField}
            />
          </div>

          <CampaignsFormTargetNumbers values={values} setValue={setValue} handleField={handleField} />

          <CampaignsFormFieldSchedule values={values} handleField={handleField} />

          {!readOnly && (
            <CampaignsFormActions
              submitTitle={title}
              canSubmit={canSubmit}
              canDelete={!!canDelete}
              onDelete={() => deleteCampaign(values)}
            />
          )}
        </FormFrame>
      </div>
    </div>
  )
}

const createInitialValues = (campaign: TCampaign, account: TAccount, numbers: TNumber[]): TForm => {
  const result: TForm = deepClone({ ...formInitialValues, ...campaign })
  const number = numbers.find(i => i.id === campaign.sourceNumber.id)
  if (number) {
    result.country = number.countryCode
  } else {
    result.country = campaign.draft.countryCode
  }

  result.scheduled = campaign.status === 'draft'
    ? campaign.draft.scheduled
    : !!campaign.startDate

  if (campaign.startDate) {
    const d = campaign.startDate.utc()
    result.dateTime = { date: d.format('MM/DD/YYYY'), time: d.format('HH:mm') }
  }
  return result
}

const getTitle = (campaign: TCampaign, values: TForm, readOnly: boolean): string => {
  let title = campaign.id ? 'Update Campaign' : 'Create Campaign'
  if (!values.scheduled) {
    title = 'Launch Campaign'
  }
  if (readOnly) {
    title = 'Campaign Info'
  }
  return title
}

const mapStateToProps = (state: IState, ownProps: Pick<Props, 'campaign' | 'onSuccess'>): Props => ({
  isRoleManager: isRoleManagerSelector(state.app),
  account: currentAccountSelector(state.app),
  sourceNumbers: currentSourceNumbersSelector(state.app),
  campaign: ownProps.campaign,
  setEditCampaign: campaignService.edit,
  onSuccess: ownProps.onSuccess,
})

const CampaignsFormConnected = connect(mapStateToProps)(CampaignsForm)

export { CampaignsFormConnected as CampaignsForm }
