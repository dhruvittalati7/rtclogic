import React from 'react'
import { toast, ToastOptions } from 'react-toastify'
import { appGetState, appNextState, appUpdateState } from 'src/store'
import { initialState } from 'src/store/state'

type NotificationType = 'default' | 'error' | 'success'

class LayoutService {
  private appGetState = appGetState
  private appNextState = appNextState
  private appUpdateState = appUpdateState

  /**
   */
  public confirm = (
    title: string,
    content: any,
    actionLabel: string = 'OK',
    action: () => void = () => {},
    cancel: boolean = true
  ) => {
    this.appUpdateState(s => {
      s.layout.dialog = { title, content, actionLabel, action, cancel, open: true }
    })
  }

  /**
   */
  public closeDialog = () => {
    this.appUpdateState(s => (s.layout.dialog = { ...initialState.layout.dialog }))
  }

  /**
   */
  public showNotification = (content: React.ReactNode, type: NotificationType = 'success', duration = 5000) => {
    const options: ToastOptions = { autoClose: duration }
    switch (type) {
      case 'success':
        toast.success(content, options)
        break
      case 'error':
        toast.error(content, options)
        break
      case 'default':
      default:
        toast(content, options)
        break
    }
  }
}

export const layoutService = new LayoutService()
