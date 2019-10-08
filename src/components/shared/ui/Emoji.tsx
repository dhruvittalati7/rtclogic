import 'src/assets/scss/emoji-dark.scss'
import React from 'react'
import { Picker, PickerProps } from 'emoji-mart'
import { ClickOutside } from 'src/components/shared/ClickOutside'

interface Props {
  onSelect: (emoji: string) => void
  onClose: () => void
  pickerProps?: PickerProps
}

export const Emoji = ({ onSelect, onClose, pickerProps }: Props) => (
  <ClickOutside onClick={onClose}>
    <Picker title={''} color={'#579AD5'} onClick={(emoji: any) => onSelect(emoji.native)} set={'apple'} {...pickerProps} />
  </ClickOutside>
)
