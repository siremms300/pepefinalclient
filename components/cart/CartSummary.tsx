// components/cart/CartSummary.tsx - Updated with safe price handling
'use client'

import { useCart } from '../../lib/hooks/useCart'

interface CartSummaryProps {
  editable?: boolean
}

// Helper function to safely format prices
const formatPrice = (price: number | undefined | null): string => {
  const numPrice = Number(price) || 0
  return `₦${numPrice.toLocaleString()}`
}

export default function CartSummary({ editable = true }: CartSummaryProps) {
  const { items, total } = useCart()
  
  const safeTotal = Number(total) || 0
  const deliveryFee = safeTotal > 5000 ? 0 : 500
  const tax = safeTotal * 0.075
  const grandTotal = safeTotal + deliveryFee + tax

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
      
      {/* Items List - Compact */}
      <div className="space-y-3 mb-6">
        {items.map((item) => {
          const safePrice = Number(item.price) || 0
          const safeQuantity = Number(item.quantity) || 1
          const itemTotal = safePrice * safeQuantity
          
          return (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <div className="flex-1 truncate pr-2">
                <span className="font-medium text-gray-900">{item.name}</span>
                <span className="text-gray-500 ml-1">×{safeQuantity}</span>
              </div>
              <div className="font-medium whitespace-nowrap">
                {formatPrice(itemTotal)}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Totals - Compact */}
      <div className="space-y-2 border-t border-b py-4">
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
      </div>
      
      {/* Grand Total */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-lg font-bold text-gray-900">Total</span>
        <div className="text-right">
          <div className="text-2xl font-bold text-pepe-primary">
            {formatPrice(grandTotal)}
          </div>
          {deliveryFee === 0 && (
            <div className="text-sm text-green-600 mt-1">Free delivery applied!</div>
          )}
        </div>
      </div>
      
      {/* Promo Code - Optional */}
      {editable && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Promo Code
          </label>
          <div className="flex">
            <input
              type="text"
              placeholder="Enter code"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none"
            />
            <button className="px-4 py-2 bg-gray-800 text-white text-sm rounded-r-lg hover:bg-gray-900 transition-colors">
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
























// // Desktop/pepefinal/frontend/components/cart/CartSummary.tsx
// 'use client'

// import { useCart } from '../../lib/hooks/useCart'

// interface CartSummaryProps {
//   editable?: boolean
// }

// export default function CartSummary({ editable = true }: CartSummaryProps) {
//   const { items, total } = useCart()
  
//   const deliveryFee = total > 5000 ? 0 : 500
//   const tax = total * 0.075
//   const grandTotal = total + deliveryFee + tax

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-6">
//       <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
      
//       {/* Items List - Compact */}
//       <div className="space-y-3 mb-6">
//         {items.map((item) => (
//           <div key={item.id} className="flex justify-between items-center text-sm">
//             <div className="flex-1 truncate pr-2">
//               <span className="font-medium text-gray-900">{item.name}</span>
//               <span className="text-gray-500 ml-1">×{item.quantity}</span>
//             </div>
//             <div className="font-medium whitespace-nowrap">
//               ₦{(item.price * item.quantity).toLocaleString()}
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {/* Totals - Compact */}
//       <div className="space-y-2 border-t border-b py-4">
//         <div className="flex justify-between text-sm">
//           <span className="text-gray-600">Subtotal</span>
//           <span className="font-medium">₦{total.toLocaleString()}</span>
//         </div>
        
//         <div className="flex justify-between text-sm">
//           <span className="text-gray-600">Delivery</span>
//           <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
//             {deliveryFee === 0 ? 'Free' : `₦${deliveryFee.toLocaleString()}`}
//           </span>
//         </div>
        
//         <div className="flex justify-between text-sm">
//           <span className="text-gray-600">Tax (7.5%)</span>
//           <span className="font-medium">₦{tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
//         </div>
//       </div>
      
//       {/* Grand Total */}
//       <div className="flex justify-between items-center mt-6">
//         <span className="text-lg font-bold text-gray-900">Total</span>
//         <div className="text-right">
//           <div className="text-2xl font-bold text-pepe-primary">
//             ₦{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
//           </div>
//           {deliveryFee === 0 && (
//             <div className="text-sm text-green-600 mt-1">Free delivery applied!</div>
//           )}
//         </div>
//       </div>
      
//       {/* Promo Code - Optional */}
//       {editable && (
//         <div className="mt-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Promo Code
//           </label>
//           <div className="flex">
//             <input
//               type="text"
//               placeholder="Enter code"
//               className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none"
//             />
//             <button className="px-4 py-2 bg-gray-800 text-white text-sm rounded-r-lg hover:bg-gray-900 transition-colors">
//               Apply
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


