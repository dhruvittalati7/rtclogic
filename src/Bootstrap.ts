/**
 * Application bootstrap
 * fetch initial state, verify tokens etc
 */
import dayjs from 'dayjs'
import config from 'src/config'
import * as Sentry from '@sentry/browser'
import utc from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { api } from 'src/classes/Api'
import { authService } from 'src/services/AuthService'
import { accountService } from 'src/services/AccountService'
import { chatService } from 'src/services/ChatService'
import { roleService } from 'src/services/RoleService'
import { dialService } from 'src/services/DialService'
import { campaignService } from 'src/services/CampaignService'
import { didService } from 'src/services/DidService'
import { EventEmitter } from 'src/classes/EventEmitter'
import { incrementOpenTabs } from 'src/utils/tabs'
import { layoutService } from 'src/services/LayoutService'

dayjs.extend(utc)
dayjs.extend(customParseFormat)

class Bootstrap extends EventEmitter {
  /**
   */
  public async init(): Promise<void> {
    // this.initSentry()
    incrementOpenTabs()
    this.askPermission().catch(window.logger.error)
    await api.init(config.wsUrl)

    api.on('AccessDenied', () => {
      layoutService.showNotification('Access Denied', 'error')
    })

    if (await authService.checkAuth()) {
      await this.onAfterLogin()
    }
  }

  public onAfterLogin = async () => {
    await accountService.sendPresence({ status: 'online' })
    const accountId = await accountService.loadMyAccount()
    if (accountId) {
      await this.initAccountsState()
      chatService.loadChatsWithMessages().catch(window.logger.error)
      campaignService.loadCampaigns().catch(window.logger.error)
      dialService.init().catch(window.logger.error)
      chatService.subscribe()
      accountService.subscribe()
      campaignService.subscribe()
      roleService.subscribe()
      didService.subscribe()
    }
  }

  private askPermission = () => {
    return new Promise((resolve, reject) => {
      const permissionResult = Notification.requestPermission(result => {
        resolve(result)
      })

      if (permissionResult) {
        permissionResult.then(resolve, reject)
      }
    }).then(permissionResult => {
      if (permissionResult !== 'granted') {
        throw new Error('We weren\'t granted permission.')
      }
    })
  }

  private initAccountsState = async () => {
    await roleService.initState()
    await accountService.initState()
    accountService.setAccountLoaded()
  }

  private initSentry() {
    if (process.env.NODE_ENV === 'production' && config.sentryDSN) {
      Sentry.init({
        dsn: config.sentryDSN,
      })
    }
  }
}

const bootstrap = new Bootstrap()
export { bootstrap }
