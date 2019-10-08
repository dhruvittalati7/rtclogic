import codes from 'src/config/codes.json'
import flag from 'country-code-emoji'

export interface TCountry {
  name: string
  code: string
  callingCode: string
}

class CountryHelper {
  public getCountryByCode = (code: string) => {
    const country: TCountry | undefined = codes.find(i => i.code === code)
    return country
  }

  public getFlagByCode = (code: string) => {
    try {
      return flag(code)
    } catch (e) {
      window.logger.error(e)
    }
    return ''
  }
}

const countryHelper = new CountryHelper()
export { countryHelper }
