// lib/context/CartContext.tsx - Updated version
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  notes?: string
}

interface CartContextType {
  items: CartItem[]
  total: number
  itemCount: number
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void // New function to explicitly open cart
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        const validatedCart = parsedCart.map((item: any) => ({
          ...item,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
        }))
        setItems(validatedCart)
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        localStorage.removeItem('cart')
      }
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id)
      
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id
            ? { 
                ...i, 
                quantity: i.quantity + 1,
                price: Number(item.price) || i.price
              }
            : i
        )
      } else {
        return [...prevItems, { 
          ...item, 
          quantity: 1,
          price: Number(item.price) || 0
        }]
      }
    })
    // REMOVED: setIsCartOpen(true) - Don't auto-open sidebar
  }

  const removeFromCart = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id)
      return
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  // Function to explicitly open the cart
  const openCart = () => {
    setIsCartOpen(true)
  }

  const total = items.reduce((sum, item) => {
    const price = Number(item.price) || 0
    const quantity = Number(item.quantity) || 1
    return sum + (price * quantity)
  }, 0)

  const itemCount = items.reduce((count, item) => {
    const quantity = Number(item.quantity) || 1
    return count + quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart, // Add the new function
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

























// // lib/context/CartContext.tsx
// 'use client'

// import React, { createContext, useContext, useState, useEffect } from 'react'

// export interface CartItem {
//   id: string
//   name: string
//   price: number  // Ensure this is always a number
//   image: string
//   quantity: number
//   notes?: string
// }

// interface CartContextType {
//   items: CartItem[]
//   total: number
//   itemCount: number
//   isCartOpen: boolean
//   setIsCartOpen: (isOpen: boolean) => void
//   addToCart: (item: Omit<CartItem, 'quantity'>) => void
//   removeFromCart: (id: string) => void
//   updateQuantity: (id: string, quantity: number) => void
//   clearCart: () => void
// }

// const CartContext = createContext<CartContextType | undefined>(undefined)

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [items, setItems] = useState<CartItem[]>([])
//   const [isCartOpen, setIsCartOpen] = useState(false)

//   // Load cart from localStorage on mount
//   useEffect(() => {
//     const savedCart = localStorage.getItem('cart')
//     if (savedCart) {
//       try {
//         const parsedCart = JSON.parse(savedCart)
//         // Ensure all prices are numbers
//         const validatedCart = parsedCart.map((item: any) => ({
//           ...item,
//           price: Number(item.price) || 0, // Convert to number, default to 0
//           quantity: Number(item.quantity) || 1, // Ensure quantity is number
//         }))
//         setItems(validatedCart)
//       } catch (error) {
//         console.error('Error loading cart from localStorage:', error)
//         localStorage.removeItem('cart') // Clear invalid cart data
//       }
//     }
//   }, [])

//   // Save cart to localStorage whenever items change
//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(items))
//   }, [items])

//   const addToCart = (item: Omit<CartItem, 'quantity'>) => {
//     setItems(prevItems => {
//       const existingItem = prevItems.find(i => i.id === item.id)
      
//       if (existingItem) {
//         // Update quantity if item already exists
//         return prevItems.map(i =>
//           i.id === item.id
//             ? { 
//                 ...i, 
//                 quantity: i.quantity + 1,
//                 price: Number(item.price) || i.price // Ensure price is number
//               }
//             : i
//         )
//       } else {
//         // Add new item with quantity 1
//         return [...prevItems, { 
//           ...item, 
//           quantity: 1,
//           price: Number(item.price) || 0 // Ensure price is number
//         }]
//       }
//     })
//     setIsCartOpen(true)
//   }

//   const removeFromCart = (id: string) => {
//     setItems(prevItems => prevItems.filter(item => item.id !== id))
//   }

//   const updateQuantity = (id: string, quantity: number) => {
//     if (quantity < 1) {
//       removeFromCart(id)
//       return
//     }
    
//     setItems(prevItems =>
//       prevItems.map(item =>
//         item.id === id
//           ? { ...item, quantity: Math.max(1, quantity) }
//           : item
//       )
//     )
//   }

//   const clearCart = () => {
//     setItems([])
//   }

//   // Calculate total with safe number conversion
//   const total = items.reduce((sum, item) => {
//     const price = Number(item.price) || 0
//     const quantity = Number(item.quantity) || 1
//     return sum + (price * quantity)
//   }, 0)

//   const itemCount = items.reduce((count, item) => {
//     const quantity = Number(item.quantity) || 1
//     return count + quantity
//   }, 0)

//   return (
//     <CartContext.Provider
//       value={{
//         items,
//         total,
//         itemCount,
//         isCartOpen,
//         setIsCartOpen,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   )
// }

// export const useCart = () => {
//   const context = useContext(CartContext)
//   if (context === undefined) {
//     throw new Error('useCart must be used within a CartProvider')
//   }
//   return context
// }







































// // lib/context/CartContext.tsx (Updated)
// 'use client'

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
// import { cartService, CartItem as ServerCartItem } from '@/lib/services/api'
// import { useAuth } from './authContext'
// import toast from 'react-hot-toast'

// interface CartProduct {
//   _id: string
//   name: string
//   price: number
//   images: { url: string }[]
//   stock: number
// }

// interface LocalCartItem {
//   id: string
//   name: string
//   price: number
//   quantity: number
//   image: string
//   notes?: string
// }

// interface CartContextType {
//   // Local cart for guests
//   localItems: LocalCartItem[]
//   // Server cart for authenticated users
//   serverItems: ServerCartItem[]
//   // Combined view
//   items: LocalCartItem[] | ServerCartItem[]
//   total: number
//   itemCount: number
//   addToCart: (item: Omit<LocalCartItem, 'quantity'>) => Promise<void>
//   removeFromCart: (id: string) => Promise<void>
//   updateQuantity: (id: string, quantity: number) => Promise<void>
//   clearCart: () => Promise<void>
//   isCartOpen: boolean
//   setIsCartOpen: (isOpen: boolean) => void
//   isLoading: boolean
//   syncCart: () => Promise<void>
// }

// const CartContext = createContext<CartContextType | undefined>(undefined)

// export function CartProvider({ children }: { children: ReactNode }) {
//   const { user, isLoading: authLoading } = useAuth()
//   const [localItems, setLocalItems] = useState<LocalCartItem[]>([])
//   const [serverItems, setServerItems] = useState<ServerCartItem[]>([])
//   const [isCartOpen, setIsCartOpen] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [isInitialized, setIsInitialized] = useState(false)

//   // Load local cart from localStorage
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const savedCart = localStorage.getItem('localCart')
//       if (savedCart) {
//         try {
//           setLocalItems(JSON.parse(savedCart))
//         } catch (error) {
//           console.error('Error parsing cart:', error)
//         }
//       }
//       setIsInitialized(true)
//     }
//   }, [])

//   // Save local cart to localStorage
//   useEffect(() => {
//     if (isInitialized && typeof window !== 'undefined' && !user) {
//       localStorage.setItem('localCart', JSON.stringify(localItems))
//     }
//   }, [localItems, isInitialized, user])

//   // Load server cart when user logs in
//   useEffect(() => {
//     if (user) {
//       loadServerCart()
//       // Merge local cart with server cart on login
//       mergeCarts()
//     }
//   }, [user])

//   const loadServerCart = async () => {
//     if (!user) return
    
//     try {
//       setIsLoading(true)
//       const response = await cartService.getCart()
//       if (response.success) {
//         setServerItems(response.data.items || [])
//       }
//     } catch (error) {
//       console.error('Failed to load cart:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const mergeCarts = async () => {
//     if (!user || localItems.length === 0) return
    
//     try {
//       for (const localItem of localItems) {
//         await cartService.addToCart(localItem.id, localItem.quantity)
//       }
//       // Clear local cart after merging
//       setLocalItems([])
//       localStorage.removeItem('localCart')
//       await loadServerCart()
//       toast.success('Cart synced!')
//     } catch (error) {
//       console.error('Failed to merge carts:', error)
//     }
//   }

//   const addToCart = async (item: Omit<LocalCartItem, 'quantity'>) => {
//     if (user) {
//       // Add to server cart
//       try {
//         setIsLoading(true)
//         const response = await cartService.addToCart(item.id, 1)
//         if (response.success) {
//           await loadServerCart()
//           toast.success(`${item.name} added to cart!`)
//         }
//       } catch (error: any) {
//         toast.error(error?.message || 'Failed to add to cart')
//       } finally {
//         setIsLoading(false)
//       }
//     } else {
//       // Add to local cart
//       setLocalItems(prev => {
//         const existingItem = prev.find(i => i.id === item.id)
        
//         if (existingItem) {
//           return prev.map(i =>
//             i.id === item.id
//               ? { ...i, quantity: i.quantity + 1 }
//               : i
//           )
//         } else {
//           return [...prev, { ...item, quantity: 1 }]
//         }
//       })
//       toast.success(`${item.name} added to cart!`)
//     }
//   }

//   const removeFromCart = async (id: string) => {
//     if (user) {
//       try {
//         setIsLoading(true)
//         // Find the cart item ID from server items
//         const cartItem = serverItems.find(item => item.productId._id === id)
//         if (cartItem) {
//           await cartService.removeCartItem(cartItem._id)
//           await loadServerCart()
//           toast.success('Item removed from cart')
//         }
//       } catch (error) {
//         toast.error('Failed to remove item')
//       } finally {
//         setIsLoading(false)
//       }
//     } else {
//       setLocalItems(prev => prev.filter(item => item.id !== id))
//     }
//   }

//   const updateQuantity = async (id: string, quantity: number) => {
//     if (quantity < 1) {
//       await removeFromCart(id)
//       return
//     }

//     if (user) {
//       try {
//         setIsLoading(true)
//         const cartItem = serverItems.find(item => item.productId._id === id)
//         if (cartItem) {
//           await cartService.updateCartItem(cartItem._id, quantity)
//           await loadServerCart()
//         }
//       } catch (error) {
//         toast.error('Failed to update quantity')
//       } finally {
//         setIsLoading(false)
//       }
//     } else {
//       setLocalItems(prev =>
//         prev.map(item =>
//           item.id === id ? { ...item, quantity } : item
//         )
//       )
//     }
//   }

//   const clearCart = async () => {
//     if (user) {
//       try {
//         setIsLoading(true)
//         await cartService.clearCart()
//         setServerItems([])
//         toast.success('Cart cleared')
//       } catch (error) {
//         toast.error('Failed to clear cart')
//       } finally {
//         setIsLoading(false)
//       }
//     } else {
//       setLocalItems([])
//       localStorage.removeItem('localCart')
//     }
//   }

//   const syncCart = async () => {
//     if (user) {
//       await loadServerCart()
//     }
//   }

//   // Determine which cart to display
//   const items = user ? serverItems : localItems
  
//   // Calculate totals
//   const total = items.reduce((sum: number, item: any) => {
//     const price = user ? item.productId?.price : item.price
//     const quantity = item.quantity
//     return sum + (price * quantity)
//   }, 0)

//   const itemCount = items.reduce((sum: number, item: any) => 
//     sum + item.quantity, 0
//   )

//   return (
//     <CartContext.Provider value={{
//       localItems,
//       serverItems,
//       items,
//       total,
//       itemCount,
//       addToCart,
//       removeFromCart,
//       updateQuantity,
//       clearCart,
//       isCartOpen,
//       setIsCartOpen,
//       isLoading,
//       syncCart
//     }}>
//       {children}
//     </CartContext.Provider>
//   )
// }

// export function useCart() {
//   const context = useContext(CartContext)
//   if (context === undefined) {
//     throw new Error('useCart must be used within a CartProvider')
//   }
//   return context
// }




