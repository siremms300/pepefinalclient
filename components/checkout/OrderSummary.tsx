'use client'

import { TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useCart } from '../../lib/hooks/useCart'

interface OrderSummaryProps {
  orderType: 'delivery' | 'pickup'
  selectedPayment: 'paystack' | 'transfer'
  isProcessing: boolean
  onPayment: () => void
  onPaymentMethodChange: (method: 'paystack' | 'transfer') => void
  items: any[]
  total: number
  paystackReady?: boolean
}

export default function OrderSummary({ 
  orderType, 
  selectedPayment, 
  isProcessing,
  onPayment,
  onPaymentMethodChange,
  items,
  total,
  paystackReady = true
}: OrderSummaryProps) {
  const { removeFromCart } = useCart()
  
  // Calculate totals
  const deliveryFee = orderType === 'delivery' ? (total > 50000 ? 0 : 5000) : 0
  const tax = total * 0.075
  const grandTotal = total + deliveryFee + tax

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-4">Add items to checkout</p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-pepe-primary text-white rounded-lg font-medium hover:bg-pepe-dark transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
      
      {/* Order Type */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              {orderType === 'delivery' ? 'Home Delivery' : 'Store Pickup'}
            </h3>
            <p className="text-sm text-gray-600">
              {orderType === 'delivery' ? 'Delivered to your address' : 'Pick up at Pepe\'s Café'}
            </p>
          </div>
          <span className={`font-bold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
            {deliveryFee === 0 ? 'Free' : `₦${deliveryFee.toLocaleString()}`}
          </span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => onPaymentMethodChange('paystack')}
            disabled={isProcessing || !paystackReady}
            className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
              selectedPayment === 'paystack' 
                ? 'border-pepe-primary bg-pepe-primary/5' 
                : 'border-gray-200 hover:border-gray-300'
            } disabled:opacity-50`}
          >
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                selectedPayment === 'paystack' ? 'bg-pepe-primary' : 'bg-gray-100'
              }`}>
                <span className="text-xl">💳</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Pay Now</h4>
                <p className="text-sm text-gray-500">Card or bank transfer</p>
                {!paystackReady && (
                  <p className="text-xs text-yellow-600 mt-1">Loading payment system...</p>
                )}
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${
              selectedPayment === 'paystack' 
                ? 'border-pepe-primary bg-pepe-primary' 
                : 'border-gray-300'
            }`}>
              {selectedPayment === 'paystack' && (
                <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5" />
              )}
            </div>
          </button>
          
          <button
            onClick={() => onPaymentMethodChange('transfer')}
            disabled={isProcessing}
            className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
              selectedPayment === 'transfer' 
                ? 'border-pepe-primary bg-pepe-primary/5' 
                : 'border-gray-200 hover:border-gray-300'
            } disabled:opacity-50`}
          >
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                selectedPayment === 'transfer' ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <span className="text-xl">🏦</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Bank Transfer</h4>
                <p className="text-sm text-gray-500">Manual bank transfer</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${
              selectedPayment === 'transfer' 
                ? 'border-pepe-primary bg-pepe-primary' 
                : 'border-gray-300'
            }`}>
              {selectedPayment === 'transfer' && (
                <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-food.jpg'
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">No image</span>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h4 className="font-medium text-gray-900 truncate text-sm">{item.name}</h4>
                <p className="text-xs text-gray-500">₦{item.price?.toLocaleString() || '0'} × {item.quantity || 1}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="font-semibold text-gray-900 text-sm">
                  ₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                disabled={isProcessing}
                className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Remove item"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-3 border-t border-gray-200 pt-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">₦{total.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery</span>
          <span className="font-medium">
            {deliveryFee === 0 ? 'Free' : `₦${deliveryFee.toLocaleString()}`}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (7.5%)</span>
          <span className="font-medium">₦{tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-xl font-bold text-pepe-primary">
            ₦{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>

      {/* Payment Button */}
      <div className="mt-6 space-y-3">
        <button
          onClick={onPayment}
          disabled={isProcessing || items.length === 0 || (selectedPayment === 'paystack' && !paystackReady)}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
            selectedPayment === 'paystack' 
              ? 'bg-pepe-primary text-white hover:bg-pepe-dark' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Processing...
            </>
          ) : selectedPayment === 'paystack' ? (
            paystackReady ? `Pay Now ₦${grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : 'Loading Payment...'
          ) : (
            `Continue to Bank Transfer`
          )}
        </button>

        <div className="flex items-center justify-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Secure payment • 100% safe
        </div>
      </div>

      {/* Selected Payment Method Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center text-sm">
          <span className="font-medium text-gray-700 mr-2">Paying with:</span>
          <span className={`px-2 py-1 rounded ${
            selectedPayment === 'paystack' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {selectedPayment === 'paystack' ? 'Paystack (Instant)' : 'Bank Transfer'}
          </span>
        </div>
        {selectedPayment === 'paystack' && (
          <div className="mt-2">
            <p className="text-xs text-gray-600">
              {paystackReady ? (
                'You\'ll be redirected to a secure payment page'
              ) : (
                <span className="text-yellow-600">⚠️ Payment system is loading...</span>
              )}
            </p>
          </div>
        )}
        {selectedPayment === 'transfer' && (
          <p className="text-xs text-gray-600 mt-2">
            You'll be shown bank details after order creation
          </p>
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-start text-xs text-gray-500">
          <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <p>
            Your payment is secured with 256-bit SSL encryption. We never store your card details. All transactions are processed through Paystack.
          </p>
        </div>
      </div>
    </div>
  )
}























































// 'use client'

// import { TrashIcon } from '@heroicons/react/24/outline'
// import Link from 'next/link'
// import { useCart } from '../../lib/hooks/useCart'

// interface OrderSummaryProps {
//   orderType: 'delivery' | 'pickup'
//   selectedPayment: 'paystack' | 'transfer'
//   isProcessing: boolean
//   onPayment: () => void
//   onPaymentMethodChange: (method: 'paystack' | 'transfer') => void
//   items: any[]
//   total: number
// }

// export default function OrderSummary({ 
//   orderType, 
//   selectedPayment, 
//   isProcessing,
//   onPayment,
//   onPaymentMethodChange,
//   items,
//   total
// }: OrderSummaryProps) {
//   const { removeFromCart } = useCart()
  
//   // Calculate totals
//   const deliveryFee = orderType === 'delivery' ? (total > 50000 ? 0 : 5000) : 0
//   const tax = total * 0.075
//   const grandTotal = total + deliveryFee + tax

//   if (items.length === 0) {
//     return (
//       <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
//         <div className="text-center py-8">
//           <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//             <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
//           <p className="text-gray-500 mb-4">Add items to checkout</p>
//           <Link
//             href="/products"
//             className="inline-block px-6 py-3 bg-pepe-primary text-white rounded-lg font-medium hover:bg-pepe-dark transition-colors"
//           >
//             Browse Menu
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
//       <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
      
//       {/* Order Type */}
//       <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="font-semibold text-gray-900">
//               {orderType === 'delivery' ? 'Home Delivery' : 'Store Pickup'}
//             </h3>
//             <p className="text-sm text-gray-600">
//               {orderType === 'delivery' ? 'Delivered to your address' : 'Pick up at Pepe\'s Café'}
//             </p>
//           </div>
//           <span className={`font-bold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
//             {deliveryFee === 0 ? 'Free' : `₦${deliveryFee.toLocaleString()}`}
//           </span>
//         </div>
//       </div>

//       {/* Payment Method Selection */}
//       <div className="mb-6">
//         <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
//         <div className="grid grid-cols-1 gap-3">
//           <button
//             onClick={() => onPaymentMethodChange('paystack')}
//             disabled={isProcessing}
//             className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
//               selectedPayment === 'paystack' 
//                 ? 'border-pepe-primary bg-pepe-primary/5' 
//                 : 'border-gray-200 hover:border-gray-300'
//             } disabled:opacity-50`}
//           >
//             <div className="flex items-center">
//               <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
//                 selectedPayment === 'paystack' ? 'bg-pepe-primary' : 'bg-gray-100'
//               }`}>
//                 <span className="text-xl">💳</span>
//               </div>
//               <div>
//                 <h4 className="font-medium text-gray-900">Pay Now</h4>
//                 <p className="text-sm text-gray-500">Card or bank transfer</p>
//               </div>
//             </div>
//             <div className={`w-5 h-5 rounded-full border-2 ${
//               selectedPayment === 'paystack' 
//                 ? 'border-pepe-primary bg-pepe-primary' 
//                 : 'border-gray-300'
//             }`}>
//               {selectedPayment === 'paystack' && (
//                 <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5" />
//               )}
//             </div>
//           </button>
          
//           <button
//             onClick={() => onPaymentMethodChange('transfer')}
//             disabled={isProcessing}
//             className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
//               selectedPayment === 'transfer' 
//                 ? 'border-pepe-primary bg-pepe-primary/5' 
//                 : 'border-gray-200 hover:border-gray-300'
//             } disabled:opacity-50`}
//           >
//             <div className="flex items-center">
//               <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
//                 selectedPayment === 'transfer' ? 'bg-green-100' : 'bg-gray-100'
//               }`}>
//                 <span className="text-xl">🏦</span>
//               </div>
//               <div>
//                 <h4 className="font-medium text-gray-900">Bank Transfer</h4>
//                 <p className="text-sm text-gray-500">Manual bank transfer</p>
//               </div>
//             </div>
//             <div className={`w-5 h-5 rounded-full border-2 ${
//               selectedPayment === 'transfer' 
//                 ? 'border-pepe-primary bg-pepe-primary' 
//                 : 'border-gray-300'
//             }`}>
//               {selectedPayment === 'transfer' && (
//                 <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5" />
//               )}
//             </div>
//           </button>
//         </div>
//       </div>

//       {/* Items List */}
//       <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
//         {items.map((item) => (
//           <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//             <div className="flex items-center space-x-3">
//               <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
//                 {item.image ? (
//                   <img 
//                     src={item.image} 
//                     alt={item.name} 
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.currentTarget.src = '/placeholder-food.jpg'
//                     }}
//                   />
//                 ) : (
//                   <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
//                     <span className="text-gray-500 text-xs">No image</span>
//                   </div>
//                 )}
//               </div>
//               <div className="min-w-0">
//                 <h4 className="font-medium text-gray-900 truncate text-sm">{item.name}</h4>
//                 <p className="text-xs text-gray-500">₦{item.price?.toLocaleString() || '0'} × {item.quantity || 1}</p>
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-3">
//               <div className="text-right">
//                 <p className="font-semibold text-gray-900 text-sm">
//                   ₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
//                 </p>
//               </div>
//               <button
//                 onClick={() => removeFromCart(item.id)}
//                 disabled={isProcessing}
//                 className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
//                 aria-label="Remove item"
//               >
//                 <TrashIcon className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Totals */}
//       <div className="space-y-3 border-t border-gray-200 pt-6">
//         <div className="flex justify-between">
//           <span className="text-gray-600">Subtotal</span>
//           <span className="font-medium">₦{total.toLocaleString()}</span>
//         </div>
        
//         <div className="flex justify-between">
//           <span className="text-gray-600">Delivery</span>
//           <span className="font-medium">
//             {deliveryFee === 0 ? 'Free' : `₦${deliveryFee.toLocaleString()}`}
//           </span>
//         </div>
        
//         <div className="flex justify-between">
//           <span className="text-gray-600">Tax (7.5%)</span>
//           <span className="font-medium">₦{tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
//         </div>
        
//         <div className="flex justify-between pt-4 border-t border-gray-200">
//           <span className="text-lg font-bold text-gray-900">Total</span>
//           <span className="text-xl font-bold text-pepe-primary">
//             ₦{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
//           </span>
//         </div>
//       </div>

//       {/* Payment Button */}
//       <div className="mt-6 space-y-3">
//         <button
//           onClick={onPayment}
//           disabled={isProcessing || items.length === 0}
//           className={`w-full py-4 rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
//             selectedPayment === 'paystack' 
//               ? 'bg-pepe-primary text-white hover:bg-pepe-dark' 
//               : 'bg-green-600 text-white hover:bg-green-700'
//           }`}
//         >
//           {isProcessing ? (
//             <>
//               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
//               Processing...
//             </>
//           ) : selectedPayment === 'paystack' ? (
//             `Pay Now ₦${grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
//           ) : (
//             `Continue to Bank Transfer`
//           )}
//         </button>

//         <div className="flex items-center justify-center text-sm text-gray-500">
//           <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//           </svg>
//           Secure payment • 100% safe
//         </div>
//       </div>

//       {/* Selected Payment Method Info */}
//       <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//         <div className="flex items-center text-sm">
//           <span className="font-medium text-gray-700 mr-2">Paying with:</span>
//           <span className={`px-2 py-1 rounded ${
//             selectedPayment === 'paystack' 
//               ? 'bg-blue-100 text-blue-800' 
//               : 'bg-green-100 text-green-800'
//           }`}>
//             {selectedPayment === 'paystack' ? 'Paystack (Instant)' : 'Bank Transfer'}
//           </span>
//         </div>
//         {selectedPayment === 'paystack' && (
//           <p className="text-xs text-gray-600 mt-2">
//             You'll be redirected to a secure payment page
//           </p>
//         )}
//         {selectedPayment === 'transfer' && (
//           <p className="text-xs text-gray-600 mt-2">
//             You'll be shown bank details after order creation
//           </p>
//         )}
//       </div>

//       {/* Security Notice */}
//       <div className="mt-6 pt-6 border-t border-gray-200">
//         <div className="flex items-start text-xs text-gray-500">
//           <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//           </svg>
//           <p>
//             Your payment is secured with 256-bit SSL encryption. We never store your card details. All transactions are processed through Paystack.
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }























































// // // Desktop/pepefinal/frontend/components/checkout/OrderSummary.tsx
// // 'use client'

// // import { TrashIcon } from '@heroicons/react/24/outline'
// // import { useCart } from '../../lib/hooks/useCart'
// // import Link from 'next/link'

// // // interface OrderSummaryProps {
// // //   orderType: 'delivery' | 'pickup'
// // //   selectedPayment: 'paystack' | 'transfer'
// // //   isProcessing: boolean
// // //   onPayment: () => void
// // // }

// // interface OrderSummaryProps {
// //   orderType: 'delivery' | 'pickup'
// //   selectedPayment: 'paystack' | 'transfer'
// //   isProcessing: boolean
// //   onPayment: () => void
// //   grandTotal: number
// // }

// // export default function OrderSummary({ 
// //   orderType, 
// //   selectedPayment, 
// //   isProcessing,
// //   onPayment
// // }: OrderSummaryProps) {
// //   const { items, removeFromCart, updateQuantity } = useCart()
  
// //   // Calculate totals
// //   const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
// //   const deliveryFee = orderType === 'delivery' ? 1500 : 0
// //   const tax = subtotal * 0.075
// //   const total = subtotal + deliveryFee + tax

// //   if (items.length === 0) {
// //     return (
// //       <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
// //         <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
// //         <div className="text-center py-8">
// //           <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
// //             <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
// //             </svg>
// //           </div>
// //           <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
// //           <p className="text-gray-500 mb-4">Add items to checkout</p>
// //           <Link
// //             href="/products"
// //             className="inline-block px-6 py-3 bg-pepe-primary text-white rounded-lg font-medium hover:bg-pepe-dark transition-colors"
// //           >
// //             Browse Menu
// //           </Link>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
// //       <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
      
// //       {/* Order Type */}
// //       <div className="mb-6 p-4 bg-gray-50 rounded-lg">
// //         <div className="flex items-center justify-between">
// //           <div>
// //             <h3 className="font-semibold text-gray-900">
// //               {orderType === 'delivery' ? 'Home Delivery' : 'Store Pickup'}
// //             </h3>
// //             <p className="text-sm text-gray-600">
// //               {orderType === 'delivery' ? 'Delivered to your address' : 'Pick up at Pepe\'s Café'}
// //             </p>
// //           </div>
// //           <span className={`font-bold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
// //             {deliveryFee === 0 ? 'Free' : `₦${deliveryFee.toLocaleString()}`}
// //           </span>
// //         </div>
// //       </div>

// //       {/* Items List */}
// //       <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
// //         {items.map((item) => (
// //           <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
// //             <div className="flex items-center space-x-3">
// //               <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
// //                 {item.image ? (
// //                   <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
// //                 ) : (
// //                   <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
// //                 )}
// //               </div>
// //               <div className="min-w-0">
// //                 <h4 className="font-medium text-gray-900 truncate text-sm">{item.name}</h4>
// //                 <p className="text-xs text-gray-500">₦{item.price.toLocaleString()} × {item.quantity}</p>
// //               </div>
// //             </div>
            
// //             <div className="flex items-center space-x-3">
// //               <div className="text-right">
// //                 <p className="font-semibold text-gray-900 text-sm">
// //                   ₦{(item.price * item.quantity).toLocaleString()}
// //                 </p>
// //               </div>
// //               <button
// //                 onClick={() => removeFromCart(item.id)}
// //                 className="p-1 text-red-600 hover:bg-red-50 rounded"
// //                 aria-label="Remove item"
// //               >
// //                 <TrashIcon className="w-4 h-4" />
// //               </button>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Totals */}
// //       <div className="space-y-3 border-t border-gray-200 pt-6">
// //         <div className="flex justify-between">
// //           <span className="text-gray-600">Subtotal</span>
// //           <span className="font-medium">₦{subtotal.toLocaleString()}</span>
// //         </div>
        
// //         <div className="flex justify-between">
// //           <span className="text-gray-600">Delivery</span>
// //           <span className="font-medium">
// //             {deliveryFee === 0 ? 'Free' : `₦${deliveryFee.toLocaleString()}`}
// //           </span>
// //         </div>
        
// //         <div className="flex justify-between">
// //           <span className="text-gray-600">Tax (7.5%)</span>
// //           <span className="font-medium">₦{tax.toLocaleString()}</span>
// //         </div>
        
// //         <div className="flex justify-between pt-4 border-t border-gray-200">
// //           <span className="text-lg font-bold text-gray-900">Total</span>
// //           <span className="text-xl font-bold text-pepe-primary">
// //             ₦{total.toLocaleString()}
// //           </span>
// //         </div>
// //       </div>

// //       {/* SINGLE Payment Button */}
// //       <div className="mt-6 space-y-3">
// //         <button
// //           onClick={onPayment}
// //           disabled={isProcessing}
// //           className={`w-full py-4 rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
// //             selectedPayment === 'paystack' 
// //               ? 'bg-pepe-primary text-white hover:bg-pepe-dark' 
// //               : 'bg-green-600 text-white hover:bg-green-700'
// //           }`}
// //         >
// //           {isProcessing ? (
// //             'Processing...'
// //           ) : selectedPayment === 'paystack' ? (
// //             'Pay Now ₦' + total.toLocaleString()
// //           ) : (
// //             'Transfer ₦' + total.toLocaleString()
// //           )}
// //         </button>

// //         <div className="flex items-center justify-center text-sm text-gray-500">
// //           <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
// //             <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
// //           </svg>
// //           Secure payment • 100% safe
// //         </div>
// //       </div>

// //       {/* Selected Payment Method Info */}
// //       <div className="mt-4 p-3 bg-gray-50 rounded-lg">
// //         <div className="flex items-center text-sm">
// //           <span className="font-medium text-gray-700 mr-2">Paying with:</span>
// //           <span className={`px-2 py-1 rounded ${selectedPayment === 'paystack' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
// //             {selectedPayment === 'paystack' ? 'Paystack (Instant)' : 'Bank Transfer'}
// //           </span>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }



























































// // // // Desktop/pepefinal/frontend/components/checkout/OrderSummary.tsx
// // // 'use client'

// // // import { TrashIcon } from '@heroicons/react/24/outline'
// // // import { useCart } from '../../lib/hooks/useCart'
// // // import Link from 'next/link'

// // // interface OrderSummaryProps {
// // //   orderType: 'delivery' | 'pickup'
// // //   activeStep: 'info' | 'payment'
// // //   selectedPayment: 'paystack' | 'transfer'
// // //   onPlaceOrder: () => void
// // // }

// // // export default function OrderSummary({ 
// // //   orderType, 
// // //   activeStep, 
// // //   selectedPayment, 
// // //   onPlaceOrder 
// // // }: OrderSummaryProps) {
// // //   const { items, removeFromCart, updateQuantity } = useCart()
  
// // //   // Calculate totals
// // //   const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
// // //   const deliveryFee = orderType === 'delivery' ? 1500 : 0
// // //   const tax = subtotal * 0.075
// // //   const total = subtotal + deliveryFee + tax

// // //   if (items.length === 0) {
// // //     return (
// // //       <div className="bg-white rounded-2xl shadow-sm p-6">
// // //         <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
// // //         <div className="text-center py-8">
// // //           <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
// // //             <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// // //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
// // //             </svg>
// // //           </div>
// // //           <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
// // //           <p className="text-gray-500 mb-4">Add items to checkout</p>
// // //           <Link
// // //             href="/products"
// // //             className="inline-block px-6 py-3 bg-pepe-primary text-white rounded-lg font-medium hover:bg-pepe-dark transition-colors"
// // //           >
// // //             Browse Menu
// // //           </Link>
// // //         </div>
// // //       </div>
// // //     )
// // //   }

// // //   return (
// // //     <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
// // //       <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
      
// // //       {/* Order Type */}
// // //       <div className="mb-6 p-4 bg-gray-50 rounded-lg">
// // //         <div className="flex items-center justify-between">
// // //           <div>
// // //             <h3 className="font-semibold text-gray-900">
// // //               {orderType === 'delivery' ? 'Home Delivery' : 'Store Pickup'}
// // //             </h3>
// // //             <p className="text-sm text-gray-600">
// // //               {orderType === 'delivery' ? 'Delivered to your address' : 'Pick up at Pepe\'s Café'}
// // //             </p>
// // //           </div>
// // //           <span className={`font-bold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
// // //             {deliveryFee === 0 ? 'Free' : `₦${deliveryFee.toLocaleString()}`}
// // //           </span>
// // //         </div>
// // //       </div>

// // //       {/* Items List */}
// // //       <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
// // //         {items.map((item) => (
// // //           <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
// // //             <div className="flex items-center space-x-3">
// // //               <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
// // //                 {item.image ? (
// // //                   <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
// // //                 ) : (
// // //                   <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
// // //                 )}
// // //               </div>
// // //               <div className="min-w-0">
// // //                 <h4 className="font-medium text-gray-900 truncate text-sm">{item.name}</h4>
// // //                 <p className="text-xs text-gray-500">₦{item.price.toLocaleString()} × {item.quantity}</p>
// // //               </div>
// // //             </div>
            
// // //             <div className="flex items-center space-x-3">
// // //               <div className="text-right">
// // //                 <p className="font-semibold text-gray-900 text-sm">
// // //                   ₦{(item.price * item.quantity).toLocaleString()}
// // //                 </p>
// // //               </div>
// // //               <button
// // //                 onClick={() => removeFromCart(item.id)}
// // //                 className="p-1 text-red-600 hover:bg-red-50 rounded"
// // //                 aria-label="Remove item"
// // //               >
// // //                 <TrashIcon className="w-4 h-4" />
// // //               </button>
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>

// // //       {/* Totals */}
// // //       <div className="space-y-3 border-t border-gray-200 pt-6">
// // //         <div className="flex justify-between">
// // //           <span className="text-gray-600">Subtotal</span>
// // //           <span className="font-medium">₦{subtotal.toLocaleString()}</span>
// // //         </div>
        
// // //         <div className="flex justify-between">
// // //           <span className="text-gray-600">Delivery</span>
// // //           <span className="font-medium">
// // //             {deliveryFee === 0 ? 'Free' : `₦${deliveryFee.toLocaleString()}`}
// // //           </span>
// // //         </div>
        
// // //         <div className="flex justify-between">
// // //           <span className="text-gray-600">Tax (7.5%)</span>
// // //           <span className="font-medium">₦{tax.toLocaleString()}</span>
// // //         </div>
        
// // //         <div className="flex justify-between pt-4 border-t border-gray-200">
// // //           <span className="text-lg font-bold text-gray-900">Total</span>
// // //           <span className="text-xl font-bold text-pepe-primary">
// // //             ₦{total.toLocaleString()}
// // //           </span>
// // //         </div>
// // //       </div>

// // //       {/* Action Button */}
// // //       {activeStep === 'info' && (
// // //         <button
// // //           onClick={onPlaceOrder}
// // //           className="w-full mt-6 py-4 bg-pepe-primary text-white rounded-xl font-bold text-lg hover:bg-pepe-dark transition-colors"
// // //         >
// // //           Continue to Payment
// // //         </button>
// // //       )}

// // //       {activeStep === 'payment' && (
// // //         <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
// // //           <div className="flex items-center">
// // //             <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
// // //               <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
// // //             </svg>
// // //             <p className="text-sm text-green-800">
// // //               Paying with {selectedPayment === 'paystack' ? 'Paystack' : 'Bank Transfer'}
// // //             </p>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Security Note */}
// // //       <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
// // //         <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
// // //           <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
// // //         </svg>
// // //         Secure payment • 100% safe
// // //       </div>
// // //     </div>
// // //   )
// // // }