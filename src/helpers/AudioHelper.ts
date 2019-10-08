import sms from 'src/assets/sound/sms.mp3'
import call from 'src/assets/sound/call.mp3'
import answer from 'src/assets/sound/answer2.mp3'

declare interface IAudioStorage {
  [key: string]: HTMLAudioElement
}

const audioStorage: IAudioStorage = {
  sms: new Audio(sms),
  call: new Audio(call),
  answer: new Audio(answer),
}

export const play = (name: string, loop: boolean = false): (() => void) => {
  let stop = () => {}
  if (audioStorage[name]) {
    audioStorage[name].loop = loop
    audioStorage[name].play().catch(window.logger.error)
    stop = () => audioStorage[name].pause()
  }
  return stop
}
