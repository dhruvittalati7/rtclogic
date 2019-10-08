import React from 'react'
import { BookIcon, GroupIcon, MemberIcon } from 'src/components/shared/ui/Icons'
import { HeaderNavigation } from 'src/components/shared/ui/HeaderNavigation'

const navigationItems = [
  {
    title: 'Members',
    url: '/admin/members',
    icon: <MemberIcon width={23} height={23} />,
  },
  {
    title: 'Groups',
    url: '/admin/groups',
    icon: <GroupIcon width={23} height={23} />,
  },
  {
    title: 'Mobile Numbers',
    url: '/admin/numbers/mobile',
    icon: <BookIcon width={23} height={23} />,
  },
  {
    title: 'Virtual Numbers',
    url: '/admin/numbers/virtual',
    icon: <BookIcon width={23} height={23} />,
  },
]

export const AdminNavigation = () => <HeaderNavigation items={navigationItems} />
