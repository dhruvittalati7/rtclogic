/* tslint:disable:prefer-template quotemark */
import React from 'react'
import classNames from 'classnames'
import { connect, Omit } from 'react-redux'
import { IState } from 'src/store'
import { TChat } from 'src/models/Chat'
import { TModel as TNumber } from 'src/models/dids/Number'
import KeyboardReact from 'react-simple-keyboard'
import { Emoji } from 'src/components/shared/ui/Emoji'
import { Keyboard } from 'src/components/shared/ui/Keyboard'
import { ButtonKeyboard } from 'src/components/shared/ui/ButtonKeyboard'
import { ButtonEmoji } from 'src/components/shared/ui/ButtonEmoji'
import { GsmCounter } from 'src/components/shared/ui/GsmCounter'
import { KeyboardHandler } from 'src/components/shared/KeyboardHandler'
import { ChatInputField } from './chatInput/Field'
import { ChatInputButtonSend } from './chatInput/ButtonSend'
import { useMessage } from 'src/hooks/useMessage'
import { ISendAttachment } from 'src/models/Message'
import { ButtonAttach } from 'src/components/shared/ui/ButtonAttach'
import { currentSourceNumbersSelector } from 'src/services/selectors/DidsSelectors'
import styles from './ChatInput.module.scss'
import { ChatInputAttachments } from 'src/components/shared/ui/chat/chatInput/Attachments'

interface Props {
  currentChat: TChat
  currentSourceNumbers: TNumber[]
  listenKeyboard: boolean
  currentAccountId: null | number
  showCounter: boolean
  autoFocus: boolean
  onSend: (message: string, attachments: ISendAttachment[]) => boolean
}
const ChatInput = ({ currentChat, currentSourceNumbers, currentAccountId, showCounter, autoFocus, listenKeyboard, onSend }: Props) => {
  const [value, setValue] = useMessage(currentChat.chatId)
  const [attachments, setAttachments] = React.useState<ISendAttachment[]>([])
  const [showEmoji, setShowEmoji] = React.useState(false)
  const [showKeyboard, setShowKeyboard] = React.useState(false)
  const [language, setLanguage] = React.useState('default')
  const [lengthValid, setLengthValid] = React.useState(true)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const sourceNumber = currentSourceNumbers.find(i => currentChat.srcNumber && i.id === currentChat.srcNumber.id)
  const showAttach = sourceNumber ? sourceNumber.capabilities.mms : true
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
      const part1 = value.substr(0, inputRef.current.selectionEnd)
      const part2 = value.substr(inputRef.current.selectionEnd)
      setValue(`${part1}${emoji}${part2}`)
      focusOnInput(() => {
        if (inputRef.current) {
          inputRef.current.scrollTop = inputRef.current.scrollHeight
        }
      })
    }
  }

  const onInputChange = (value: string) => {
    setValue(value)
    keyboardRef.current && keyboardRef.current.setInput(value)
  }

  const onKeyboardInputChange = (value: string) => {
    onInputChange(value)
    focusOnInput()
  }

  const clearInput = () => {
    setTimeout(() => {
      setValue('')
      keyboardRef.current && keyboardRef.current.clearInput()
    }, 10)
  }

  const doSend = () => {
    const clearedValue = value.trim()
    const canSend = !!clearedValue.length || !!attachments.length
    if (canSend && lengthValid) {
      onSend(clearedValue, attachments)
      clearInput()
      setAttachments([])
    }
  }

  const setRef = (r: any) => (keyboardRef.current = r)

  return (
    <div className={classNames(styles.root, styles.dark)}>
      <ChatInputAttachments attachments={attachments} onRemove={uid => setAttachments(attachments.filter(i => i.uid !== uid))} />

      <div className={styles.upper}>
        {showEmoji && (
          <div className={styles.emoji}>
            <Emoji onSelect={onEmojiSelect} onClose={() => setShowEmoji(false)} />
          </div>
        )}
        <div className={styles.left}>
          <ChatInputField inputRef={inputRef} autoFocus={autoFocus} value={value} onChange={onInputChange} />
        </div>

        <div className={styles.right}>
          {showAttach && <ButtonAttach isMMS={currentChat.numbers.length > 0} onUpload={a => setAttachments([...attachments, ...a])} />}
          <ButtonKeyboard onClick={() => setShowKeyboard(!showKeyboard)} />
          <ButtonEmoji onClick={() => setShowEmoji(!showEmoji)} />
          <ChatInputButtonSend disabled={!lengthValid} onClick={doSend} />
          {showCounter && <GsmCounter className={styles.counter} value={value} smsLimit={6} onValidate={setLengthValid} />}
        </div>
      </div>

      <div className={styles.bottom}>
        {showKeyboard && (
          <Keyboard
            forwardRef={keyboardRef}
            setRef={setRef}
            value={value}
            language={language}
            setLanguage={setLanguage}
            onChange={onKeyboardInputChange}
            onEnter={doSend}
          />
        )}
      </div>

      <KeyboardHandler active={!!value.trim().length && listenKeyboard} onMetaEnter={() => onInputChange(value + '\n')} onEnter={doSend} />
    </div>
  )
}

const mapStateToProps = (state: IState, ownProps: Omit<Props, 'listenKeyboard' | 'currentSourceNumbers'>): Props => ({
  listenKeyboard: !state.app.calls.openDial,
  currentSourceNumbers: currentSourceNumbersSelector(state.app),
  currentAccountId: ownProps.currentAccountId,
  currentChat: ownProps.currentChat,
  showCounter: ownProps.showCounter,
  autoFocus: ownProps.autoFocus,
  onSend: ownProps.onSend,
})

const ChatInputConnected = connect(mapStateToProps)(ChatInput)

export { ChatInputConnected as ChatInput }
