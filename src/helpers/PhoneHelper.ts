import codes from 'src/config/codes.json'
import memoizeOne from 'memoize-one'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const getCountryData = memoizeOne((countryCode: string) => codes.find(i => i.code === countryCode))

export const clearPhoneNumberValue = (value: string) => {
  return `+${value.replace('+', '').replace(/[\D]/g, '')}`
}

export const formatPhoneNumber = (str: string): string => {
  if (!str) {
    return str
  }

  let value = str
  if (typeof parseInt(str) === 'number') {
    value = clearPhoneNumberValue(value)
  }

  const matchUS = value.match(/^\+1(\d{3})(\d{3})(\d{2})(\d{2})$/)
  if (matchUS) {
    return `+1 (${matchUS[1]}) ${matchUS[2]}-${matchUS[3]}${matchUS[4]}`
  }

  const phone = parsePhoneNumberFromString(value)
  return phone ? phone.formatInternational() : str
}

export const getCallingCode = (countryCode: string): string => {
  const countryData = getCountryData(countryCode)
  return countryData ? countryData.callingCode : ''
}

export const isPhoneNumber = (value: string, callingCode?: string): boolean => {
  if (callingCode) {
    return !!clearPhoneNumberValue(value).match(new RegExp(`^\\+${callingCode}[\\d]{10,}$`))
  }

  return !!clearPhoneNumberValue(value).match(/^\+[\d]{11,}$/)
}

// @ts-ignore
window.formatPhoneNumber = formatPhoneNumber
