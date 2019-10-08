import React from 'react'
import classNames from 'classnames'
import KeyboardReact from 'react-simple-keyboard'
import { Keyboard } from 'src/components/shared/ui/Keyboard'
import { FormFieldTextarea, Props as FormFieldTextareaProps } from 'src/components/shared/ui/form/formField/Textarea'
import { ButtonKeyboard } from 'src/components/shared/ui/ButtonKeyboard'
import { ButtonEmoji } from 'src/components/shared/ui/ButtonEmoji'
import { GsmCounter } from 'src/components/shared/ui/GsmCounter'
import { Emoji } from 'src/components/shared/ui/Emoji'
import styles from './FieldMessage.module.scss'
import { clearPhoneNumberValue } from 'src/helpers/PhoneHelper'

interface Props extends FormFieldTextareaProps {
  targetNumbers: string[],
  sourceNumberId: number
}

export const CampaignsFormFieldMessage = (props: Props) => {
  const [showEmoji, setShowEmoji] = React.useState(false)
  const [showKeyboard, setShowKeyboard] = React.useState(false)
  const [language, setLanguage] = React.useState('default')
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const keyboardRef = React.useRef<KeyboardReact>()

  const getVirtualKeyboardInputCaretPosition = (): number | undefined => {
    if (keyboardRef.current) {
      // keyboardRef.current.getInput().length this is Safari workaround. Because keyboardRef.current.caretPosition returns 0 on first key click
      return keyboardRef.current.caretPosition || keyboardRef.current.getInput().length || 0
    }

    return
  }

  const focusOnInput = (cb?: any) => {
    setTimeout(() => {
      if (inputRef.current) {
        let caretPosition = inputRef.current.selectionStart
        inputRef.current.focus()
        caretPosition = getVirtualKeyboardInputCaretPosition() || caretPosition || 0
        inputRef.current.setSelectionRange(caretPosition, caretPosition)
        cb && cb()
      }
    }, 10)
  }

  const onEmojiSelect = (emoji: string) => {
    if (inputRef.current) {
      setShowEmoji(false)
      const part1 = props.value.substr(0, inputRef.current.selectionEnd)
      const part2 = props.value.substr(inputRef.current.selectionEnd)
      props.onChange(`${part1}${emoji}${part2}`)
      focusOnInput(() => {
        if (inputRef.current) {
          inputRef.current.scrollTop = inputRef.current.scrollHeight
        }
      })
    }
  }

  const onInputChange = (value: string) => {
    props.onChange(value)
    keyboardRef.current && keyboardRef.current.setInput(value)
  }

  const onKeyboardInputChange = (value: string) => {
    onInputChange(value)
    focusOnInput()
  }

  const setRef = (r: any) => (keyboardRef.current = r)

  return (
    <div className={classNames(styles.root, styles.dark)}>
      <FormFieldTextarea
        label={props.label}
        placeholder={props.placeholder}
        readonly={props.readonly}
        name={props.name}
        error={props.error}
        value={props.value}
        onChange={onInputChange}
        onBlur={props.onBlur}
        textareaProps={{ className: styles.textarea, ref: inputRef }}
        hintBottomRight={(
          <GsmCounter
            value={props.value}
            onlySmsCount={props.readonly}
            smsLimit={6}
            calcPrice={{
              targetNumbers: props.targetNumbers.map(clearPhoneNumberValue),
              sourceNumberId: props.sourceNumberId,
            }}
          />
        )}
      />

      {!props.readonly && (
        <div className={styles.actions}>
          <ButtonKeyboard onClick={() => setShowKeyboard(!showKeyboard)} />
          <ButtonEmoji onClick={() => setShowEmoji(!showEmoji)} />
        </div>
      )}

      {showEmoji && (
        <div className={styles.emoji}>
          <Emoji onSelect={onEmojiSelect} onClose={() => setShowEmoji(false)} pickerProps={{ style: { width: '100%' } }} />
        </div>
      )}

      {showKeyboard && (
        <div className={classNames(styles.keyboard, 'MiniKeyboard')}>
          <Keyboard
            hideLanguageNames
            forwardRef={keyboardRef}
            setRef={setRef}
            value={props.value}
            language={language}
            setLanguage={setLanguage}
            onChange={onKeyboardInputChange}
            onEnter={() => onKeyboardInputChange(`${props.value}${'\n'}`)}
          />
        </div>
      )}
    </div>
  )
}
