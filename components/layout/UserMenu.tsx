// components/layout/UserMenu.tsx
'use client'

import { Fragment } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, Transition } from '@headlessui/react'
import { UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/lib/context/authContext'

export default function UserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <button
        onClick={() => router.push('/login')}
        className="px-4 py-2 bg-pepe-primary text-white rounded-lg hover:bg-pink-500 transition-colors"
      >
        Sign In
      </button>
    )
  }

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="w-8 h-8 bg-gradient-to-br from-pepe-primary to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
        </div>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => router.push('/profile')}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                >
                  <UserCircleIcon className="w-4 h-4 mr-3" />
                  Profile
                </button>
              )}
            </Menu.Item>
            
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => router.push('/settings')}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                >
                  <Cog6ToothIcon className="w-4 h-4 mr-3" />
                  Settings
                </button>
              )}
            </Menu.Item>
            
            {user.role === 'admin' && (
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => router.push('/dashboard/admin')}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                  >
                    <Cog6ToothIcon className="w-4 h-4 mr-3" />
                    Admin Dashboard
                  </button>
                )}
              </Menu.Item>
            )}
          </div>
          
          <div className="py-1 border-t">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={logout}
                  className={`${
                    active ? 'bg-red-50' : ''
                  } flex items-center w-full px-4 py-2 text-sm text-red-700`}
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}