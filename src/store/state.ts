import { TAccount, create as createAccount } from 'src/models/Account'
import { TRole } from 'src/models/Role'
import { TAdminModel as TAdminRole } from 'src/models/admin/Role'
import { TAdminModel as TAdminNumber } from 'src/models/admin/Number'
import { TChat } from 'src/models/Chat'
import { TModel as TCampaign } from 'src/models/Campaign'
import { create as createExtras } from 'src/models/Extras'
import { TCallItem } from 'src/services/DialService'

export interface IAppState {
  system: {
    token: string
    authError: boolean
    errorMessage: string
  }

  layout: {
    dialog: {
      open: boolean
      title: string
      content: string
      cancel: boolean
      actionLabel: string
      action: () => any
    }
  }

  current: {
    accountId: number
    isAdmin: boolean
    account: TAccount
    roles: TRole[]
    extras: any
    timezone: any
    hasLoaded: boolean
  }

  accounts: {
    list: TAccount[] // available by roles:getByAccountId
    searchList: TAccount[]
    searchQuery: string
    searchLoading: boolean
  }

  chats: {
    list: TChat[]
    activeId: null | number
    listLoading: boolean
    unRepliedCount: number
    searchQuery: string
    searchList: TChat[]
    searchInFocus: boolean
    searchLoading: boolean
  }

  calls: {
    openDial: boolean
    callBlock: TCallItem[]
  }

  campaigns: {
    list: TCampaign[]
    editId: null | number
    activeId: null | number
    listLoading: boolean
  }

  contact: {
    selected: number[]
  }

  admin: {
    roles: {
      list: TAdminRole[]
      loading: boolean
    }
    members: {
      list: TAccount[]
      loading: boolean
    }
    numbers: {
      list: {
        items: TAdminNumber[]
        total: number
      }
      searchQuery: string
      loading: boolean
    }
    search: {
      numbers: {
        items: TAdminNumber[]
        loading: boolean
        query: string
      }
      availableManagers: {
        items: TAccount[]
        loading: boolean
        query: string
      }
      availableMembers: {
        items: TAccount[]
        loading: boolean
        query: string
      }
    }
  }
  notifications: {
    newContent: INotification
  }
}

export const initialState: IAppState = {
  system: {
    token: '',
    authError: false,
    errorMessage: '',
  },

  layout: {
    dialog: {
      open: false,
      title: '',
      content: '',
      cancel: true,
      actionLabel: '',
      action: () => {},
    },
  },

  current: {
    accountId: 0,
    isAdmin: false,
    account: createAccount(),
    roles: [],
    extras: createExtras(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hasLoaded: false,
  },

  accounts: {
    list: [], // available by roles:getByAccountId
    searchList: [],
    searchQuery: '',
    searchLoading: false,
  },

  chats: {
    list: [],
    activeId: null,
    listLoading: false,
    unRepliedCount: 0,
    searchQuery: '',
    searchList: [],
    searchInFocus: false,
    searchLoading: false,
  },

  calls: {
    openDial: false,
    callBlock: [],
  },

  campaigns: {
    list: [],
    editId: null,
    activeId: null,
    listLoading: false,
  },

  contact: {
    selected: [],
  },

  admin: {
    roles: {
      list: [],
      loading: false,
    },
    members: {
      list: [],
      loading: false,
    },
    numbers: {
      list: {
        items: [],
        total: 0,
      },
      searchQuery: '',
      loading: true,
    },
    search: {
      numbers: {
        items: [],
        loading: false,
        query: '',
      },
      availableManagers: {
        items: [],
        loading: false,
        query: '',
      },
      availableMembers: {
        items: [],
        loading: false,
        query: '',
      },
    },
  },
  notifications: {
    newContent: {} as INotification,
  },
}

export interface IState {
  app: IAppState
  internal: TObjectAny
}
