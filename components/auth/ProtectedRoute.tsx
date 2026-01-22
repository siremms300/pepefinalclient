// components/auth/ProtectedRoute.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/authContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('user' | 'admin' | 'rider')[]
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = ['user', 'admin', 'rider'],
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, isLoading, checkAuth } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const verifyAccess = async () => {
      const isAuthenticated = await checkAuth()
      
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (user && !allowedRoles.includes(user.role)) {
        // Redirect based on user's actual role
        switch (user.role) {
          case 'admin':
            router.push('/dashboard/admin')
            break
          case 'rider':
            router.push('/dashboard/rider')
            break
          default:
            router.push('/')
        }
      }
    }

    if (!isLoading) {
      verifyAccess()
    }
  }, [user, isLoading, router, checkAuth, allowedRoles, redirectTo])

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}