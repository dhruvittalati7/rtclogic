import { EventEmitter } from './EventEmitter'
import { Client, IClientInstance, Options } from 'src/classes/Pbx'

class Caller extends EventEmitter {
  public static EVENT_CALL_IN = 'event_call_in'
  public static EVENT_CALL_CANCELED = 'event_call_canceled'
  public static EVENT_CALL_ACCEPTED = 'event_call_accepted'

  private client?: IClientInstance

  /**
   * @constructor
   */
  constructor(login: string, password: string, domainName: string) {
    super()
    const user = `${login}@${domainName}`
    const options = pbxOptions(user, password, domainName)
    this.createClient(options)
  }

  /**
   */
  public call = (toNumber: string, fromNumber: string) => {
    if (toNumber && this.client) {
      return this.client.call(toNumber, fromNumber)
    }
    return null
  }

  /**
   */
  private createClient = (options: Options) => {
    this.client = new Client(options, {
      ready() {
        window.logger.info('PBX.Client ready')
      },
      call: {
        created: call => {
          window.logger.info('PBX.Client created', { call })
          if (call.callInfo.direction === 'inbound') {
            this.fire(Caller.EVENT_CALL_IN, { call })
          }
        },
        progress: (call, data) => {
          window.logger.info('PBX.Client progress', { call, data })
        },
        accepted: (call, data) => {
          window.logger.info('PBX.Client accepted', { call, data })
          this.fire(Caller.EVENT_CALL_ACCEPTED, { call })
        },
        rejected: (call, data) => {
          window.logger.info('PBX.Client rejected', { call, data })
          this.fire(Caller.EVENT_CALL_CANCELED, { call })
        },
        failed: (call, data) => {
          window.logger.info('PBX.Client failed', { call, data })
          this.fire(Caller.EVENT_CALL_CANCELED, { call })
        },
        terminated: (call, data) => {
          window.logger.info('PBX.Client terminated', { call, data })
          this.fire(Caller.EVENT_CALL_CANCELED, { call })
        },
        cancel: call => {
          window.logger.info('PBX.Client cancel', { call })
          this.fire(Caller.EVENT_CALL_CANCELED, { call })
        },
        replaced: (call, data) => {
          window.logger.info('PBX.Client replaced', { call, data })
        },
        dtmf: (call, data) => {
          window.logger.info('PBX.Client dtmf', { call, data })
        },
        bye: (call, data) => {
          window.logger.info('PBX.Client bye', { call, data })
        },
      },
    })
  }
}

function pbxOptions(user: string, password: string, domainName: string) {
  return {
    user,
    password,
    register: true,
    wsServers: [`wss://${domainName}:7443`],
    iceServers: [{ urls: `stun:${domainName}` }],
    debug: true,
    hasAudio: true,
    hasVideo: false,
    iceCheckingTimeout: 200,
  }
}

export { Caller }
