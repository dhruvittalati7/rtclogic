import React, { useEffect } from 'react'
import classNames from 'classnames'
import WaveSurfer from 'wavesurfer.js'
import { PlayIcon, PauseIcon } from 'src/components/shared/ui/Icons'
import styles from './AudioSurfer.module.scss'

interface Props {
  url: string
}

export const AudioSurfer = ({ url }: Props) => {
  const [el, setEl] = React.useState<HTMLDivElement | null>(null)
  const playerRef = React.useRef<null | WaveSurfer>(null)
  const [duration, setDuration] = React.useState<number | null>(null)
  const [pos, setPos] = React.useState(0)
  const [played, setPlayed] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(false)

  useEffect(() => {
    if (!playerRef.current && el) {
      const wavesurfer = WaveSurfer.create({
        container: el,
        barWidth: 2,
        barHeight: 1,
        barGap: 1,
      })

      wavesurfer.on('waveform-ready', () => {
        alert(wavesurfer.getDuration())
        setDuration(wavesurfer.getDuration())
      })

      wavesurfer.load(url)
      playerRef.current = wavesurfer
      return () => wavesurfer.destroy()
    }
    return
  }, [el, url])

  const onProgress = ({ played, playedSeconds }: any) => {
    setPos(played * 100)
    setPlayed(playedSeconds)
  }

  const updatePosition = (pos: number) => { // todo need?
    if (playerRef.current) {
      setPos(pos)
      playerRef.current.seekTo(pos / 100)
    }
  }

  const togglePlay = (reset = false) => {
    if (!duration) {
      return
    }
    if (isPlaying) {
      reset && playerRef.current && playerRef.current.seekTo(0)
      setPlayed(0)
    }

    setIsPlaying(!isPlaying)
  }

  return (
    <div className={classNames(styles.root, styles.dark)}>
      <div className={styles.inner}>
        <div className={styles.actionButton} onClick={() => togglePlay()}>
          {
            isPlaying
              ? <PauseIcon className={styles.iconStop} />
              : <PlayIcon className={styles.iconPlay} />
          }
        </div>

        <div className={styles.right}>
          <div ref={setEl} className={styles.player} />
          {
            duration
              ? (
                <div className={styles.time}>
                  {playTime(duration, played, isPlaying)}
                </div>
              )
              : (
                <div className={styles.loading}>Voicemail loading...</div>
              )
          }
        </div>
      </div>
    </div>
  )
}

const playTime = (duration: number, played: number, isPlaying: boolean) => {
  return isPlaying
    ? `${formatTime(played)} of ${formatTime(duration)}`
    : `${formatTime(duration)}`
}

const formatTime = (secondsValue: number) => {
  const total = Math.ceil(secondsValue)
  const minutes = Math.floor(total / 60)
  const secondsRest = total - minutes * 60
  const seconds = secondsRest < 10 ? `0${secondsRest}` : secondsRest
  return `${minutes}:${seconds}`
}
