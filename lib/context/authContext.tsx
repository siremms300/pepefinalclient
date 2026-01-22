'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export interface User {
  _id: string
  email: string
  name: string
  avatar: string
  mobile?: string
  role: 'user' | 'admin' | 'rider'
  status: 'Active' | 'Inactive' | 'Suspended'
  createdAt: string
  updatedAt: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  checkAuth: () => boolean
  refreshToken: () => Promise<boolean>
}

interface RegisterData {
  name: string
  email: string
  password: string
  role?: 'user' | 'rider'
  mobile?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true) // Start as true
  const router = useRouter()

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')
        
        if (token && userStr) {
          const userData = JSON.parse(userStr)
          setUser(userData)
          
          // Verify token is still valid
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            
            if (!response.ok) {
              // Token invalid, clear auth
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              localStorage.removeItem('refreshToken')
              setUser(null)
            }
          } catch (error) {
            console.error('Token verification failed:', error)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('refreshToken')
      } finally {
        setIsLoading(false) // Set to false when done
      }
    }

    initAuth()
  }, [])

  // Synchronous check for authentication
  const checkAuth = (): boolean => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    return !!(token && userStr && user)
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) return false

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      })

      const data = await response.json()
      
      if (data.success) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('refreshToken', data.refreshToken)
        return true
      }
      return false
    } catch (error) {
      console.error('Token refresh failed:', error)
      return false
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Login failed')
      }

      // Store auth data
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.data))
      localStorage.setItem('refreshToken', data.refreshToken || '')
      setUser(data.data)

      toast.success('Login successful!')
      
      // Redirect based on role
      if (data.data.role === 'admin') {
        router.push('/dashboard/admin')
      } else if (data.data.role === 'rider') {
        router.push('/dashboard/rider')
      } else {
        router.push('/')
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Registration failed')
      }

      // Store auth data
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.data))
      localStorage.setItem('refreshToken', data.refreshToken || '')
      setUser(data.data)

      toast.success('Registration successful!')
      
      // Handle rider account pending approval
      if (userData.role === 'rider' && data.data.status !== 'Active') {
        toast.success('Your rider account is pending approval')
        router.push('/login')
      } else {
        // Redirect based on role
        if (data.data.role === 'admin') {
          router.push('/dashboard/admin')
        } else if (data.data.role === 'rider') {
          router.push('/dashboard/rider')
        } else {
          router.push('/')
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        // Call logout endpoint if available
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(() => {
          // Silently fail if logout API call fails
        })
      }
    } finally {
      // Always clear local storage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('refreshToken')
      setUser(null)
      
      // Redirect to home
      router.push('/')
      toast.success('Logged out successfully')
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      updateUser,
      checkAuth,
      refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  )
}






























// // lib/context/AuthContext.tsx
// 'use client'

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
// import { useRouter } from 'next/navigation'
// import toast from 'react-hot-toast'

// export interface User {
//   _id: string
//   email: string
//   name: string
//   avatar: string
//   mobile?: string
//   role: 'user' | 'admin' | 'rider'
//   status: 'Active' | 'Inactive' | 'Suspended'
//   createdAt: string
//   updatedAt: string
// }

// export interface AuthContextType {
//   user: User | null
//   isLoading: boolean
//   login: (email: string, password: string) => Promise<void>
//   register: (userData: RegisterData) => Promise<void>
//   logout: () => void
//   updateUser: (userData: Partial<User>) => void
//   checkAuth: () => Promise<boolean>
//   refreshToken: () => Promise<boolean>
// }

// interface RegisterData {
//   name: string
//   email: string
//   password: string
//   role?: 'user' | 'rider'
//   mobile?: string
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }

// interface AuthProviderProps {
//   children: ReactNode
// }

// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const router = useRouter()

//   // Initialize auth on mount
//   useEffect(() => {
//     const initAuth = async () => {
//       try {
//         const token = localStorage.getItem('token')
//         const userStr = localStorage.getItem('user')
        
//         if (token && userStr) {
//           const userData = JSON.parse(userStr)
//           setUser(userData)
          
