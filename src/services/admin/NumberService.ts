import { api } from 'src/classes/Api'
import { TAdminModel as TAdminNumber, map } from 'src/models/admin/Number'
import { appUpdateState } from 'src/store'

export enum Type {
  VIRTUAL = 1,
  MOBILE = 2,
}

export interface INumberFilter {
  page: number,
  size: number,
  status?: 'available'
  type?: Type
}

class AdminNumberService {
  private appUpdateState = appUpdateState

  /**
   */
  public loadNumbers = async (filter: INumberFilter) => {
    this.appUpdateState(s => {
      s.admin.numbers.loading = true
    })
    const data = await this.fetch(filter)
    this.appUpdateState(s => {
      s.admin.numbers.list.items = data.items
      s.admin.numbers.list.total = data.totals
      s.admin.numbers.loading = false
    })
  }

  /**
   */
  public fetch = async (filter: INumberFilter) => {
    const payload: TObjectAny = {
      ...filter,
      offset: (filter.page - 1) * filter.size,
      count: filter.size,
    }

    const response: any = await api.call('dids', 'list', payload)
    const items = response.didsList
    const result: TAdminNumber[] = []
    for (const item of items) {
      result.push(map(item))
    }

    return { items: result, totals: response.totalCount }
  }

  /**
   */
  public assign = async (roleId: number, numbersId: number[]) => {
    const payload = {
      numbersId,
      roleId,
    }

    await api.call('dids', 'assign', payload)
  }

  /**
   */
  public setStatus = async (numberId: number, status: string): Promise<boolean> => {
    const numbersId = [numberId]
    try {
      if (status === 'released') {
        await api.call('dids', 'release', { numbersId })

      } else if (status === 'assigned') {
        await api.call('dids', 'assign', { numbersId })

      } else {
        await api.call('dids', 'update', { numbersId, status })
      }

      this.appUpdateState(s => {
        s.admin.numbers.list.items.forEach(number => {
          if (number.id === numberId) {
            number.status = status
          }
        })
      })
      return true
    } catch (e) {
      window.logger.error(e)
      return false
    }
  }
}

const adminNumberService = new AdminNumberService()
export { adminNumberService }
