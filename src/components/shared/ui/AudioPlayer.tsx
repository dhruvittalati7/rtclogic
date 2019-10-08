import React from 'react'
import classNames from 'classnames'
import ReactPlayer from 'react-player'
import { PlayIcon, PauseIcon } from 'src/components/shared/ui/Icons'
import { AudioPlayerSlider } from 'src/components/shared/ui/audioPlayer/Slider'
import { secondsToTimeString } from 'src/helpers/DateHelper'
import styles from './AudioPlayer.module.scss'

interface Props {
  url: string
}

export const AudioPlayer = ({ url }: Props) => {
  const [playerRef, setPlayerRef] = React.useState<ReactPlayer | null>(null)
  const [duration, setDuration] = React.useState<number | null>(null)
  const [pos, setPos] = React.useState(0)
  const [played, setPlayed] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(false)

  const onProgress = ({ played, playedSeconds }: any) => {
    setPos(played * 100)
    setPlayed(playedSeconds)
  }

  const updatePosition = (pos: number) => {
    if (playerRef) {
      setPos(pos)
      playerRef.seekTo(pos / 100)
    }
  }

  const togglePlay = (reset = false) => {
    if (!duration) {
      return
    }
    if (isPlaying) {
      reset && playerRef && playerRef.seekTo(0)
      setPlayed(0)
    }

    setIsPlaying(!isPlaying)
  }

  return (
    <div className={classNames(styles.root, styles.dark)}>
      <ReactPlayer
        ref={setPlayerRef}
        playing={isPlaying}
        url={url}
        width={0}
        height={0}
        progressInterval={100}
        className={styles.player}
        onDuration={setDuration}
        onProgress={onProgress}
        onEnded={() => togglePlay(true)}
      />

      <div className={styles.inner}>
        <div className={styles.actionButton} onClick={() => togglePlay()}>
          {
            isPlaying
              ? <PauseIcon className={styles.iconStop} />
              : <PlayIcon className={styles.iconPlay} />
          }
        </div>

        <div className={styles.right}>
          {
            duration
              ? (
                <>
                  <AudioPlayerSlider position={pos} onChange={updatePosition} />
                  <div className={styles.time}>
                    <div>
                      {secondsToTimeString(played)}
                    </div>
                    <div>
                      {secondsToTimeString(duration)}
                    </div>
                  </div>
                </>
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
