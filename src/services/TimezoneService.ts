import { getUTCOffset, findTimeZone } from 'timezone-support'

export interface ITimeZone {
  offset: number
  label: string
  value: string
}

class TimezoneService {

  public initListTimeZones = async () => {
    // Dynamic import because 35Kb of timezones. TODO: Check if it works properly
    const { listTimeZones } = await import('timezone-support')
    return listTimeZones
  }

  public getTimezoneOffsetOptions = async () => {
    let result: ITimeZone[] = []
    const listTimeZones = await this.initListTimeZones()
    if (listTimeZones) {
      const date = new Date()
      result = listTimeZones().map(i => {
        const timeZone = findTimeZone(i)
        const utcOffset = getUTCOffset(date, timeZone)
        const label = `${i}${utcOffset.abbreviation ? ` (${utcOffset.abbreviation})` : ''}`
        return { label, value: i, offset: utcOffset.offset }
      })
      result = result.sort(this.sortOffset)
    }

    return result
  }

  public toOptions = (items: ITimeZone[]) => {
    return items.map(i => ({ label: i.label, value: i.value }))
  }

  private sortOffset = (a: ITimeZone, b: ITimeZone) => {
    return a.offset - b.offset
  }
}

const timezoneService = new TimezoneService()
export { timezoneService }
