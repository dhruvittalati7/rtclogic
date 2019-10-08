import { appGetState, appUpdateState } from 'src/store'
import { createQueryPattern, debounce } from 'src/helpers/CommonHelper'
import { TAccount, map } from 'src/models/Account'
import { api } from 'src/classes/Api'
import { accountService } from 'src/services/AccountService'

class AccountSearchService {
  /**
   */
  public performSearch = debounce(async (query: string, callback: (items: TAccount[] | undefined) => Promise<void>) => {
    if (!query) {
      callback([]).catch(window.logger.error)
      return
    }

    let result
    try {
      const pattern = query
        .split(' ')
        .reduce(
          (a, i) => {
            if (i.length > 0) {
              a.push(`%${i}%`)
            }
            return a
          },
          [] as string[]
        )
        .join(' ')

      const payload = { pattern, count: 20 }
      const response = await api.call('accounts', 'search', payload)
      if (response.accounts) {
        result = response.accounts.map(map)
      }
    } catch (e) {}
    callback(result).catch(window.logger.error)
  }, 500)

  private appGetState = appGetState
  private appUpdateState = appUpdateState

  public setSearchQuery = (query: string = '') => {
    this.appUpdateState(s => {
      s.accounts.searchQuery = query
      s.accounts.searchLoading = !!query
      s.accounts.searchList = []
    })

    const p = this.performSearch(query, async (items: TAccount[] | undefined) => {
      if (items && items.length) {
        const accounts = await accountService.addAdditionalData(items)
        this.appUpdateState(s => {
          s.accounts.searchList = accounts
          s.accounts.searchLoading = false
        })
      } else {
        this.appUpdateState(s => {
          s.accounts.searchList = []
          s.accounts.searchLoading = false
        })
      }
    })
    p && p.catch(window.logger.error)
  }

  public searchCurrentRoleAccounts = (query: string): TAccount[] => {
    const pattern = createQueryPattern(query)
    return this.appGetState().accounts.list.filter(i => {
      if (i.profile.displayName.search(pattern) !== -1) {
        return i
      }

      return null
    }).filter(i => i !== null)
  }
}

const accountSearchService = new AccountSearchService()
export { accountSearchService }
