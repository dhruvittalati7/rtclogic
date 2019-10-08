import { TAdminModel as TAdminNumber } from 'src/models/admin/Number'
import { debounce } from 'src/helpers/CommonHelper'
import { adminNumberService } from 'src/services/admin/NumberService'
import { appUpdateState } from 'src/store'

class AdminNumberSearchService {
  public performSearch = debounce(async (query: string, callback: (items: TAdminNumber[] | undefined) => void) => {
    if (!query) {
      return
    }

    const numbers = await adminNumberService.fetch({ page: 1, size: 20, status: 'available' })
    const result = numbers.items.filter(i => {
      return i.number.includes(query)
    })
    callback(result)
  }, 500)

  private appUpdateState = appUpdateState

  public setSearchQuery = (query: string = '') => {
    this.appUpdateState(s => {
      s.admin.search.numbers.query = query
      s.admin.search.numbers.loading = !!query
      if (!query) {
        s.admin.search.numbers.items = []
      }
    })

    const p = this.performSearch(query, (items: TAdminNumber[] | undefined) => {
      if (items && items.length) {
        this.appUpdateState(s => {
          s.admin.search.numbers.query = query
          s.admin.search.numbers.items = items
          s.admin.search.numbers.loading = false
        })
      } else {
        this.appUpdateState(s => {
          s.admin.search.numbers.items = []
          s.admin.search.numbers.loading = false
        })
      }
    })
    p && p.catch(window.logger.error)
  }
}

const adminNumberSearchService = new AdminNumberSearchService()
export { adminNumberSearchService }
