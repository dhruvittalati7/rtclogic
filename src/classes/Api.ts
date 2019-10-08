import uuid4 from 'uuid/v4'
import { EventEmitter } from 'src/classes/EventEmitter'

const version = 1.0
let ws: WebSocket
let delayAttempt: number
let readyResolver: Function = () => {}

interface TRequest {
  resolve: Function
  reject: Function
  header: TObjectAny
  payload: TObjectAny
}
const requests: { [key: string]: TRequest } = {}

class Api extends EventEmitter {
  public ready = new Promise((r: Function) => {
    readyResolver = r
  })
  private wsUrl = ''

  /**
   * @param wsUrl
   */
  public init(wsUrl: string) {
    this.wsUrl = wsUrl
    this.connect()
    return this.ready
  }

  /**
   * @public
   */
  public connect() {
    if (this.wsUrl) {
      window.logger.debug('Api.connect', this.wsUrl)
      ws = new WebSocket(this.wsUrl)
      ws.addEventListener('open', this.handleOpen)
      ws.addEventListener('close', this.handleClose)
      ws.addEventListener('error', this.handleError)
      ws.addEventListener('message', this.handleMessage)
    }
  }

  /**
   * @public
   */
  public destroy() {
    if (ws) {
      ws.removeEventListener('open', this.handleOpen)
      ws.removeEventListener('close', this.handleClose)
      ws.removeEventListener('error', this.handleError)
      ws.removeEventListener('message', this.handleMessage)
    }
  }

  /**
   * @public
   * @param service
   * @param request
   * @param payload
   * @return Promise<*>
   */
  public call(service: string, request: string, payload: TObjectAny = {}): TObjectAny {
    const uuid = uuid4()
    const header = { uuid, service, request }
    this.send(header, payload)
    return new Promise((resolve, reject) => {
      requests[uuid] = { resolve, reject, header, payload }
    })
  }

  /**
   * @private
   * @param {Object} header
   * @param {Object} payload
   */
  private send(header: TObjectAny, payload: TObjectAny = {}) {
    const message = JSON.stringify({ version, header, payload })

    this.ready
      .then(() => {
        ws.send(message)
      })
      .catch(window.logger.error)
  }

  private handleOpen = () => {
    window.logger.debug('WS connected')
    readyResolver()
    this.fire('open')
    delayAttempt = 0
  }

  private handleClose = () => {
    window.logger.debug('WS disconnected. Reconnect attempt.')
    this.fire('close')
    this.destroy()
    if (delayAttempt) {
      setTimeout(() => this.connect(), delayAttempt)
    } else {
      delayAttempt = 2000
      this.connect()
    }
  }

  private handleError = (e: any) => {
    this.fire('error')
    window.logger.error('WS error', e)
  }

  private handleMessage = (e: any) => {
    try {
      const data = JSON.parse(e.data) || {}
      if (data.header) {
        const uuid = data.header.uuid
        const payload = data.payload || {}

        if (payload.error || payload.warn) {
          if (!payload.warn) {
            if (payload.error && payload.error.code === 4005) {
              this.fire('AccessDenied')
            }
            window.logger.error('Api.handleMessage error', {
              request: { header: requests[uuid].header, payload: requests[uuid].payload },
              response: { payload, header: data.header },
            })
          }

          if (requests[uuid]) {
            payload.warn
              ? this.resolveRequest(data)
              : requests[uuid].reject(payload)
            delete requests[uuid]
          }

        } else if (data.header.type === 'event') {
          const eventName = `${data.header.service}:${data.header.event}`
          this.log(`Api event: ${eventName}`, { payload })
          this.fire(eventName, payload)

        } else if (data.header.type === 'response' && requests[uuid]) {
          this.resolveRequest(data)
        }
      } else {
        window.logger.error('Api.handleMessage incorrect response', data)
      }
    } catch (error) {
      window.logger.error(error)
    }
  }

  private resolveRequest = (data: TObjectAny) => {
    const { payload = {}, header: { uuid } } = data
    this.log(`${new Date().toISOString()} Api call: ${data.header.service}:${data.header.response}`, {
      request: { header: requests[uuid].header, payload: requests[uuid].payload },
      response: { payload, header: data.header },
    })
    requests[uuid].resolve(payload)
    delete requests[uuid]
  }

  private log = (groupName: string, data: any) => {
    // tslint:disable-next-line:no-console
    console.groupCollapsed(groupName)
    // tslint:disable-next-line:no-console
    Object.keys(data).forEach(k => console.log(k, JSON.parse(JSON.stringify(data[k]))))
    // tslint:disable-next-line:no-console
    console.groupEnd()
  }
}

const api = new Api()
// @ts-ignore
window.api = api
export { api }
