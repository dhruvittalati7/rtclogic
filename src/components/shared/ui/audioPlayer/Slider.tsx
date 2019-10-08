import 'rc-slider/assets/index.css'
import React from 'react'
import Slider from 'rc-slider'
import styles from './Slider.module.scss'

interface Props {
  position: number
  onChange: (position: number) => void
}

export const AudioPlayerSlider = ({ position, onChange }: Props) => (
  <div className={styles.root}>
    <Slider
      className={'audioSlider'}
      min={1}
      max={100}
      value={position}
      onChange={onChange}
    />
  </div>
)
