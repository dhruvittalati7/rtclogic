import React from 'react'
import classNames from 'classnames'
import KeyboardReact from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'
import Spanish from 'simple-keyboard-layouts/build/layouts/spanish'
import Russian from 'simple-keyboard-layouts/build/layouts/russian'
import French from 'simple-keyboard-layouts/build/layouts/french'
import Arabic from 'simple-keyboard-layouts/build/layouts/arabic'
import English from 'simple-keyboard-layouts/build/layouts/english'
import styles from './Keyboard.module.scss'

interface Props {
  setRef: (r: any) => any
  forwardRef: React.RefObject<KeyboardReact | undefined>
  value: string
  language: string
  setLanguage: (language: string) => void
  onChange: (value: string) => void
  onEnter?: () => void
  hideLanguageNames?: boolean
}

export const Keyboard = ({ setRef, forwardRef, value, language, setLanguage, onChange, onEnter, hideLanguageNames }: Props) => {
  const [layout, setLayout] = React.useState('default')

  const onLanguageChange = (language: string) => {
    if (forwardRef.current) {
      const keyboard = forwardRef.current
      keyboard.setOptions({ layout: getLanguage(language) })
    }
    setLanguage(language)
  }

  const onButtonPress = (button: string) => {
    button === '{enter}' && onEnter && onEnter()
    if (button === '{shift}' || button === '{lock}') {
      setLayout(layout === 'default' ? 'shift' : 'default')
    }
  }

  const renderLanguageButton = (flag: string, label: string, name: string) => (
    <div className={classNames(styles.item, language === name ? styles.active : '')} onClick={() => onLanguageChange(name)}>
      {flag} {!hideLanguageNames && label}
    </div>
  )

  return (
    <div className={classNames(styles.root, styles.dark)}>
      <div className={styles.keyboardTop}>
        {renderLanguageButton('🇺🇸', 'English', 'default')}
        {renderLanguageButton('🇷🇺', 'Русский', 'russian')}
        {renderLanguageButton('🇪🇸', 'España', 'spanish')}
        {renderLanguageButton('🇫🇷', 'Français', 'french')}
        {renderLanguageButton('🇸🇦', 'العربية', 'arabic')}
        {renderLanguageButton('🇮🇷', 'فارسی', 'farsi')}
      </div>
      <KeyboardReact
        keyboardRef={setRef}
        layoutName={layout}
        layout={getLanguage(language)}
        onChange={onChange}
        onKeyPress={onButtonPress}
      />
    </div>
  )
}

const getLanguage = (language: string) => {
  switch (language) {
    case 'russian':
      return Russian
    case 'spanish':
      return Spanish
    case 'french':
      return French
    case 'arabic':
      return Arabic
    case 'farsi':
      return farsi
    default:
      return English
  }
}

// https://mottie.github.io/Keyboard/docs/layouts2.html
const farsi = {
  default: [
    'پ 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
    '{tab} ض ص ث ق ف غ ع ه خ ح ج چ ژ \\',
    '{lock} ش س ي ب ل ا ت ن م گ ك {enter}',
    '{shift} ظ ط ز ر ذ د ئ و {shift}',
    '.com @ {space}',
  ],
  shift: [
    'ّ ! @ # $ % ^ & * ) ( _ + {bksp}',
    '{tab} &#1614 &#1611 &#1615; &#1612; ؛ × ÷ ‘ إ ل ؛ < > |',
    '{lock} ِ ٍ ] [ لأ أ ـ ، / : " {enter}',
    '{shift} ~ ْ } { لآ آ ’ , . ؟ {shift}',
    '.com @ {space}',
  ],
}
