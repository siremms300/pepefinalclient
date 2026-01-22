// lib/types/auth.ts
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

export interface AuthResponse {
  success: boolean
  message: string
  data: User
  token: string
  refreshToken?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role?: 'user' | 'admin' | 'rider'
  mobile?: string
}

