import React from 'react'
import { accountService } from 'src/services/AccountService'
import { decrementOpenTabs, hasOpenTabs } from 'src/utils/tabs'

function useBeforeunload() {
  React.useEffect(() => {
    function handler() {
      if (hasOpenTabs()) {
        decrementOpenTabs()
      }

      if (!hasOpenTabs()) {
        accountService.sendPresence({ status: 'away' }).catch(window.logger.error)
      }
    }

    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [])
}

export { useBeforeunload }
