import { appUpdateState } from 'src/store'
import { accountService } from 'src/services/AccountService'
import { api } from 'src/classes/Api'
import { TAccount } from 'src/models/Account'
import { adminRoleService } from 'src/services/admin/RoleService'

class AdminMemberService {
  private appUpdateState = appUpdateState

  /**
   */
  public loadMembers = async () => {
    this.appUpdateState(s => {
      s.admin.members.loading = true
    })

    const members = await accountService.fetchAll()

    this.appUpdateState(s => {
      s.admin.members.loading = false
      s.admin.members.list = members
    })
  }

  /**
   */
  public suspend = async (account: TAccount): Promise<boolean> => {
    try {
      if (account.isManagerOfGroupId) {
        adminRoleService.unsetManager(account.isManagerOfGroupId).catch(window.logger.error)
      }

      const accountsId = [account.id]
      await api.call('accounts', 'suspend', { accountsId })
      return true
    } catch (e) {
      window.logger.error(e)
      return false
    }
  }
}

const adminMemberService = new AdminMemberService()
export { adminMemberService }
