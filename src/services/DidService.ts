import { api } from 'src/classes/Api'
import { appGetState, appUpdateState } from 'src/store'
import { accountService } from 'src/services/AccountService'
import { roleService } from 'src/services/RoleService'

class DidService {
  private appGetState = appGetState
  private appUpdateState = appUpdateState
  private isSubscribed = false

  /**
   */
  public subscribe = () => {
    api.ready.then(() => {
      if (!this.isSubscribed) {
        api.call('dids', 'consume')
        api.on('dids:update', this.handleUpdate)
        this.isSubscribed = true
      }
    })
  }

  /**
   */
  private handleUpdate = (data: any) => {
    const status: string = data.status
    const numbersId: number[] = data.numbersId

    this.appUpdateState(s => {
      s.admin.numbers.list.items.forEach(number => {
        if (numbersId.includes(number.id)) {
          number.status = status
        }
      })

      if (status === 'released') {
        s.current.roles.forEach(role => {
          role.dids.providers.forEach(provider => {
            provider.numbers.filter(i => !numbersId.includes(i.id))
          })
        })
      }
    })

    accountService.initState().then(() => {
      roleService.initState().catch(window.logger.error)
    }).catch(window.logger.error)
  }
}

const didService = new DidService()
export { didService }
