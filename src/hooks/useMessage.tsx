import React from 'react'
import { debounce } from 'src/helpers/CommonHelper'
import { chatStateService } from 'src/services/ChatStateService'

export function useMessage(chatId: number): [string, (message: string) => void] {
  const [value, setValue] = React.useState<string>('')

  React.useEffect(() => {
    chatStateService.getChatState(chatId).then(chatState => {
      setValue(chatState ? chatState.t : '')
    })
  }, [chatId])

  const updateChatState = debounce(async (value: string) => {
    const state = (await chatStateService.getChatState(chatId)) || { t: '', s: [0, 0] }
    await chatStateService.setChatState(chatId, { ...state, t: value })
  }, 300)

  const updateValue = (value: string): void => {
    const p = updateChatState(value)
    p && p.catch(window.logger.error)
    setValue(value)
  }

  return [value, updateValue]
}
