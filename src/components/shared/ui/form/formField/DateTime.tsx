import 'react-datepicker/dist/react-datepicker.css'
import './DateTime.scss'
import React from 'react'
import dayjs from 'dayjs'
import memoizeOne from 'memoize-one'
import classNames from 'classnames'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import { FormFieldText, Props as FormFieldTextProps } from './Text'
import styles from './DateTime.module.scss'

export interface Props extends FormFieldTextProps {
  value: IDateTime
  minDate?: Date
  maxDate?: Date
  pickerProps?: ReactDatePickerProps
}

export const FormFieldDateTime = React.memo((props: Props) => {
  const { value, readonly } = props
  const [showPicker, setShowPicker] = React.useState(false)
  const [dateTime, setDateTime] = React.useState({ ...value })
  const selectedDate = dateTimeToUTCDate(props.value)
  const minTime = getMinTime(value.date)
  const maxTime = new Date(0, 0, 0, 23, 59)

  React.useEffect(() => {
    setDateTime({ ...value })
  }, [value])

  const updateDateTime = (date: string | null, time: string | null) => {
    const nextDateTime = {
      date: date === null ? dateTime.date : date,
      time: time === null ? dateTime.time : time,
    }
    setDateTime(nextDateTime)
    props.onChange(nextDateTime)
    if (nextDateTime.date && nextDateTime.time) {
      setShowPicker(false)
    }
  }

  const onPickerChange = (date: Date, e: any) => {
    if (e) {
      // selected date
      const dateValue = dayjs(date).format('MM/DD/YYYY')
      updateDateTime(dateValue, '')
    } else {
      // selected time
      const timeValue = dayjs(date).format('HH:mm')
      updateDateTime(null, timeValue)
    }
  }

  let hintTopRight = props.hintTopRight
  if (!hintTopRight && showPicker) {
    if (!dateTime.date) {
      hintTopRight = 'Select date'
    } else if (!dateTime.time) {
      hintTopRight = 'Select time'
    }
  }

  return (
    <div className={classNames(styles.root, styles.dark)}>
      <FormFieldText
        {...getTextProps(props, dateTime)}
        readonly
        hintTopRight={hintTopRight}
        className={classNames(styles.textInput, readonly && styles.readonly)}
        onClick={() => setShowPicker(!showPicker)}
      />

      {!readonly && (
        <div className={classNames(styles.pickerWrapper, showPicker && styles.visible)}>
          <div className={styles.pickerBlock}>
            <DatePicker
              inline
              showTimeSelect
              fixedHeight
              selected={selectedDate}
              timeFormat="HH:mm"
              timeIntervals={30}
              timeCaption="Time"
              calendarClassName="FormFieldDateTime"
              minDate={props.minDate}
              maxDate={props.maxDate}
              minTime={minTime}
              maxTime={maxTime}
              {...props.pickerProps}
              onChange={onPickerChange}
            />
          </div>
        </div>
      )}
    </div>
  )
})

const getTextProps = (props: Props, dateTime: IDateTime) => {
  const clearProps = { ...props }
  delete clearProps.pickerProps

  const textProps: FormFieldTextProps = { ...clearProps }
  if (!textProps.inputProps) {
    textProps.inputProps = {}
  }
  textProps.inputProps.readOnly = true
  textProps.value = dateTimeToValue(dateTime)
  return textProps
}

const dateTimeToValue = (dateTime: IDateTime) => {
  let result = dateTime.date
  if (dateTime.time) {
    result += ` at ${dateTime.time} UTC`
  }
  return result.trim()
}

const dateTimeToUTCDate = (dateTime: IDateTime): Date | null => {
  const dateTimeString = `${dateTime.date} ${dateTime.time}`.trim()
  if (!dateTimeString.match(/^\d\d\/\d\d\/\d\d\d\d \d\d:\d\d$/)) {
    return null
  }

  try {
    return dayjs(dateTimeString, 'MM/DD/YYYY HH:mm').toDate()
  } catch (e) {
    window.logger.error(e)
    return null
  }
}

const getMinTime = memoizeOne(
  (selectedDateString: string): Date => {
    const offset = new Date().getTimezoneOffset()
    const nowTime = dayjs().add(offset, 'minute').toDate()
    const defaultTime = dayjs().add(offset, 'minute').hour(0).minute(0).second(0).toDate()

    if (!selectedDateString) {
      return defaultTime
    }
    return dayjs().format('MM/DD/YYYY') === selectedDateString ? nowTime : defaultTime
  }
)
