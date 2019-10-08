import { api } from 'src/classes/Api'
import { appGetState, appUpdateState } from 'src/store'
import { IAccountProfile, IAccountStatus, map, TAccount, toServer, TStatus } from 'src/models/Account'
import { extrasService } from 'src/services/ExtrasService'
import { objectListToArray } from 'src/helpers/CommonHelper'
import { roleService } from 'src/services/RoleService'
import { authService } from 'src/services/AuthService'

export const accountStatusList = ['pending', 'active', 'suspended', 'retired'] as TStatus[]

class AccountService {
  private appGetState = appGetState
  private appUpdateState = appUpdateState
  private isSubscribed = false

  /**
   */
  public setAccountLoaded = () => {
    this.appUpdateState(s => (s.current.hasLoaded = true))
  }

  /**
   */
  public initState = async () => {
    const accounts = await this.fetchAll()
    this.appUpdateState(s => (s.accounts.list = accounts))
  }

  /**
   */
  public subscribe = () => {
    api.ready.then(() => {
      if (!this.isSubscribed) {
        api.call('accounts', 'consume')
        api.on('accounts:presence', this.handlePresence)
        api.on('accounts:update', this.handleProfileUpdate)
        api.on('accounts:suspend', this.handleSuspend)
        this.isSubscribed = true
      }
    })
  }

  /**
   */
  public fetchAll = async () => {
    const payload = {
      pattern: '%',
      count: 500,
    }
    let accounts: TAccount[] = []
    const response = await api.call('accounts', 'search', payload)
    if (response.accounts) {
      accounts = response.accounts.map(map) as TAccount[]
      accounts = await this.addAdditionalData(accounts)
    }

    return accounts
  }

  /**
   */
  public update = async (accountId: number, data: IAccountProfile): Promise<boolean> => {
    try {
      const payload = toServer(data)
      await api.call('accounts', 'update', { ...payload, accountId })
      return true
    } catch (e) {
      window.logger.error(e)
      return false
    }
  }

  /**
   */
  public create = async (login: string, displayName: string, password: string): Promise<boolean> => {
    await api.call('accounts', 'create', { login, displayName, password })
    return true
  }

  /**
   */
  public addAdditionalData = async (accounts: TAccount[]): Promise<TAccount[]> => {
    const extAccounts = await this.addExtendedInfo(accounts)
    if (extAccounts) {
      const roles = await roleService.fetchByAccountId(extAccounts.map(i => i.id))
      extAccounts.forEach(account => {
        if (roles[account.id]) {
          const roleIds = Object.keys(roles[account.id])
          const roleId = parseInt(roleIds[0])
          const role = roles[account.id][roleId]
          if (role) {
            if (role.isManager) {
              account.isManagerOfGroupId = roleId
            }
            account.group = { id: roleId, name: role.name }
          }
        }
      })
    }
    await accountService.addAccountsStatuses(extAccounts)

    return extAccounts
  }

  /**
   * TODO refactor it all !!! What is addAdditionalData, addExtendedInfo etc?!
   */
  public loadMyAccount = async (): Promise<number | null> => {
    let result = null
    const state = this.appGetState()
    if (state.current.accountId) {
      const account = await this.fetchById(state.current.accountId)
      if (account) {
        const accounts = await this.addAdditionalData([account])
        const myAccount = accounts[0]
        await accountService.addAccountsStatuses([myAccount])
        result = myAccount.id
        this.appUpdateState(s => (s.current.account = myAccount))
        extrasService.initFrom(account)
      }
    }

    return result
  }

  /**
   */
  public loadAccountsByRoleIds = async (ids: number[]) => {
    const accounts = await this.fetchByRoleIds(ids)
    const result = await this.addExtendedInfo(accounts)
    if (result) {
      this.appUpdateState(s => (s.accounts.list = result))
    }
  }

  /**
   */
  public fetchById = async (id: number): Promise<TAccount | undefined> => {
    const items: TAccount[] = await this.fetchByIds([id])
    return items.length && items[0].id === id ? items[0] : undefined
  }

  /**
   */
  public fetchByIds = async (ids: number[]): Promise<TAccount[]> => {
    let result: TAccount[] = []
    if (ids.length) {
      const data: any = await api.call('accounts', 'getById', { accountsId: ids })
      result = Object.keys(data).map(key => map({ ...data[key], id: key }))
    }
    return result
  }

