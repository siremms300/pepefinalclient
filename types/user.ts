// types/user.ts
export interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  address?: string
  role: 'customer' | 'admin' | 'rider'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
  userType?: 'customer' | 'rider' | 'admin'
}

export interface RegisterData extends LoginCredentials {
  firstName: string
  lastName: string
  phone: string
  confirmPassword: string
}



// // types/user.ts
// export interface User {
//   id: string
//   email: string
//   firstName: string
//   lastName: string
//   phone: string
//   address?: string
//   city?: string
//   state?: string
//   postalCode?: string
//   country?: string
//   role: 'customer' | 'admin' | 'rider'
//   isActive: boolean
//   emailVerified: boolean
//   avatar?: string
//   createdAt: string
//   updatedAt: string
// }

// export interface LoginCredentials {
//   email: string
//   password: string
//   userType?: 'customer' | 'rider' | 'admin'
// }

// export interface RegisterData {
//   firstName: string
//   lastName: string
//   email: string
//   phone: string
//   password: string
//   confirmPassword: string
//   userType?: 'customer' | 'rider' | 'admin'
//   acceptTerms: boolean
// }

// export interface AuthResponse {
//   user: User
//   token: string
//   refreshToken: string
//   expiresIn: number
// }