import { UA } from 'sip.js'

// eslint-disable-next-line
const uuid = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4))).toString(16))

class Client {
  constructor(options, handlers) {
    let self = this
    let defaultIceServers = [{ urls: 'stun:stun.l.google.com:19302' }]
    self.calls = []

    self.ua = new UA({
      uri: options.user || 'dummy@example.com',
      password: options.password || '',
      transportOptions: {
        wsServers: options.wsServers || [],
        traceSip: typeof options.debug !== 'undefined' ? options.debug : false,
      },
      sessionDescriptionHandlerFactoryOptions: {
        constraints: {
          audio: typeof options.hasAudio !== 'undefined' ? options.hasAudio : true,
          video: typeof options.hasVideo !== 'undefined' ? options.hasVideo : false,
        },
        peerConnectionOptions: {
          iceCheckingTimeout: options.iceCheckingTimeout || 2000,
          rtcConfiguration: {
            iceServers: options.iceServers || defaultIceServers,
          },
        },
      },
      register: typeof options.register !== 'undefined' ? options.register : false,
      registerOptions: { expires: 3600 },
      userAgentString: 'TiBX WebRTC Client/1.0',
      autostart: true,
    })

    if (options.debug) window.logger.debug('TiBX: Transport created')
    self.setHandlers(handlers)
    self.ua.on('invite', session => {
      session.callInfo = { direction: 'inbound', uuid: uuid() }
      self.registerCall_(session)
    })
  }

  setHandlers(handlers) {
    let self = this
    handlers.ready.bind(self)()
    if (typeof handlers.call == 'undefined') handlers.call = {}
    self.handlers = handlers
  }

  call(extension, calleeId) {
    let self = this
    let headers = []
    if (calleeId) headers.push(`X-Callee-Id:${calleeId}`)
    let callInstance = self.ua.invite(extension, { extraHeaders: headers })

    callInstance.callInfo = { direction: 'outbound', extension, uuid: uuid() }
    self.registerCall_(callInstance)
    return callInstance
  }

  registerCall_(callInstance) {
    let self = this
    if (self.handlers.call.created) self.handlers.call.created(callInstance, {})

    callInstance.on('trackAdded', () => {
      let hasSomething = false
      var AudioContext =
        window.AudioContext || // Default
        window.webkitAudioContext || // Safari and old versions of Chrome
        false

      if (AudioContext) {
        if (!self.audioContext) self.audioContext = new AudioContext()
      } else {
        alert(
          'Sorry, but the Web Audio API is not supported by your browser. Please, consider upgrading to the latest version or downloading Google Chrome or Mozilla Firefox'
        )
      }

      let pc = callInstance.sessionDescriptionHandler.peerConnection

      if (typeof callInstance.MediaStream_ === 'undefined') {
        callInstance.MediaStream_ = new MediaStream()
      }

      pc.getReceivers().forEach(function(receiver) {
        callInstance.MediaStream_.addTrack(receiver.track)
        hasSomething = true
      })

      if (hasSomething) {
        callInstance.audio = document.createElement('video')
        callInstance.audio.autoplay = true
        callInstance.audio.srcObject = callInstance.MediaStream_
        //callInstance.audio.play()
        callInstance.MediaSource_ = self.audioContext.createMediaElementSource(callInstance.audio)
        callInstance.MediaSource_.connect(self.audioContext.destination)
        window.logger.debug('TiBX: play audio', callInstance.MediaSource_)
      }
    })

    callInstance.on('progress', response => {
      if (self.handlers.call.progress) self.handlers.call.progress(callInstance, { response })
    })
    callInstance.on('accepted', data => {
      if (self.handlers.call.accepted) self.handlers.call.accepted(callInstance, { data })
    })
    callInstance.on('rejected', (response, cause) => {
      if (self.handlers.call.rejected) self.handlers.call.rejected(callInstance, { response, cause })
    })
    callInstance.on('failed', (response, cause) => {
      if (self.handlers.call.failed) self.handlers.call.failed(callInstance, { response, cause })
    })
    callInstance.on('terminated', (response, cause) => {
      if (self.handlers.call.terminated) self.handlers.call.terminated(callInstance, { response, cause })
    })
    callInstance.on('cancel', () => {
      if (self.handlers.call.cancel) self.handlers.call.cancel(callInstance, {})
    })
    callInstance.on('replaced', newObject => {
      if (self.handlers.call.replaced) self.handlers.call.replaced(callInstance, { newObject })
      self.unregisterCall_(callInstance)
      self.registerCall_(newObject)
    })
    callInstance.on('dtmf', (request, dtmf) => {
      if (self.handlers.call.dtmf) self.handlers.call.dtmf(callInstance, { request, dtmf })
    })
    callInstance.on('bye', request => {
      if (self.handlers.call.bye) self.handlers.call.bye(callInstance, { request })
    })
    self.calls.push(callInstance)
  }

  unregisterCall_(callInstance) {
    let self = this
    let index = self.calls.indexOf(callInstance)
    if (index > -1) {
      self.calls.splice(index, 1)
    }
  }
}

export { Client }