//           // Verify token is still valid
//           try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
//               headers: {
//                 'Authorization': `Bearer ${token}`
//               }
//             })
            
//             if (!response.ok) {
//               // Token invalid, clear auth
//               localStorage.removeItem('token')
//               localStorage.removeItem('user')
//               localStorage.removeItem('refreshToken')
//               setUser(null)
//             }
//           } catch (error) {
//             console.error('Token verification failed:', error)
//           }
//         }
//       } catch (error) {
//         console.error('Auth initialization error:', error)
//         localStorage.removeItem('token')
//         localStorage.removeItem('user')
//         localStorage.removeItem('refreshToken')
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     initAuth()
//   }, [])

//   const checkAuth = async (): Promise<boolean> => {
//     const token = localStorage.getItem('token')
//     return !!token && !!user
//   }

//   const refreshToken = async (): Promise<boolean> => {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken')
//       if (!refreshToken) return false

//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ refreshToken })
//       })

//       const data = await response.json()
      
//       if (data.success) {
//         localStorage.setItem('token', data.token)
//         localStorage.setItem('refreshToken', data.refreshToken)
//         return true
//       }
//       return false
//     } catch (error) {
//       console.error('Token refresh failed:', error)
//       return false
//     }
//   }

//   const login = async (email: string, password: string) => {
//     try {
//       setIsLoading(true)
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email, password })
//       })

//       const data = await response.json()

//       if (!data.success) {
//         throw new Error(data.message || 'Login failed')
//       }

//       // Store auth data
//       localStorage.setItem('token', data.token)
//       localStorage.setItem('user', JSON.stringify(data.data))
//       localStorage.setItem('refreshToken', data.refreshToken || '')
//       setUser(data.data)

//       toast.success('Login successful!')
      
//       // Redirect based on role
//       if (data.data.role === 'admin') {
//         router.push('/dashboard/admin')
//       } else if (data.data.role === 'rider') {
//         router.push('/dashboard/rider')
//       } else {
//         router.push('/')
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Login failed')
//       throw error
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const register = async (userData: RegisterData) => {
//     try {
//       setIsLoading(true)
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(userData)
//       })

//       const data = await response.json()

//       if (!data.success) {
//         throw new Error(data.message || 'Registration failed')
//       }

//       // Store auth data
//       localStorage.setItem('token', data.token)
//       localStorage.setItem('user', JSON.stringify(data.data))
//       localStorage.setItem('refreshToken', data.refreshToken || '')
//       setUser(data.data)

//       toast.success('Registration successful!')
      
//       // Handle rider account pending approval
//       if (userData.role === 'rider' && data.data.status !== 'Active') {
//         toast.success('Your rider account is pending approval')
//         router.push('/login')
//       } else {
//         // Redirect based on role
//         if (data.data.role === 'admin') {
//           router.push('/dashboard/admin')
//         } else if (data.data.role === 'rider') {
//           router.push('/dashboard/rider')
//         } else {
//           router.push('/')
//         }
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Registration failed')
//       throw error
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const logout = async () => {
//     try {
//       const token = localStorage.getItem('token')
//       if (token) {
//         // Call logout endpoint if available
//         await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }).catch(() => {
//           // Silently fail if logout API call fails
//         })
//       }
//     } finally {
//       // Always clear local storage
//       localStorage.removeItem('token')
//       localStorage.removeItem('user')
//       localStorage.removeItem('refreshToken')
//       setUser(null)
      
//       // Redirect to home
//       router.push('/')
//       toast.success('Logged out successfully')
//     }
//   }

//   const updateUser = (userData: Partial<User>) => {
//     if (user) {
//       const updatedUser = { ...user, ...userData }
//       setUser(updatedUser)
//       localStorage.setItem('user', JSON.stringify(updatedUser))
//     }
//   }

//   return (
//     <AuthContext.Provider value={{
//       user,
//       isLoading,
//       login,
//       register,
//       logout,
//       updateUser,
//       checkAuth,
//       refreshToken
//     }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }


