import React from 'react'
import { BellIcon, HalfPersonIcon, LockIcon } from 'src/components/shared/ui/Icons'
import { SidebarNavigation } from 'src/components/shared/ui/SidebarNavigation'

const navigationItems = [
  {
    title: 'Your Profile',
    url: '/settings/profile',
    icon: <HalfPersonIcon width={23} height={23} />,
  },
  {
    title: 'Security',
    url: '/settings/security',
    icon: <LockIcon width={23} height={23} />,
  },
  {
    title: 'Options',
    url: '/settings/options',
    icon: <BellIcon width={23} height={23} />,
  },
]

export const VewSettingsNavigation = () => <SidebarNavigation items={navigationItems} />
