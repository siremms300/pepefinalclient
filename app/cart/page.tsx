// Desktop/pepefinal/frontend/app/cart/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { useCart } from '../../lib/hooks/useCart'
import CartSummary from '@/components/cart/CartSummary'

export default function CartPage() {
  const { items, total, removeFromCart, updateQuantity, clearCart } = useCart()
  const [checkingOut, setCheckingOut] = useState(false)

  const handleCheckout = () => {
    setCheckingOut(true)
    setTimeout(() => {
      setCheckingOut(false)
      window.location.href = '/checkout'
    }, 500)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingBagIcon className="w-16 h-16 text-gray-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
              <p className="text-gray-600 mb-8">
                Looks like you haven&apos;t added any items to your cart yet.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-pepe-primary text-white font-bold rounded-lg hover:bg-pepe-dark transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Browse Menu
              </Link>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">Review and manage your order</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {items.length} {items.length === 1 ? 'Item' : 'Items'} in Cart
                </h2>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Clear Cart
                </button>
              </div>
              
              {/* Items List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-start space-x-4">
                      {/* Image */}
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🍽️</span>
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                            <p className="text-pepe-primary font-bold mt-1">
                              ₦{item.price.toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Remove item"
                          >
                            <TrashIcon className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                        
                        {/* Quantity Control */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="px-3 py-1 hover:bg-gray-100 transition-colors"
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-1 font-medium min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 hover:bg-gray-100 transition-colors"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-xl font-bold text-gray-900">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                        
                        {/* Notes */}
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Special Instructions
                          </label>
                          <textarea
                            placeholder="E.g., No onions, extra sauce, etc."
                            className="w-full p-3 text-sm border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none"
                            rows={2}
                            defaultValue={item.notes}
                            onChange={(e) => {
                              // You might want to add an updateNotes function to your cart context
                              console.log('Update notes:', e.target.value)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Continue Shopping */}
              <div className="mt-8">
                <Link
                  href="/products"
                  className="inline-flex items-center text-pepe-primary hover:text-pepe-dark font-medium"
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-2" />
                  Continue Shopping
                </Link>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <CartSummary />
                
                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full py-4 bg-pepe-primary text-white font-bold text-lg rounded-xl hover:bg-pepe-dark transition-colors disabled:opacity-50 mt-6 shadow-lg hover:shadow-xl"
                >
                  {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
                </button>
                
                {/* Payment Methods */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3">We Accept</h4>
                  <div className="flex space-x-2">
                    <div className="w-10 h-7 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-800">VISA</span>
                    </div>
                    <div className="w-10 h-7 bg-yellow-100 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-yellow-800">MC</span>
                    </div>
                    <div className="w-10 h-7 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs font-bold">BANK</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    100% secure payment. Your information is protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}


