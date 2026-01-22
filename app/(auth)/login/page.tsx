// app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/context/authContext'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<'user' | 'rider' | 'admin'>('user')
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
    } catch (error) {
      // Error is handled in useAuth hook
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pepe-secondary to-pepe-light p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-pepe-primary p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
            <span className="text-pepe-primary font-display font-bold text-2xl">P</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-white">Sign In</h1>
          <p className="text-white/80 mt-1">Welcome back to Pepe&apos;s Brunch</p>
        </div>

        {/* Form */}
        <div className="p-6 md:p-8">
          {/* Role Selection */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            {(['user', 'rider', 'admin'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setUserType(role)}
                className={`flex-1 py-2 px-4 rounded-md text-center text-sm font-medium transition-colors ${
                  userType === role
                    ? 'bg-white shadow text-pepe-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {role === 'user' ? 'Customer' : role === 'rider' ? 'Rider' : 'Admin'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-pepe-primary focus:ring-pepe-primary border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-pepe-primary hover:text-pink-500"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-pepe-primary text-white font-semibold rounded-lg hover:bg-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600">
                {userType === 'user' && "Don't have an account? "}
                {userType === 'user' && (
                  <Link
                    href="/register"
                    className="text-pepe-primary font-medium hover:text-pink-500"
                  >
                    Sign up now
                  </Link>
                )}
                {userType === 'rider' && (
                  <Link
                    href="/register/rider"
                    className="text-pepe-primary font-medium hover:text-pink-500"
                  >
                    Apply as a rider
                  </Link>
                )}
                {userType === 'admin' && "Admin access is by invitation only"}
              </p>
            </div>
            
            <div className="mt-4 text-center">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}