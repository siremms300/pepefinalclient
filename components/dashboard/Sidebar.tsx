// components/dashboard/Sidebar.tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/context/authContext'
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  TruckIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  MapPinIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  CubeIcon,
  TagIcon,
  PhotoIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  // Common navigation items for all roles
  const commonNavItems = [
    { 
      name: 'Dashboard', 
      href: `/dashboard/${user.role}`, 
      icon: HomeIcon,
      roles: ['user', 'admin', 'rider']
    },
    { 
      name: 'My Profile', 
      href: `/dashboard/${user.role}/profile`, 
      icon: UserCircleIcon,
      roles: ['user', 'admin', 'rider']
    },
    { 
      name: 'Settings', 
      href: `/dashboard/${user.role}/settings`, 
      icon: Cog6ToothIcon,
      roles: ['user', 'admin', 'rider']
    },
  ]

  // User-specific navigation
  const userNavItems = [
    { 
      name: 'My Orders', 
      href: '/dashboard/user/orders', 
      icon: ShoppingBagIcon,
      roles: ['user']
    },
    { 
      name: 'Addresses', 
      href: '/dashboard/user/addresses', 
      icon: MapPinIcon,
      roles: ['user']
    },
    { 
      name: 'Payment Methods', 
      href: '/dashboard/user/payments', 
      icon: CreditCardIcon,
      roles: ['user']
    },
    { 
      name: 'Help & Support', 
      href: '/dashboard/user/support', 
      icon: QuestionMarkCircleIcon,
      roles: ['user']
    },
  ]

  // Admin-specific navigation
  const adminNavItems = [
    { 
      name: 'All Orders', 
      href: '/dashboard/admin/orders', 
      icon: ShoppingBagIcon,
      roles: ['admin']
    },
    { 
      name: 'Products', 
      href: '/dashboard/admin/products', 
      icon: CubeIcon,
      roles: ['admin']
    },
    { 
      name: 'Categories', 
      href: '/dashboard/admin/categories', 
      icon: TagIcon,
      roles: ['admin']
    },
    { 
      name: 'Customers', 
      href: '/dashboard/admin/customers', 
      icon: UsersIcon,
      roles: ['admin']
    },
    { 
      name: 'Riders', 
      href: '/dashboard/admin/riders', 
      icon: TruckIcon,
      roles: ['admin']
    },
    { 
      name: 'Banners', 
      href: '/dashboard/admin/banners', 
      icon: PhotoIcon,
      roles: ['admin']
    },
    { 
      name: 'Analytics', 
      href: '/dashboard/admin/analytics', 
      icon: ChartBarIcon,
      roles: ['admin']
    },
  ]

  // Rider-specific navigation
  const riderNavItems = [
    { 
      name: 'My Deliveries', 
      href: '/dashboard/rider/deliveries', 
      icon: TruckIcon,
      roles: ['rider']
    },
    { 
      name: 'Earnings', 
      href: '/dashboard/rider/earnings', 
      icon: CreditCardIcon,
      roles: ['rider']
    },
  ]

  // Combine navigation based on role
  const navigation = [
    ...commonNavItems,
    ...(user.role === 'admin' ? adminNavItems : []),
    ...(user.role === 'user' ? userNavItems : []),
    ...(user.role === 'rider' ? riderNavItems : []),
  ].filter(item => item.roles.includes(user.role))

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)] hidden md:block">
      <div className="p-4">
        {/* Role Badge */}
        <div className="mb-6">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
            user.role === 'admin' 
              ? 'bg-purple-100 text-purple-800' 
              : user.role === 'rider'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-pepe-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Quick Stats
          </h3>
          <div className="space-y-2">
            {user.role === 'admin' && (
              <>
                <div className="text-sm">
                  <span className="text-gray-600">Today's Orders:</span>
                  <span className="font-semibold ml-2">12</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-semibold ml-2">₦45,800</span>
                </div>
              </>
            )}
            {user.role === 'user' && (
              <>
                <div className="text-sm">
                  <span className="text-gray-600">Active Orders:</span>
                  <span className="font-semibold ml-2">2</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Total Spent:</span>
                  <span className="font-semibold ml-2">₦24,500</span>
                </div>
              </>
            )}
            {user.role === 'rider' && (
              <>
                <div className="text-sm">
                  <span className="text-gray-600">Today's Deliveries:</span>
                  <span className="font-semibold ml-2">8</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Today's Earnings:</span>
                  <span className="font-semibold ml-2">₦5,400</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}