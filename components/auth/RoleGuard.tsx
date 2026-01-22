// components/auth/RoleGuard.tsx
'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/authContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: ('user' | 'admin' | 'rider')[]
  redirectTo?: string
}

export default function RoleGuard({ 
  children, 
  allowedRoles, 
  redirectTo = '/login' 
}: RoleGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectTo)
    }
    
    if (!isLoading && user && !allowedRoles.includes(user.role)) {
      // Redirect based on actual role
      router.push(`/dashboard/${user.role}`)
    }
  }, [user, isLoading, router, allowedRoles, redirectTo])

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}