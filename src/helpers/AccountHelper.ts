import { TAccount } from 'src/models/Account'
import dayjs from 'dayjs'
import { intersection } from 'src/helpers/CommonHelper'

export const sortByName = (items: TAccount[], dir?: 'asc' | 'desc') => {
  return items.slice().sort((a: TAccount, b: TAccount) => {
    if (dir === 'asc') {
      return a.profile.displayName.localeCompare(b.profile.displayName)
    }

    if (dir === 'desc') {
      return b.profile.displayName.localeCompare(a.profile.displayName)
    }

    return 0
  })
}

export const sortByEmail = (items: TAccount[], dir?: 'asc' | 'desc') => {
  return items.slice().sort((a: TAccount, b: TAccount) => {
    if (dir === 'asc') {
      return a.profile.email.localeCompare(b.profile.email)
    }

    if (dir === 'desc') {
      return b.profile.email.localeCompare(a.profile.email)
    }

    return 0
  })
}

export const sortByStatus = (items: TAccount[], dir?: 'asc' | 'desc') => {
  return items.slice().sort((a: TAccount, b: TAccount) => {
    if (dir === 'asc') {
      return a.profile.status.localeCompare(b.profile.status)
    }

    if (dir === 'desc') {
      return b.profile.status.localeCompare(a.profile.status)
    }

    return 0
  })
}

export const sortByLastLogin = (items: TAccount[], dir?: 'asc' | 'desc') => {
  return items.slice().sort((a: TAccount, b: TAccount) => {
    const dateA = dayjs(a.profile.lastLogin)
    const dateB = dayjs(b.profile.lastLogin)
    if (dir === 'asc') {
      if (a.profile.lastLogin && !b.profile.lastLogin) {
        return 1
      }

      if (!a.profile.lastLogin && b.profile.lastLogin) {
        return -1
      }

      return dateA.isAfter(dateB) ? 1 : -1
    }

    if (dir === 'desc') {
      if (a.profile.lastLogin && !b.profile.lastLogin) {
        return -1
      }

      if (!a.profile.lastLogin && b.profile.lastLogin) {
        return 1
      }
      return dateB.isAfter(dateA) ? 1 : -1
    }

    return 0
  })
}

export const hasAccountPermission = (currentAccountPermissions: TPermission[], permissions: TPermission[]) => {
  return intersection(currentAccountPermissions, permissions).length > 0
}
