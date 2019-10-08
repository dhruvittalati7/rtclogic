declare type ValueOf<T> = T[keyof T]

declare type SizeOption = 5 | 10 | 25

declare type TPermission = 'admin' | 'manager' | 'member'

declare interface TObjectAny {
  [key: string]: any
}

declare interface TOption<T extends any = any> {
  value: T
  label: any
  search?: string
}

declare interface IDateTime {
  date: string
  time: string
}

declare interface INotification {
  show: boolean
}

declare interface ILogger {
  group: (end: boolean = false) => void
  debug: (...args: any[]) => void
  info: (...args: any[]) => void
  warn: (...args: any[]) => void
  error: (...args: any[]) => void
}
// tslint:disable-next-line:interface-name
declare interface Window {
  logger: ILogger
}

declare module '*.mp3'

declare module 'simple-keyboard-layouts/build/layouts/spanish'
declare module 'simple-keyboard-layouts/build/layouts/russian'
declare module 'simple-keyboard-layouts/build/layouts/french'
declare module 'simple-keyboard-layouts/build/layouts/arabic'
declare module 'simple-keyboard-layouts/build/layouts/english'
declare module 'country-code-emoji'

declare module 'gsm' {
  interface Parts {
    char_set: string
    chars_left: number
    sms_count: number
    parts: string[]
  }
  declare var gsm: (message: string) => Parts
  export default gsm
}

declare module 'react-image' {
  interface Props extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    src: string | string[]
    loader?: React.ReactNode
    unloader?: React.ReactNode
    [key: string]: any
  }
  declare var Img = (props: Props) => React.ReactNode
  export default Img
}

declare var window: Window
