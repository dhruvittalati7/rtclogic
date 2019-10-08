import dayjs, { ConfigType, Dayjs } from 'dayjs'

export const utcFormat = (value: ConfigType, format: string = 'YYYY-MM-DD') => {
  let result = ''
  if (value) {
    result = dayjs(value)
      .utc()
      .format(format)
  }
  return result
}

export const dateFormat = (value: ConfigType, format: string = 'YYYY-MM-DD') => {
  let result = ''
  if (value) {
    result = dayjs(value).format(format)
  }
  return result
}

export const startOfTheDay = (value: ConfigType) => {
  return dayjs(value)
    .set('h', 0)
    .set('m', 0)
    .set('s', 0)
    .set('ms', 0)
}

export const endOfTheDay = (value: ConfigType) => {
  return dayjs(value)
    .set('h', 24)
    .set('m', 59)
    .set('s', 59)
    .set('ms', 999)
}

export const messageDividerDateFormat = (value: ConfigType) => {
  let result = ''
  if (value) {
    const currentYearFormat = 'dddd, MMMM D'
    const anotherYearFormat = 'MMMM D, YYYY'
    const date = dayjs(value)
    const currentDate = dayjs().utc()

    if (date.isAfter(startOfTheDay(currentDate)) && date.isBefore(endOfTheDay(currentDate))) {
      result = 'Today'
    } else if (date.year() !== currentDate.year()) {
      result = date.format(anotherYearFormat)
    } else {
      result = date.format(currentYearFormat)
    }
  }
  return result
}

export const chatDateFormat = (timestamp: number): string => {
  const date = dayjs(timestamp).utc()
  return date.local().format(isTodayTimestamp(timestamp) ? 'HH:mm' : 'MM/DD/YYYY HH:mm')
}

export const messageDateFormat = (timestamp: number): string => {
  const date = dayjs(timestamp).utc()
  return date.local().format('HH:mm')
}

export const toServerFormat = (value: ConfigType) => {
  let result = ''
  if (value) {
    result = dayjs(value).toISOString()
  }
  return result
}

export const isTodayTimestamp = (timestamp: number): boolean => {
  return dayjs(timestamp).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
}

export const isDayChanged = (previousTimestamp: number | null, timestamp: number): boolean => {
  if (!previousTimestamp) {
    return true
  }

  const previousItemDate = dayjs(previousTimestamp)
  const currentItemDate = dayjs(timestamp)

  return !(
    previousItemDate.day() === currentItemDate.day() &&
    previousItemDate.month() === currentItemDate.month() &&
    previousItemDate.year() === currentItemDate.year()
  )
}

export const dateTimeToDayJs = (dateTime: IDateTime): Dayjs => {
  return dayjs(dateTimeToUtcString(dateTime))
}

export const dateTimeToUtcString = (dateTime: IDateTime): string => {
  const d = dayjs(`${dateTime.date} ${dateTime.time}`, 'MM/DD/YYYY HH:mm')
  return `${d.format('YYYY-MM-DDTHH:mm:ss.SSS')}Z`
}

export const secondsToTimeString = (secondsValue: number) => {
  const total = Math.ceil(secondsValue)
  const minutes = Math.floor(total / 60)
  const secondsRest = total - minutes * 60
  const seconds = secondsRest < 10 ? `0${secondsRest}` : secondsRest
  return `${minutes}:${seconds}`
}
