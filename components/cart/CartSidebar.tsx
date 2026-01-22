// components/cart/CartSidebar.tsx - Updated with safe price handling
'use client'

import { useState } from 'react'
import { 
  XMarkIcon, 
  ShoppingBagIcon, 
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { useCart } from '../../lib/hooks/useCart'
import Link from 'next/link'

// Helper function to safely format prices
const formatPrice = (price: number | undefined | null): string => {
  const numPrice = Number(price) || 0
  return `₦${numPrice.toLocaleString()}`
}

export default function CartSidebar() {
  const { 
    items, 
    total, 
    itemCount, 
    removeFromCart, 
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    clearCart,
  } = useCart()
  
  const [checkingOut, setCheckingOut] = useState(false)

  const handleCheckout = () => {
    setCheckingOut(true)
    setTimeout(() => {
      setCheckingOut(false)
      setIsCartOpen(false)
      window.location.href = '/checkout'
    }, 500)
  }

  if (!isCartOpen) return null

  // Calculate totals with safe number conversion
  const safeTotal = Number(total) || 0
  const deliveryFee = safeTotal > 5000 ? 0 : 500
  const tax = safeTotal * 0.075
  const grandTotal = safeTotal + deliveryFee + tax

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Sidebar - Full height with no internal scroll */}
      <div className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-white z-50 flex flex-col shadow-2xl">
        {/* Header - Compact */}
        <div className="flex-shrink-0 border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <ShoppingBagIcon className="w-6 h-6 text-pepe-primary mr-3" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pepe-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close cart"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-8">
            <div className="w-20 h-20 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">Your cart is empty</h3>
            <p className="text-gray-500 text-center mb-6 text-sm">
              Add items from our menu
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="px-6 py-2 bg-pepe-primary text-white rounded-lg font-medium hover:bg-pepe-dark transition-colors"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items - Takes most space */}
            <div className="flex-grow overflow-y-auto px-4 py-3">
              <div className="space-y-3">
                {items.map((item) => {
                  const safePrice = Number(item.price) || 0
                  const safeQuantity = Number(item.quantity) || 1
                  const itemTotal = safePrice * safeQuantity
                  
                  return (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
                      <div className="flex items-start gap-3">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-pepe-secondary to-pepe-light rounded-lg flex items-center justify-center">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                  e.currentTarget.src = ''
                                  e.currentTarget.parentElement!.innerHTML = '<span class="text-xl">🍽️</span>'
                                }}
                              />
                            ) : (
                              <span className="text-xl">🍽️</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0">
                              <h3 className="font-medium text-gray-900 text-sm truncate">{item.name}</h3>
                              <p className="text-pepe-dark font-bold text-sm mt-0.5">
                                {formatPrice(safePrice)}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="flex-shrink-0 p-1 hover:bg-red-50 rounded transition-colors"
                              aria-label="Remove item"
                            >
                              <TrashIcon className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                          
                          {/* Quantity Control */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-gray-300 rounded-md bg-white">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, safeQuantity - 1))}
                                className="px-2 py-1 hover:bg-gray-50 transition-colors rounded-l-md"
                              >
                                <MinusIcon className="w-3 h-3" />
                              </button>
                              <span className="px-2 py-1 min-w-[32px] text-center text-sm font-medium">
                                {safeQuantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, safeQuantity + 1)}
                                className="px-2 py-1 hover:bg-gray-50 transition-colors rounded-r-md"
                              >
                                <PlusIcon className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="font-bold text-gray-900 text-sm">
                              {formatPrice(itemTotal)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Clear Cart Button - Only if there are items */}
              {items.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={clearCart}
                    className="w-full py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors text-sm font-medium"
                  >
                    Clear All Items
                  </button>
                </div>
              )}
            </div>

            {/* Compact Order Summary - Takes minimal space */}
            <div className="flex-shrink-0 border-t border-gray-200 bg-white">
              {/* Summary Details - Compact */}
              <div className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(safeTotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                    {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (7.5%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                
                {/* Total - More compact */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-pepe-primary">
                        {formatPrice(grandTotal)}
                      </div>
                      {deliveryFee === 0 && (
                        <p className="text-xs text-green-600 mt-0.5">Free delivery</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact Action Buttons */}
              <div className="px-4 pb-4 pt-1 space-y-2">
                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full py-3 bg-pepe-primary text-white rounded-lg font-bold hover:bg-pepe-dark transition-colors shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                >
                  {checkingOut ? (
                    'Processing...'
                  ) : (
                    <>
                      Checkout Now
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
                
                <Link href="/cart" onClick={() => setIsCartOpen(false)}>
                  <button className="w-full py-2 bg-white border border-pepe-primary text-pepe-primary rounded-lg font-medium hover:bg-pepe-primary hover:text-white transition-colors text-sm">
                    View Full Cart
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}








































// // Desktop/pepefinal/frontend/components/cart/CartSidebar.tsx
// 'use client'

// import { useState } from 'react'
// import { 
//   XMarkIcon, 
//   ShoppingBagIcon, 
//   TrashIcon,
//   PlusIcon,
//   MinusIcon,
//   ArrowRightIcon
// } from '@heroicons/react/24/outline'
// import { useCart } from '../../lib/hooks/useCart'
// import Link from 'next/link'

// export default function CartSidebar() {
//   const { 
//     items, 
//     total, 
//     itemCount, 
//     removeFromCart, 
//     updateQuantity,
//     isCartOpen,
//     setIsCartOpen,
//     clearCart,
//   } = useCart()
  
//   const [checkingOut, setCheckingOut] = useState(false)

//   const handleCheckout = () => {
//     setCheckingOut(true)
//     setTimeout(() => {
//       setCheckingOut(false)
//       setIsCartOpen(false)
//       window.location.href = '/checkout'
//     }, 500)
//   }

//   if (!isCartOpen) return null

//   // Calculate totals
//   const deliveryFee = total > 5000 ? 0 : 500
//   const tax = total * 0.075
//   const grandTotal = total + deliveryFee + tax

//   return (
//     <>
//       {/* Overlay */}
//       <div 
//         className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
//         onClick={() => setIsCartOpen(false)}
//       />
      
//       {/* Sidebar - Full height with no internal scroll */}
//       <div className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-white z-50 flex flex-col shadow-2xl">
//         {/* Header - Compact */}
//         <div className="flex-shrink-0 border-b border-gray-200 p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="relative">
//                 <ShoppingBagIcon className="w-6 h-6 text-pepe-primary mr-3" />
//                 {itemCount > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-pepe-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                     {itemCount}
//                   </span>
//                 )}
//               </div>
//               <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
//             </div>
//             <button
//               onClick={() => setIsCartOpen(false)}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               aria-label="Close cart"
//             >
//               <XMarkIcon className="w-5 h-5 text-gray-500" />
//             </button>
//           </div>
//         </div>

//         {/* Empty State */}
//         {items.length === 0 ? (
//           <div className="flex-grow flex flex-col items-center justify-center p-8">
//             <div className="w-20 h-20 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//               <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
//             </div>
//             <h3 className="text-base font-medium text-gray-900 mb-1">Your cart is empty</h3>
//             <p className="text-gray-500 text-center mb-6 text-sm">
//               Add items from our menu
//             </p>
//             <button
//               onClick={() => setIsCartOpen(false)}
//               className="px-6 py-2 bg-pepe-primary text-white rounded-lg font-medium hover:bg-pepe-dark transition-colors"
//             >
//               Browse Menu
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* Cart Items - Takes most space */}
//             <div className="flex-grow overflow-y-auto px-4 py-3">
//               <div className="space-y-3">
//                 {items.map((item) => (
//                   <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
//                     <div className="flex items-start gap-3">
//                       {/* Product Image */}
//                       <div className="flex-shrink-0">
//                         <div className="w-14 h-14 bg-gradient-to-br from-pepe-secondary to-pepe-light rounded-lg flex items-center justify-center">
//                           <span className="text-xl">🍽️</span>
//                         </div>
//                       </div>
                      
//                       {/* Product Details */}
//                       <div className="flex-grow min-w-0">
//                         <div className="flex justify-between items-start gap-2">
//                           <div className="min-w-0">
//                             <h3 className="font-medium text-gray-900 text-sm truncate">{item.name}</h3>
//                             <p className="text-pepe-dark font-bold text-sm mt-0.5">
//                               ₦{item.price.toLocaleString()}
//                             </p>
//                           </div>
//                           <button
//                             onClick={() => removeFromCart(item.id)}
//                             className="flex-shrink-0 p-1 hover:bg-red-50 rounded transition-colors"
//                             aria-label="Remove item"
//                           >
//                             <TrashIcon className="w-4 h-4 text-red-500" />
//                           </button>
//                         </div>
                        
//                         {/* Quantity Control */}
//                         <div className="flex items-center justify-between mt-3">
//                           <div className="flex items-center border border-gray-300 rounded-md bg-white">
//                             <button
//                               onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
//                               className="px-2 py-1 hover:bg-gray-50 transition-colors rounded-l-md"
//                             >
//                               <MinusIcon className="w-3 h-3" />
//                             </button>
//                             <span className="px-2 py-1 min-w-[32px] text-center text-sm font-medium">
//                               {item.quantity}
//                             </span>
//                             <button
//                               onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                               className="px-2 py-1 hover:bg-gray-50 transition-colors rounded-r-md"
//                             >
//                               <PlusIcon className="w-3 h-3" />
//                             </button>
//                           </div>
//                           <div className="font-bold text-gray-900 text-sm">
//                             ₦{(item.price * item.quantity).toLocaleString()}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               {/* Clear Cart Button - Only if there are items */}
//               {items.length > 0 && (
//                 <div className="mt-4">
//                   <button
//                     onClick={clearCart}
//                     className="w-full py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors text-sm font-medium"
//                   >
//                     Clear All Items
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Compact Order Summary - Takes minimal space */}
//             <div className="flex-shrink-0 border-t border-gray-200 bg-white">
//               {/* Summary Details - Compact */}
//               <div className="p-4 space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span className="font-medium">₦{total.toLocaleString()}</span>
//                 </div>
                
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Delivery</span>
//                   <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
//                     {deliveryFee === 0 ? 'Free' : `₦${deliveryFee.toLocaleString()}`}
//                   </span>
//                 </div>
                
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Tax (7.5%)</span>
//                   <span className="font-medium">₦{tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
//                 </div>
                
//                 {/* Total - More compact */}
//                 <div className="pt-2 border-t border-gray-200">
//                   <div className="flex justify-between items-center">
//                     <span className="font-bold text-gray-900">Total</span>
//                     <div className="text-right">
//                       <div className="text-lg font-bold text-pepe-primary">
//                         ₦{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
//                       </div>
//                       {deliveryFee === 0 && (
//                         <p className="text-xs text-green-600 mt-0.5">Free delivery</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Compact Action Buttons */}
//               <div className="px-4 pb-4 pt-1 space-y-2">
//                 <button
//                   onClick={handleCheckout}
//                   disabled={checkingOut}
//                   className="w-full py-3 bg-pepe-primary text-white rounded-lg font-bold hover:bg-pepe-dark transition-colors shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
//                 >
//                   {checkingOut ? (
//                     'Processing...'
//                   ) : (
//                     <>
//                       Checkout Now
//                       <ArrowRightIcon className="w-4 h-4 ml-2" />
//                     </>
//                   )}
//                 </button>
                
//                 <Link href="/cart" onClick={() => setIsCartOpen(false)}>
//                   <button className="w-full py-2 bg-white border border-pepe-primary text-pepe-primary rounded-lg font-medium hover:bg-pepe-primary hover:text-white transition-colors text-sm">
//                     View Full Cart
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </>
//   )
// }






















// // // components/cart/CartSidebar.tsx
// // 'use client'

// // import { useState } from 'react'
// // import { 
// //   XMarkIcon, 
// //   ShoppingBagIcon, 
// //   TrashIcon,
// //   PlusIcon,
// //   MinusIcon,
// // } from '@heroicons/react/24/outline'
// // import { useCart } from '../../lib/hooks/useCart'
// // import Link from 'next/link'
// // import Image from 'next/image'

// // export default function CartSidebar() {
// //   const { 
// //     items, 
// //     total, 
// //     itemCount, 
// //     removeFromCart, 
// //     updateQuantity,
// //     isCartOpen,
// //     setIsCartOpen,
// //     clearCart,
// //   } = useCart()
  
// //   const [checkingOut, setCheckingOut] = useState(false)

// //   const handleCheckout = () => {
// //     setCheckingOut(true)
// //     // In a real app, you would navigate to checkout
// //     setTimeout(() => {
// //       setCheckingOut(false)
// //       setIsCartOpen(false)
// //       window.location.href = '/checkout'
// //     }, 500)
// //   }

// //   if (!isCartOpen) return null

// //   return (
// //     <>
// //       {/* Overlay - Now with backdrop-blur for glass effect */}
// //       <div 
// //         className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
// //         onClick={() => setIsCartOpen(false)}
// //       />
      
// //       {/* Sidebar */}
// //       <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-white z-50 flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out">
// //         {/* Header */}
// //         <div className="flex items-center justify-between p-6 border-b">
// //           <div className="flex items-center">
// //             <ShoppingBagIcon className="w-6 h-6 text-pepe-primary mr-2" />
// //             <h2 className="text-xl font-bold">Your Cart</h2>
// //             <span className="ml-2 bg-pepe-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
// //               {itemCount}
// //             </span>
// //           </div>
// //           <button
// //             onClick={() => setIsCartOpen(false)}
// //             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
// //           >
// //             <XMarkIcon className="w-6 h-6" />
// //           </button>
// //         </div>

// //         {/* Cart Items */}
// //         <div className="flex-1 overflow-y-auto p-6">
// //           {items.length === 0 ? (
// //             <div className="text-center py-12">
// //               <div className="w-24 h-24 mx-auto bg-pepe-secondary rounded-full flex items-center justify-center mb-4">
// //                 <ShoppingBagIcon className="w-12 h-12 text-pepe-primary" />
// //               </div>
// //               <h3 className="text-lg font-semibold text-gray-700 mb-2">Your cart is empty</h3>
// //               <p className="text-gray-500 mb-6">Add some delicious items from our menu</p>
// //               <button
// //                 onClick={() => setIsCartOpen(false)}
// //                 className="px-6 py-3 bg-pepe-primary text-white rounded-lg font-medium hover:bg-pink-500 transition-colors"
// //               >
// //                 Browse Menu
// //               </button>
// //             </div>
// //           ) : (
// //             <div className="space-y-4">
// //               {items.map((item) => (
// //                 <div key={item.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
// //                   {/* Image */}
// //                   <div className="w-20 h-20 bg-gradient-to-br from-pepe-secondary to-pepe-light rounded-lg flex items-center justify-center flex-shrink-0">
// //                     <span className="text-2xl">🍽️</span>
// //                   </div>
                  
// //                   {/* Details */}
// //                   <div className="flex-1">
// //                     <div className="flex justify-between items-start">
// //                       <div>
// //                         <h4 className="font-semibold text-pepe-dark">{item.name}</h4>
// //                         <p className="text-pepe-dark font-bold mt-1">₦{item.price.toLocaleString()}</p>
// //                       </div>
// //                       <button
// //                         onClick={() => removeFromCart(item.id)}
// //                         className="p-1 hover:bg-red-50 rounded transition-colors"
// //                       >
// //                         <TrashIcon className="w-5 h-5 text-red-500" />
// //                       </button>
// //                     </div>
                    
// //                     {/* Quantity Control */}
// //                     <div className="flex items-center justify-between mt-3">
// //                       <div className="flex items-center border border-gray-300 rounded-lg">
// //                         <button
// //                           onClick={() => updateQuantity(item.id, item.quantity - 1)}
// //                           className="px-3 py-1 hover:bg-gray-100 transition-colors"
// //                         >
// //                           <MinusIcon className="w-4 h-4" />
// //                         </button>
// //                         <span className="px-3 py-1">{item.quantity}</span>
// //                         <button
// //                           onClick={() => updateQuantity(item.id, item.quantity + 1)}
// //                           className="px-3 py-1 hover:bg-gray-100 transition-colors"
// //                         >
// //                           <PlusIcon className="w-4 h-4" />
// //                         </button>
// //                       </div>
// //                       <div className="font-bold">
// //                         ₦{(item.price * item.quantity).toLocaleString()}
// //                       </div>
// //                     </div>
                    
// //                     {/* Notes */}
// //                     <textarea
// //                       placeholder="Add special instructions (optional)"
// //                       className="w-full mt-3 p-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-pepe-primary/50 focus:border-transparent"
// //                       rows={2}
// //                       defaultValue={item.notes}
// //                       onChange={(e) => updateQuantity(item.id, e.target.value)}
// //                     />
// //                   </div>
// //                 </div>
// //               ))}
              
// //               {/* Clear Cart Button */}
// //               <button
// //                 onClick={clearCart}
// //                 className="w-full py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
// //               >
// //                 Clear Cart
// //               </button>
// //             </div>
// //           )}
// //         </div>

// //         {/* Footer */}
// //         {items.length > 0 && (
// //           <div className="border-t p-6">
// //             {/* Subtotal */}
// //             <div className="flex justify-between mb-2">
// //               <span className="text-gray-600">Subtotal</span>
// //               <span className="font-bold">₦{total.toLocaleString()}</span>
// //             </div>
            
// //             {/* Delivery Fee */}
// //             <div className="flex justify-between mb-2">
// //               <span className="text-gray-600">Delivery Fee</span>
// //               <span className="font-bold">₦{total > 5000 ? '0' : '500'}</span>
// //             </div>
            
// //             {/* Tax */}
// //             <div className="flex justify-between mb-4">
// //               <span className="text-gray-600">Tax (7.5%)</span>
// //               <span className="font-bold">₦{(total * 0.075).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
// //             </div>
            
// //             {/* Total */}
// //             <div className="flex justify-between mb-6 py-4 border-t border-b">
// //               <span className="text-lg font-bold">Total</span>
// //               <span className="text-2xl font-bold text-pepe-primary">
// //                 ₦{(total + (total > 5000 ? 0 : 500) + (total * 0.075)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
// //               </span>
// //             </div>
            
// //             {/* Action Buttons */}
// //             <div className="space-y-3">
// //               <button
// //                 onClick={handleCheckout}
// //                 disabled={checkingOut}
// //                 className="w-full py-3 bg-pepe-primary text-white font-bold rounded-lg hover:bg-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //               >
// //                 {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
// //               </button>
              
// //               <Link href="/cart">
// //                 <button
// //                   onClick={() => setIsCartOpen(false)}
// //                   className="w-full py-3 bg-white border-2 border-pepe-primary text-pepe-primary font-bold rounded-lg hover:bg-pepe-primary hover:text-white transition-colors"
// //                 >
// //                   View Cart Page
// //                 </button>
// //               </Link>
// //             </div>
            
// //             {/* Note */}
// //             <p className="text-sm text-gray-500 text-center mt-4">
// //               Free delivery on orders over ₦5,000
// //             </p>
// //           </div>
// //         )}
// //       </div>
// //     </>
// //   )
// // }