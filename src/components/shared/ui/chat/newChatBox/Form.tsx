import React from 'react'
import { connect } from 'react-redux'
import { IState } from 'src/store'
import * as yup from 'yup'
import { useForm } from 'src/hooks/useForm'
import { accountsToOptions, getYupErrorsMap } from 'src/helpers/CommonHelper'
import { clearPhoneNumberValue, isPhoneNumber } from 'src/helpers/PhoneHelper'
import { FormFrame } from 'src/components/shared/ui/form/FormFrame'
import { FormTitle } from 'src/components/shared/ui/form/FormTitle'
import { FormFieldText } from 'src/components/shared/ui/form/formField/Text'
import { FormFieldSubmit } from 'src/components/shared/ui/form/formField/Submit'
import { FormFieldParticipant } from './form/FieldParticipant'
import { FormChatFound } from './form/ChatFound'
import { currentSourceNumbersSelector, defaultChatSourceNumberSelector } from 'src/services/selectors/DidsSelectors'
import { chatService } from 'src/services/ChatService'
import { Tags } from 'src/components/shared/ui/Tags'
import { FormFieldSelect } from 'src/components/shared/ui/form/formField/Select'
import { TModel as TNumber } from 'src/models/dids/Number'
import { extrasService } from 'src/services/ExtrasService'
import { NumberLabel } from 'src/components/shared/ui/NumberLabel'
import { TAccount } from 'src/models/Account'
import { Selector } from 'src/components/shared/ui/Selector'
import { FormLabel } from 'src/components/shared/ui/form/FormLabel'
import styles from './Form.module.scss'
import { useRouter } from 'src/hooks/useRouter'
import { FormFieldPhone } from 'src/components/shared/ui/form/formField/Phone'

const formInitialValues = {
  type: 'internal',
  title: '',
  srcNumberId: 0,
  targetNumber: '',
  participants: [] as TAccount[],
}
type TForm = typeof formInitialValues

const validate = (values: TForm) => {
  const errors = {
    ...getYupErrorsMap(
      values,
      yup.object().shape({
        title: yup.string().required(),
      })
    ),
  }

  if (values.type === 'internal' && !values.participants.length) {
    errors['participants'] = 'participants is a required field'
  }

  if (values.type === 'external') {
    if (!values.srcNumberId) {
      errors['srcNumberId'] = 'source number is a required field'
    }

    if (!values.targetNumber) {
      errors['targetNumber'] = 'target number is a required field'

    } else if (!isPhoneNumber(values.targetNumber)) {
      errors['targetNumber'] = 'incorrect phone number'
    }
  }

  return errors
}

interface Props {
  sourceNumber?: TNumber
  sourceNumbers: TNumber[]
  createChatWithAccounts: (accountIds: number[], title: string) => Promise<{ chatId: number; status: string } | null>
  createChatWithNumbers: (sourceNumberId: number, number: string[], title: string) => Promise<{ chatId: number; status: string } | null>
  participants?: TAccount[]
  setChatSourceNumberId: (id: number) => void
  close?: () => void
}

const NewChatBoxForm = (props: Props) => {
  const router = useRouter()
  const { sourceNumber, sourceNumbers, createChatWithNumbers, createChatWithAccounts, close, setChatSourceNumberId, participants } = props
  formInitialValues.srcNumberId = sourceNumber ? sourceNumber.id : 0
  formInitialValues.participants = participants || []
  const [foundChatId, setFoundChatId] = React.useState(0)
  const { values, setValue, handleForm, handleField, canSubmit } = useForm(formInitialValues, validate, submit, false)

  const removeParticipant = (accountId: number) => {
    setValue('participants', [...values.participants.filter(i => i.id !== accountId)])
  }

  const onChangeSourceNumberId = (srcNumberId: number) => {
    setValue('srcNumberId', srcNumberId)
    setChatSourceNumberId(srcNumberId)
  }

  async function submit(values: TForm) {
    let result
    if (values.type === 'internal' && values.participants.length) {
      result = await createChatWithAccounts(values.participants.map(i => i.id), values.title)
    }

    if (values.type === 'external' && values.targetNumber) {
      result = await createChatWithNumbers(values.srcNumberId, [clearPhoneNumberValue(values.targetNumber)], values.title)
    }

    if (result && result.chatId) {
      if (result.status === 'success') {
        gotoChat(result.chatId)
      } else if (result.status === 'exists') {
        setFoundChatId(result.chatId)
      }
    }
  }

  const gotoChat = (chatId: number) => {
    router.history.push(`/chat/${chatId}`)
    close && close()
  }

  const availableSourceNumbers = sourceNumbers.filter(i => i.capabilities.twoWay && (i.capabilities.sms || i.capabilities.mms))
  const options = availableSourceNumbers.map(i => ({ value: i.id, label: <NumberLabel showWay showType showVoice showMobile number={i} /> }))

  return (
    <div className={styles.root}>
      <FormFrame {...handleForm()}>
        <FormTitle>New conversation</FormTitle>

        <div className={styles.type}>
          <FormLabel>Conversation type</FormLabel>
          <Selector
            value1={'internal'}
            value2={'external'}
            label1={'Internal'}
            label2={'External'}
            selected={values.type}
            onChange={type => setValue('type', type)}
          />
        </div>

        <FormFieldText
          label={'Title'}
          placeholder={'Enter title...'}
          inputProps={{ autoComplete: 'off', autoFocus: true }}
          {...handleField('title')}
        />

        {values.type === 'external' && (
          <>
            <FormFieldSelect
              label={'Source number'}
              placeholder={'Select source number'}
              options={options}
              {...handleField('srcNumberId')}
              onChange={onChangeSourceNumberId}
            />

            <FormFieldPhone
              label={'Target number'}
              placeholder={'Enter target number'}
              {...handleField('targetNumber')}
            />
          </>
        )}

        {values.type === 'internal' && (
          <>
            <FormFieldParticipant label={'Add participants'} {...handleField('participants')} />

            <Tags
              options={accountsToOptions(values.participants)}
              onClickRemove={({ value }) => removeParticipant(value)}
            />
          </>
        )}

        <FormFieldSubmit disabled={!canSubmit}>Create conversation</FormFieldSubmit>

        {!!foundChatId && <FormChatFound chatId={foundChatId} gotoChat={gotoChat} />}
      </FormFrame>
    </div>
  )
}

const mapStateToProps = (state: IState, ownProps: Pick<Props, 'close' | 'participants'>): Props => ({
  close: ownProps.close,
  participants: ownProps.participants,
  sourceNumber: defaultChatSourceNumberSelector(state.app),
  sourceNumbers: currentSourceNumbersSelector(state.app),
  createChatWithNumbers: chatService.createChatWithNumbers,
  createChatWithAccounts: chatService.createChatWithAccounts,
  setChatSourceNumberId: extrasService.setChatSourceNumberId,
})

const NewChatBoxFormConnected = connect(mapStateToProps)(NewChatBoxForm)
export { NewChatBoxFormConnected as NewChatBoxForm }
