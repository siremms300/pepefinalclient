// components/layout/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  ShoppingCartIcon, 
  UserGroupIcon, 
  CubeIcon,
  TruckIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import { User } from '@/types/user'

const customerNav = [
  { name: 'Dashboard', href: '/dashboard/user', icon: HomeIcon },
  { name: 'My Orders', href: '/dashboard/user/orders', icon: ShoppingCartIcon },
  { name: 'Profile', href: '/dashboard/user/profile', icon: UserGroupIcon },
]

const adminNav = [
  { name: 'Overview', href: '/dashboard/admin', icon: HomeIcon },
  { name: 'Products', href: '/dashboard/admin/products', icon: CubeIcon },
  { name: 'Orders', href: '/dashboard/admin/orders', icon: ShoppingCartIcon },
  { name: 'Users', href: '/dashboard/admin/users', icon: UserGroupIcon },
  { name: 'Riders', href: '/dashboard/admin/riders', icon: TruckIcon },
  { name: 'Analytics', href: '/dashboard/admin/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/dashboard/admin/settings', icon: Cog6ToothIcon },
]

const riderNav = [
  { name: 'Dashboard', href: '/dashboard/rider', icon: HomeIcon },
  { name: 'Deliveries', href: '/dashboard/rider/deliveries', icon: TruckIcon },
  { name: 'Earnings', href: '/dashboard/rider/earnings', icon: ChartBarIcon },
  { name: 'Notifications', href: '/dashboard/rider/notifications', icon: BellIcon },
]

export default function Sidebar({ user }: { user: User }) {
  const pathname = usePathname()
  
  const getNavigation = () => {
    switch (user.role) {
      case 'admin':
        return adminNav
      case 'rider':
        return riderNav
      default:
        return customerNav
    }
  }

  const navigation = getNavigation()

  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-lg font-display font-semibold text-pepe-dark">
            {user.role === 'admin' ? 'Admin Panel' : 
             user.role === 'rider' ? 'Rider Panel' : 'My Account'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, {user.firstName}!
          </p>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-pepe-primary text-white'
                    : 'text-gray-700 hover:bg-pepe-secondary hover:text-pepe-dark'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}