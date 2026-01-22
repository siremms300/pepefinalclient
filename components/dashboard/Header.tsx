// components/dashboard/Header.tsx
'use client'

import { BellIcon, StarIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/context/authContext'
import UserMenu from '@/components/layout/UserMenu'

export default function DashboardHeader() {
  const { user } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  if (!user) return null

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Search and Greeting */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <StarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search orders, products, customers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <BellIcon className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>

        {/* Greeting for mobile */}
        <div className="mt-2 md:hidden">
          <h1 className="text-lg font-semibold text-gray-900">
            {getGreeting()}, {user.name.split(' ')[0]}!
          </h1>
        </div>
      </div>
    </header>
  )
}