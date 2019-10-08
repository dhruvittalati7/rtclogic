import { api } from 'src/classes/Api'
import { TAdminModel as TAdminRole, map } from 'src/models/admin/Role'
import { appUpdateState } from 'src/store'
import { accountService } from 'src/services/AccountService'
import { adminNumberService } from 'src/services/admin/NumberService'
import { TAccount } from 'src/models/Account'
import { unique } from 'src/helpers/CommonHelper'

class AdminRoleService {
  private appUpdateState = appUpdateState

  /**
   */
  public create = async (name: string, managerIds: number[], memberIds: number[], numberIds: number[]) => {
    const data: any = await api.call('roles', 'create', { name })
    const role = map(data)

    if (role.id) {
      await this.loadAdditionalData([role])
      await this.update(role, name, managerIds, memberIds, numberIds)
    }
  }

  /**
   */
  public update = async (role: TAdminRole, name: string, managerIds: number[], memberIds: number[], numberIds: number[]) => {
    const promises = []
    if (role.name !== name) {
      promises.push(api.call('roles', 'rename', { name, roleId: role.id }))
    }

    const allMemberIds = unique([...managerIds, ...memberIds])
    const roleAccountIds = this.getRoleAccounts(role).map(i => i.id)
    const filteredMemberIds = allMemberIds.filter(i => !roleAccountIds.includes(i))

    if (filteredMemberIds.length) {
      promises.push(this.assign(role.id, filteredMemberIds).catch(window.logger.error))
    }

    if (numberIds.length) {
      promises.push(adminNumberService.assign(role.id, numberIds).catch(window.logger.error))
    }

    await Promise.all(promises)

    if (managerIds.length) {
      await this.setManagers(role.id, managerIds)
    }
  }

  /**
   */
  public unsetManager = async (roleId: number) => {
    return this.setManagers(roleId, [])
  }

  /**
   */
  public loadRoles = async () => {
    this.appUpdateState(s => {
      s.admin.roles.loading = true
    })
    const data: any = await api.call('roles', 'search', { pattern: '%', count: 1000 })
    const roles = this.parseResponse(data)
    roles.sort((a, b) => b.id - a.id)
    await this.loadAdditionalData(roles)
    this.appUpdateState(s => {
      s.admin.roles.list = roles
      s.admin.roles.loading = false
    })
  }

  /**
   */
  public loadAdditionalData = async (roles: TAdminRole[]) => {
    const rolesId = roles.map(i => i.id)
    const groupedAccounts = await accountService.fetchGroupByRoleIds(rolesId)
    groupedAccounts.forEach((items, key) => {
      const role = roles.find(i => i.id === key)
      const manager = items.find(j => j.isManagerOfGroupId)

      if (role) {
        role.manager = manager || null
        role.members = items
        role.totalMembers = items.length
      }
    })
  }

  /**
   */
  private assign = async (roleId: number, accountsId: number[], isManager: boolean = false) => {
    const payload = {
      roleId,
      accountsId,
      isManager,
    }

    await api.call('roles', 'assign', payload)
  }

  /**
   */
  private setManagers = async (roleId: number, managerIds: number[]) => {
    const payload = {
      roleId,
      accountsId: managerIds,
    }

    await api.call('roles', 'managersSet', payload)
  }

  /**
   */
  private parseResponse = (data: any) => {
    const items: TAdminRole[] = []
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

  /**
   */
  private getRoleAccounts = (role: TAdminRole): TAccount[] => {
    return role.manager ? [role.manager, ...role.members] : [...role.members]
  }
}

export const adminRoleService = new AdminRoleService()
