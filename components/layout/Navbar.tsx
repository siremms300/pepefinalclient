// components/layout/Navbar.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '../../lib/hooks/useAuth'
import { User } from '../../types/user'
import { BellIcon, ChevronDownIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface NavbarProps {
  user: User
}

export default function Navbar({ user }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { logout } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div>
            <h1 className="text-xl font-display font-semibold text-pepe-dark">
              {getGreeting()}, {user.firstName}!
            </h1>
            <p className="text-sm text-gray-500">
              {user.role === 'admin' 
                ? 'Admin Dashboard' 
                : user.role === 'rider'
                ? 'Rider Dashboard'
                : 'Your Dashboard'}
            </p>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <BellIcon className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Cart (for customers) */}
            {user.role === 'customer' && (
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <ShoppingCartIcon className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-pepe-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
            )}

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-pepe-primary to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.firstName.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="font-medium text-pepe-dark">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                </div>
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href={
                      user.role === 'admin' ? '/dashboard/admin/profile' :
                      user.role === 'rider' ? '/dashboard/rider/profile' :
                      '/dashboard/user/profile'
                    }
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  
                  {user.role === 'customer' && (
                    <>
                      <Link
                        href="/dashboard/user/orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/dashboard/user/addresses"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Addresses
                      </Link>
                    </>
                  )}
                  
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false)
                      logout()
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}