  /**
   */
  public fetchGroupByRoleIds = async (ids: number[]): Promise<Map<number, TAccount[]>> => {
    const payload = {
      rolesId: ids,
    }
    const data: any = await api.call('accounts', 'getByRoleId', payload)
    const result = new Map<number, TAccount[]>()
    for (const roleKey in data) {
      const accountsFromRole = objectListToArray(data[roleKey])
      const accounts = accountsFromRole.map(i => {
        const accountFromRole = accountsFromRole.find(afr => afr.id === i.id)
        if (accountFromRole && accountFromRole.isManager) {
          i.isManagerOfGroupId = parseInt(roleKey)
        }
        return i
      })
      result.set(parseInt(roleKey), accounts)
    }
    return result
  }

  /**
   */
  public fetchByRoleIds = async (ids: number[]): Promise<TAccount[]> => {
    let result: TAccount[] = []
    const groupedAccounts = await this.fetchGroupByRoleIds(ids)
    groupedAccounts.forEach(i => {
      result = [...result, ...i]
    })
    return result
  }

  /**
   */
  public addAccountsStatuses = async (accounts: TAccount[]) => {
    const data: IAccountStatus[] = (await api.call('accounts', 'presenceGet', { accountsId: accounts.map(i => i.id) })) as IAccountStatus[]
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const account = accounts.find(i => i.id === parseInt(key))
        if (account && data[key]) {
          account.status = data[key].status
        }
      }
    }
  }

  /**
   */
  public loadAccountsStatuses = async (ids: number[]) => {
    const data: any = await api.call('accounts', 'presenceGet', { accountsId: ids })
    const items: IAccountStatus[] = []
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        items.push({ accountId: parseInt(key), ...data[key] })
      }
    }
    this.setAccountsStatuses(items)
  }

  /**
   */
  public sendPresence = async (status: IAccountStatus) => {
    api.call('accounts', 'presenceSet', status)
  }

  /**
   */
  public setPresence = async (status: IAccountStatus) => {
    this.sendPresence(status).catch(window.logger.error)
    this.appUpdateState(s => {
      s.current.account.status = status.status
    })
  }

  /**
   */
  public getByExtension = (extension: string) => {
    return appGetState().accounts.list.find(i => i.extension === extension)
  }

  /**
   */
  private addExtendedInfo = async (items: TAccount[]): Promise<TAccount[]> => {
    let result
    const ids = items.map(i => i.id)
    const accounts = await this.fetchByIds(ids)
    if (accounts) {
      result = items
        .map(i => {
          const account = accounts.find(a => a.id === i.id)
          if (account) {
            return { ...i, ...account }
          }
          return null
        })
        .filter(i => i !== null) as TAccount[]
    }
    return result ? result : items
  }

  /**
   */
  private setAccountsStatuses = (statuses: IAccountStatus[]) => {
    this.appUpdateState(s => {
      statuses.forEach(status => {
        const account = s.accounts.list.find(a => typeof status.accountId === 'number' && a.id === status.accountId)
        if (account) {
          account.status = status.status
        }

        if (s.current.account.id === status.accountId) {
          s.current.account.status = status.status
        }
      })
    })
  }

  /**
   */
  private handlePresence = (data: any) => {
    this.setAccountsStatuses([{ ...data }])
  }

  /**
   */
  private handleProfileUpdate = (data: any) => {
    this.appUpdateState(s => {
      const accountId = data.accountId
      delete data['accountId']
      const account = s.accounts.list.find(i => i.id === accountId)
      const member = s.admin.members.list.find(i => i.id === accountId)

      if (account) {
        account.profile = { ...account.profile, ...data }
      }

      if (member) {
        member.profile = { ...member.profile, ...data }
      }

      if (s.current.account.id === accountId) {
        s.current.account.profile = { ...s.current.account.profile, ...data }
      }
    })
  }

  /**
   */
  private handleSuspend = (data: any) => {
    const accountsId = data.accountsId as number[]
    if (accountsId.includes(this.appGetState().current.accountId)) {
      authService.logout()
    }

    this.appUpdateState(s => {
      s.accounts.list.forEach(account => {
        if (accountsId.includes(account.id)) {
          account.profile.status = 'suspended'
        }
      })
      s.admin.members.list.forEach(member => {
        if (accountsId.includes(member.id)) {
          member.profile.status = 'suspended'
        }
      })
    })
  }
}

const accountService = new AccountService()
export { accountService }
