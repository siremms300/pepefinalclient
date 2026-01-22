// lib/hooks/useAuth.ts
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

// Mock user type - replace with your actual User type
interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: 'customer' | 'admin' | 'rider'
  isActive: boolean
}

interface LoginCredentials {
  email: string
  password: string
  userType?: 'customer' | 'rider' | 'admin'
}

interface RegisterData extends LoginCredentials {
  firstName: string
  lastName: string
  phone: string
  confirmPassword: string
}

interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

// Mock API functions - replace with actual API calls
const mockLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock response
  return {
    user: {
      id: '1',
      email: credentials.email,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      role: credentials.userType || 'customer',
      isActive: true,
    },
    token: 'mock-jwt-token',
    refreshToken: 'mock-refresh-token',
  }
}

const mockRegister = async (userData: RegisterData): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock response
  return {
    user: {
      id: '2',
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: userData.userType || 'customer',
      isActive: true,
    },
    token: 'mock-jwt-token',
    refreshToken: 'mock-refresh-token',
  }
}

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: mockLogin,
    onSuccess: (data) => {
      // Store tokens and user data
      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Update react-query cache
      queryClient.setQueryData(['user'], data.user)
      
      toast.success('Login successful!')
      
      // Redirect based on role
      switch (data.user.role) {
        case 'admin':
          router.push('/dashboard/admin')
          break
        case 'rider':
          router.push('/dashboard/rider')
          break
        default:
          router.push('/dashboard/user')
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Login failed. Please check your credentials.')
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: mockRegister,
    onSuccess: (data) => {
      // Store tokens and user data
      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Update react-query cache
      queryClient.setQueryData(['user'], data.user)
      
      toast.success('Registration successful!')
      router.push('/dashboard/user')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Registration failed. Please try again.')
    },
  })

  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    queryClient.clear()
    router.push('/login')
    toast.success('Logged out successfully')
  }

  // Get current user
  const getCurrentUser = (): User | null => {
    if (typeof window === 'undefined') return null
    
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    
    try {
      return JSON.parse(userStr) as User
    } catch {
      return null
    }
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('token')
  }

  // Get user role
  const getUserRole = (): User['role'] | null => {
    const user = getCurrentUser()
    return user?.role || null
  }

  // Check if user has specific role
  const hasRole = (role: User['role']) => {
    const userRole = getUserRole()
    return userRole === role
  }

  // Login function
  const login = (credentials: LoginCredentials) => {
    return loginMutation.mutateAsync(credentials)
  }

  // Register function
  const register = (userData: RegisterData) => {
    return registerMutation.mutateAsync(userData)
  }

  // Use current user hook (for components)
  const useCurrentUser = () => {
    return useQuery({
      queryKey: ['user'],
      queryFn: async () => {
        const user = getCurrentUser()
        if (!user) {
          throw new Error('No user found')
        }
        return user
      },
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    })
  }

  return {
    // State
    isLoading: loginMutation.isPending || registerMutation.isPending,
    
    // Actions
    login,
    register,
    logout,
    
    // Queries
    useCurrentUser,
    
    // Getters
    getCurrentUser,
    isAuthenticated,
    getUserRole,
    hasRole,
    
    // Raw mutations (for direct access if needed)
    loginMutation,
    registerMutation,
  }
}


