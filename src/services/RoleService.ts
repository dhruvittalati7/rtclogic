import { api } from 'src/classes/Api'
import { TRole, map } from 'src/models/Role'
import { appUpdateState, appGetState } from 'src/store'

class RoleService {
  private appUpdateState = appUpdateState
  private appGetState = appGetState
  private isSubscribed = false

  public initState = async () => {
    const accountId = this.appGetState().current.accountId
    if (accountId) {
      await this.loadByAccountId(accountId)
    }
  }

  /**
   */
  public subscribe = () => {
    api.ready.then(() => {
      if (!this.isSubscribed) {
        api.call('roles', 'consume')
        api.on('roles:rename', this.handleRolesRename)
        api.on('roles:managers', this.handleRolesManagers)
        this.isSubscribed = true
      }
    })
  }

  public fetchByAccountId = async (ids: number[]) => {
    const payload = { accountsId: ids }
    return await api.call('roles', 'getByAccountId', payload)
  }

  public hasRoles = async (id: number) => {
    const data = this.parseResponse(await this.fetchByAccountId([id]))
    return data.length > 0
  }

  private loadByAccountId = async (id: number) => {
    const data: any = await this.fetchByAccountId([id])

    this.appUpdateState(s => s.current.roles = this.parseResponse(data))
  }

  private parseResponse = (data: any) => {
    const items: TRole[] = []
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        for (const itemKey in data[key]) {
          if (data[key].hasOwnProperty(itemKey)) {
            const account = map({ id: itemKey, ...data[key][itemKey] })
            items.push(account)
          }
        }
      }
    }

    return items
  }

  private handleRolesRename = (data: any) => {
    const roleId: number = data.roleId
    const name: string = data.name

    this.appUpdateState(s => {
      const roles = [...s.current.roles, ...s.admin.roles.list].filter(i => i.id === roleId)
      roles.forEach(role => {
        role.name = name
      })
    })
  }

  private handleRolesManagers = (data: any) => {
    const roleId: number = data.roleId
    const accountsId: number[] = data.accountsId

    this.appUpdateState(s => {
      const accounts = [s.current.account, ...s.admin.members.list]
      accounts.forEach(account => {
        if (accountsId.includes(account.id)) {
          account.isManagerOfGroupId = roleId
        } else if (account.isManagerOfGroupId === roleId) {
          account.isManagerOfGroupId = 0
        }
      })

      s.current.roles.forEach(role => {
        if (role.id === roleId) {
          role.isManager = accountsId.includes(s.current.accountId)
        }
      })

      const manager = s.admin.members.list.find(i => accountsId.includes(i.id))
      s.admin.roles.list.forEach(role => {
        if (role.id === roleId) {
          role.manager = manager || null
        }
      })
    })
  }
}

export const roleService = new RoleService()
