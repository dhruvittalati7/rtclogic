import { appUpdateState } from 'src/store'
import { storageService } from 'src/services/StorageService'
import { api } from 'src/classes/Api'
import { EventEmitter } from 'src/classes/EventEmitter'
import { accountService } from 'src/services/AccountService'
import { roleService } from 'src/services/RoleService'

class AuthService extends EventEmitter {
  private appUpdateState = appUpdateState

  /**
   * @public
   * @return {Promise<*>}
   */
  public checkAuth = async (): Promise<boolean> => {
    const login = storageService.get('login')
    const token = storageService.get('token')
    if (login && token) {
      const performLogin = await this.login(login, token, true, true)
      if (performLogin) {
        performLogin()
        return true
      }
    }
    return false
  }

  /**
   * @public
   * @param {string} login
   * @param {string} password
   * @param {boolean} rememberMe
   * @param {boolean} isRestore
   * @return {Promise<*>}
   */
  public login = async (login: string, password: string, rememberMe = false, isRestore = false): Promise<Function | null> => {
    try {
      const data: any = await api.call('auth', 'login', { login, password })
      if (data.isAuthorized) {
        if (!data.isAdmin && !await roleService.hasRoles(data.accountId)) {
          this.appUpdateState(s => {
            s.system.authError = true
            s.system.errorMessage = 'A group manager must assign your account to a group for you to have access to Tirade'
          })

        } else {
          return () => {
            if (!isRestore) {
              storageService.set('login', rememberMe ? login : '')
              storageService.set('token', rememberMe ? data.token : '')
            }

            this.appUpdateState(s => {
              s.system.authError = false
              s.system.errorMessage = ''
              s.system.token = isRestore ? password : data.token
              s.current.accountId = parseInt(data.accountId) || 0
              s.current.isAdmin = data.isAdmin || false
            })

            this.fire('login')
          }
        }
      }
    } catch (e) {
      if (e.code === 4000 && !isRestore) {
        this.appUpdateState(s => s.system.authError = true)
      }
    }

    return null
  }

  public signUp = async (name: string, email: string): Promise<Function | null> => {
    try {
      await api.call('auth', 'signup', { name, email })
      // TO DO what should be next ?
    } catch (e) {
      if (e.code === 4001) {
        this.appUpdateState(s => s.system.authError = true)
      }
    }

    return null
  }

  /**
   * @public
   */
  public logout = () => {
    accountService.sendPresence({ status: 'away' }).catch(window.logger.error)
    storageService.remove('login')
    storageService.remove('token')
    window.location.reload()
  }
}

const authService = new AuthService()
export { authService }
