import { Shape } from 'yup'
import { reject } from 'q'
import { TAccount } from 'src/models/Account'

export const debounce = <T extends Function>(fn: T, ms: number = 0): T => {
  let timeoutId: any
  const func = (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(null, args), ms)
  }
  return func as any
}

export function unique(arr: any[]) {
  return [...new Set(arr)]
}

export function uniqueByField<T extends TObjectAny>(array: T[], field: keyof T): T[] {
  const result = []
  const map = new Map()
  for (const item of array) {
    if (!map.has(item[field])) {
      map.set(item[field], true)
      result.push({ ...item })
    }
  }

  return result
}

export function hasDiff<T extends TObjectAny>(obj1: T, obj2: T, keys: (keyof T)[]): boolean {
  let result = false
  keys.forEach(key => {
    if (obj1[key] !== obj2[key]) {
      result = true
    }
  })
  return result
}

export function includesSubString(string: string, subString: string): boolean {
  if (!subString) {
    return true
  }
  const subStringLow = subString.toLowerCase()
  return string.toLowerCase().includes(subStringLow)
}

export const difference = (a: any[], b: any[]) => {
  const s = new Set(b)
  return a.filter(x => !s.has(x))
}

export const intersection = (a: any[], b: any[]) => {
  return a.filter(x => b.includes(x))
}

export const deepClone = (obj: any) => {
  const clone = Object.assign({}, obj)
  Object.keys(clone).forEach(key => (clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]))

  return Array.isArray(obj) && obj.length ? (clone.length = obj.length) && Array.from(clone) : Array.isArray(obj) ? Array.from(obj) : clone
}

export function getYupErrorsMap<T extends {}>(values: T, yupScheme: Shape<T, any>) {
  try {
    yupScheme.validateSync(values, { abortEarly: false })
  } catch (e) {
    if (e.inner && e.inner.length) {
      return e.inner.reduce((errors: TObjectAny, i: any) => ({ ...errors, [i.path]: i.message }), {} as TObjectAny)
    }
  }
  return undefined
}

export const fetchBase64 = (url: string, callback: (url: string) => void) => {
  const request = new XMLHttpRequest()
  request.open('GET', url, true)
  request.responseType = 'blob'
  request.onload = () => {
    const reader = new FileReader()
    reader.readAsDataURL(request.response)
    reader.onload = (e: any) => {
      const blob = base64ToBlob(e.target.result)
      if (blob) {
        const localUrl = window.URL.createObjectURL(blob)
        callback(localUrl)
      }
    }
  }
  request.send()
}

export const base64ToBlob = (base64: string): Blob | null => {
  let result = null
  const regexp = /data:(.+);base64,(.+)/
  const match = base64.match(regexp)
  if (match && match[1] && match[2]) {
    // convert base64 string to byte array
    const byteCharacters = atob(match[2])
    const byteNumbers = [byteCharacters.length]
    for (let i = 0; i < byteCharacters.length; i = i + 1) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)

    // now that we have the byte array, construct the blob from it
    result = new Blob([byteArray], { type: match[1] })
  }

  return result
}

export function toOptions<T extends {}>(items: T[], valueKey: keyof T, labelKey: keyof T): TOption[] {
  return items.map(item => ({ value: item[valueKey], label: `${item[labelKey]}` }))
}

export function accountsToOptions(items: TAccount[]) {
  return items.map(i => ({ value: i.id, label: i.profile.displayName }))
}

export function toScalarOptions(items: any[]): TOption[] {
  return items.map(item => ({ value: item, label: `${item}` }))
}

export function mapToArray(mapObject: TObjectAny, keyField: string) {
  return Object.keys(mapObject).map(key => ({
    ...mapObject[key],
    [keyField]: key,
  }))
}

export function readFileContent(file: File): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.addEventListener('load', (e: any) => (e && e.target ? resolve(e.target.result) : reject()))
    reader.readAsBinaryString(file)
  })
}

export function parseCsvNumbers(content: string): string[] {
  const result: string[] = []
  const rows = content.trim().split('\n')
  for (const row of rows) {
    const phone = row.replace(',', ';').split(';')[0].trim()
    if (phone && !phone.match(/[a-zA-Z_=*]/)) {
      result.push(phone)
    }
  }
  return result
}

export function validateEmail(value: string) {
  // tslint:disable-next-line:max-line-length
  const regexp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  return regexp.test(value)
}

export const nextDirection = (currentDir?: 'asc' | 'desc') => {
  let dir: 'asc' | 'desc' | undefined
  if (!currentDir) {
    dir = 'asc'
  }

  if (currentDir === 'asc') {
    dir = 'desc'
  }

  if (currentDir === 'desc') {
    dir = undefined
  }

  return dir
}

export const objectListToArray = (items: TObjectAny) => {
  return Object.keys(items).map(key => {
    const item = items[key]
    item['id'] = parseInt(key)
    return item
  })
}

export const createQueryPattern = (query: string): RegExp => {
  return new RegExp(
    query
      .split(' ')
      .map(i => i.replace(/\W/g, ''))
      .filter(i => i).join('|'),
    'gi')
}

export const isEmoji = (str: string): boolean => {
  // tslint:disable-next-line:max-line-length
  const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g
  return regex.test(str)
}
