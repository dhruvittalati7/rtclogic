import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { IState } from 'src/store'
import { CallIcon } from 'src/components/shared/ui/Icons'
import { Modal } from 'src/components/shared/ui/Modal'
import { TModel as TNumber } from 'src/models/dids/Number'
import { dialService } from 'src/services/DialService'
import { clearPhoneNumberValue } from 'src/helpers/PhoneHelper'
import { KeyboardHandler } from 'src/components/shared/KeyboardHandler'
import { Select } from 'src/components/shared/ui/Select'
import { defaultDialSourceNumberSelector, currentSourceNumbersSelector } from 'src/services/selectors/DidsSelectors'
import { NumberLabel } from 'src/components/shared/ui/NumberLabel'
import { extrasService } from 'src/services/ExtrasService'
import { FormFieldPhone } from 'src/components/shared/ui/form/formField/Phone'
import styles from './DialPad.module.scss'

const DEFAULT_DIAL_CODE = '+1'

interface Props {
  openDial: boolean
  onClose: () => void
  sourceNumber?: TNumber
  sourceNumbers: TNumber[]
  call: (targetNumber: string) => void
  setDialSourceNumberId: (id: number) => void
}

interface State {
  number: string
  clearNumber: string
  isFocused: boolean
  isValid: boolean
}

const DialPad = ({ openDial, onClose, sourceNumber, sourceNumbers, call, setDialSourceNumberId }: Props) => {
  const [dialCode, setDialCode] = React.useState(DEFAULT_DIAL_CODE)
  const [dialNumber, setDialNumber] = React.useState('')
  const [clearNumber, setClearNumber] = React.useState('')
  const [isFocused, setIsFocused] = React.useState(false)
  const [isValid, setIsValid] = React.useState(false)

  const availableSourceNumbers = sourceNumbers.filter(i => i.capabilities.voice)
  const availableSourceNumbersIds = availableSourceNumbers.map(i => i.id)
  const selectedNumberId = availableSourceNumbersIds.find(i => i === (sourceNumber ? sourceNumber.id : null)) || null
  const sourceNumberOptions = availableSourceNumbers.map(i => ({ value: i.id, label: <NumberLabel showMobile number={i} /> }))

  const onSelectSourceNumber = (id: number) => {
    setDialSourceNumberId(id)
    afterValueUpdate(dialCode, dialNumber)
  }

  const updateCode = (code: string) => {
    setDialCode(code)
    afterValueUpdate(code, dialNumber)
  }

  const updateNumber = (number: string) => {
    setDialNumber(number)
    afterValueUpdate(dialCode, number)
  }

  const afterValueUpdate = (code: string, number: string) => {
    const fullNumber = `${code} ${number}`
    const clearNumber = clearPhoneNumberValue(fullNumber)
    const isValid = !!code && number.length >= 10 && !!sourceNumber
    setClearNumber(clearNumber)
    setIsValid(isValid)
  }

  const addNumeric = (num: number) => {
    updateNumber(`${dialNumber}${num}`)
  }

  const removeNumeric = () => {
    updateNumber(dialNumber.substr(0, dialNumber.length - 1))
  }

  const callNumber = () => {
    if (isValid) {
      closeDialPad()
      call(clearNumber)
    }
  }

  const closeDialPad = () => {
    setDialCode(DEFAULT_DIAL_CODE)
    setDialNumber('')
    setIsValid(false)
    onClose()
  }

  return (
    <Modal show={openDial} onClose={closeDialPad} width={'380px'}>
      <div className={classNames(styles.root, styles.dark)}>
        <div className={styles.inner}>
          <div className={styles.rowNumber}>
            <span className={styles.label}>Source number</span>
            <Select
              placeholder={'Select number'}
              className={styles.inputNumber}
              value={selectedNumberId}
              options={sourceNumberOptions}
              onSelect={onSelectSourceNumber}
            />
          </div>
          <div className={styles.phoneBlock}>
            <FormFieldPhone
              label={'Target number'}
              placeholder={'Enter target number'}
              name={'number'}
              defaultCode={DEFAULT_DIAL_CODE}
              valueCode={dialCode}
              valueNumber={dialNumber}
              inputProps={{ autoFocus: true }}
              onChange={() => {}}
              onChangeCode={updateCode}
              onChangeNumber={updateNumber}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onEnter={callNumber}
            />
          </div>

          <div className={styles.keyboard}>
            <div className={styles.row}>
              <div className={styles.key} data-after="" onClick={() => addNumeric(1)}>
                1
              </div>
              <div className={styles.key} data-after="abc" onClick={() => addNumeric(2)}>
                2
              </div>
              <div className={styles.key} data-after="def" onClick={() => addNumeric(3)}>
                3
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.key} data-after="ghi" onClick={() => addNumeric(4)}>
                4
              </div>
              <div className={styles.key} data-after="jkl" onClick={() => addNumeric(5)}>
                5
              </div>
              <div className={styles.key} data-after="mno" onClick={() => addNumeric(6)}>
                6
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.key} data-after="pqrs" onClick={() => addNumeric(7)}>
                7
              </div>
              <div className={styles.key} data-after="tuv" onClick={() => addNumeric(8)}>
                8
              </div>
              <div className={styles.key} data-after="wxyz" onClick={() => addNumeric(9)}>
                9
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.key} data-after="">
                *
              </div>
              <div className={styles.key} data-after="+" onClick={() => addNumeric(0)}>
                0
              </div>
              <div className={styles.key} data-after="">
                #
              </div>
            </div>
          </div>
          <div className={classNames(styles.button, !isValid && styles.buttonDisabled)} onClick={callNumber}>
            <CallIcon width={15} height={16} />
          </div>
        </div>
      </div>

      <KeyboardHandler active={!isFocused} onBackspace={removeNumeric} onEnter={callNumber} onNumeric={addNumeric} />
    </Modal>
  )
}

const DialPadConnected = connect(
  (state: IState): Props => ({
    openDial: state.app.calls.openDial,
    onClose: dialService.hideDial,
    sourceNumber: defaultDialSourceNumberSelector(state.app),
    sourceNumbers: currentSourceNumbersSelector(state.app),
    call: dialService.callExternal,
    setDialSourceNumberId: extrasService.setDialSourceNumberId,
  })
)(DialPad)

export { DialPadConnected as DialPad }
