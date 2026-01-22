// lib/services/api.ts
import { api } from '@/lib/utils/api'

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  images: { url: string; public_id: string }[]
  category: { _id: string; name: string }
  stock: number
  rating: number
  brand: string
  status: 'Active' | 'Inactive' | 'Draft' | 'Out of Stock'
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  _id: string
  name: string
  images: string[]
  description: string
  status: 'Active' | 'Inactive'
  parentId?: string
  subcategories?: Category[]
}

export interface CartItem {
  _id: string
  productId: Product
  quantity: number
  userId: string
  createdAt: string
}

// Product Service
// export const productService = {
//   async getProducts(params?: {
//     page?: number
//     limit?: number
//     search?: string
//     category?: string
//     status?: string
//     featured?: boolean
//     minPrice?: number
//     maxPrice?: number
//     sortBy?: string
//     sortOrder?: string
//   }) {
//     const response = await api.get('/products', { params })
//     return response.data
//   },

//   async getProduct(id: string) {
//     const response = await api.get(`/products/${id}`)
//     return response.data
//   },

//   async createProduct(data: FormData) {
//     const response = await api.post('/products', data, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     })
//     return response.data
//   },

//   async updateProduct(id: string, data: FormData) {
//     const response = await api.put(`/products/${id}`, data, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     })
//     return response.data
//   },

//   async deleteProduct(id: string) {
//     const response = await api.delete(`/products/${id}`)
//     return response.data
//   }
// }

// // Category Service
// export const categoryService = {
//   async getCategories() {
//     const response = await api.get('/categories')
//     return response.data
//   },

//   async getCategoryHierarchy() {
//     const response = await api.get('/categories/hierarchy')
//     return response.data
//   },

//   async createCategory(data: FormData) {
//     const response = await api.post('/categories', data, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     })
//     return response.data
//   },

//   async updateCategory(id: string, data: FormData) {
//     const response = await api.put(`/categories/${id}`, data, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     })
//     return response.data
//   },

//   async deleteCategory(id: string) {
//     const response = await api.delete(`/categories/${id}`)
//     return response.data
//   }
// }

// lib/services/api.ts (Updated with debugging) 
import { debugAPI } from '@/lib/utils/debug'

// Product Service with debugging
// export const productService = {
//   async getProducts(params?: any) {
//     const url = '/products'
//     debugAPI.logRequest(url, 'GET', params)
    
//     try {
//       const response = await api.get(url, { params })
//       debugAPI.logResponse(url, response.data)
//       return response.data
//     } catch (error: any) {
//       debugAPI.logError(url, error)
//       throw error
//     }
//   },

//   async getProduct(id: string) {
//     const url = `/products/${id}`
//     debugAPI.logRequest(url, 'GET')
    
//     try {
//       const response = await api.get(url)
//       debugAPI.logResponse(url, response.data)
//       return response.data
//     } catch (error: any) {
//       debugAPI.logError(url, error)
//       throw error
//     }
//   }
// }

// lib/services/api.ts (Fix the response handling)
export const productService = {
  async getProducts(params?: any) {
    try {
      const response = await api.get('/products', { params })
      
      // Debug: Log the full response
      console.log('🔄 Full API Response:', {
        url: '/products',
        params,
        status: response.status,
        data: response.data
      })
      
      // Handle different response formats
      const data = response.data
      
      // If it's already in the expected format
      if (data.success !== undefined) {
        return data
      }
      
      // If it's a direct array (fallback)
      if (Array.isArray(data)) {
        return {
          success: true,
          data: data,
          pagination: {
            currentPage: params?.page || 1,
            totalPages: Math.ceil(data.length / (params?.limit || 12)),
            totalProducts: data.length
          }
        }
      }
      
      // Default fallback
      return {
        success: false,
        message: 'Unexpected response format',
        data: []
      }
      
    } catch (error: any) {
      console.error('❌ Product service error:', error)
      throw error
    }
  }
}

// Category Service with debugging
export const categoryService = {
  async getCategories() {
    const url = '/categories'
    debugAPI.logRequest(url, 'GET')
    
    try {
      const response = await api.get(url)
      debugAPI.logResponse(url, response.data)
      return response.data
    } catch (error: any) {
      debugAPI.logError(url, error)
      throw error
    }
  }
}

// Cart Service
export const cartService = {
  async getCart() {
    const response = await api.get('/cart')
    return response.data
  },

  async addToCart(productId: string, quantity: number = 1) {
    const response = await api.post('/cart/add', { productId, quantity })
    return response.data
  },

  async updateCartItem(cartItemId: string, quantity: number) {
    const response = await api.put(`/cart/update/${cartItemId}`, { quantity })
    return response.data
  },

  async removeCartItem(cartItemId: string) {
    const response = await api.delete(`/cart/remove/${cartItemId}`)
    return response.data
  },

  async clearCart() {
    const response = await api.delete('/cart/clear')
    return response.data
  },

  async getCartCount() {
    const response = await api.get('/cart/count')
    return response.data
  }
}

// Order Service
export const orderService = {
//   async createOrder(orderData: any) {
//     const response = await api.post('/orders/create', orderData)
//     return response.data
//   },
 
  async createOrder(orderData: any) {
    try {
      console.log('📨 Sending order data to backend:', orderData);
      const response = await api.post('/orders/create', orderData);
      console.log('✅ Order response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Order creation error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }, 

  async getOrders() {
    const response = await api.get('/orders')
    return response.data
  },

  async getOrder(orderId: string) {
    const response = await api.get(`/orders/${orderId}`)
    return response.data
  },

  async verifyPayment(reference: string) {
    const response = await api.post('/orders/verify-payment', { reference })
    return response.data
  }
}



