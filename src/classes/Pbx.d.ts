export interface Options {
  user?: string
  password?: string
  wsServers?: string[]
  hasAudio?: boolean
  hasVideo?: boolean
  register?: boolean
  iceCheckingTimeout?: number
  iceServers?: any[]
  debug?: any
}

interface Handlers {
  ready?: () => void
  call: {
    created?: (callInstance: ICallInstance) => void
    progress?: (callInstance: ICallInstance, data: { response: any }) => void
    accepted?: (callInstance: ICallInstance, data: { data: any }) => void
    rejected?: (callInstance: ICallInstance, data: { response: any; cause: any }) => void
    failed?: (callInstance: ICallInstance, data: { response: any; cause: any }) => void
    terminated?: (callInstance: ICallInstance, data: { response: any; cause: any }) => void
    cancel?: (callInstance: ICallInstance) => void
    replaced?: (callInstance: ICallInstance, data: { newObject: any }) => void
    dtmf?: (callInstance: ICallInstance, data: { request: any; dtmf: any }) => void
    bye?: (callInstance: ICallInstance, data: { request: any }) => void
    mute?: (callInstance: ICallInstance, data: { request: any }) => void
    unmute?: (callInstance: ICallInstance, data: { request: any }) => void
  }
}

export interface ICallInstance {
  callInfo: {
    direction: string
    extension: string
    uuid: string
  }
  [key: string]: any
}

type IClient = new (options: Options, handlers: Handlers) => IClientInstance

export interface IClientInstance {
  setHandlers(handlers: Handlers): void
  call(number: string, calleeId: string): any
}

declare var Client: IClient
export { Client }
