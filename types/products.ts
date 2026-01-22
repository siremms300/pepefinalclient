export interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  images: string[]
  ingredients?: string[]
  nutritionalInfo?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  isAvailable: boolean
  stock: number
  status: 'available' | 'out_of_stock' | 'limited'
  preparationTime?: number // in minutes
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  _id: string
  name: string
  description?: string
  icon?: string
  order: number
  isActive: boolean
}