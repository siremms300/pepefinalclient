// app/checkout/success/page
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../../components/layout/Header'
import Footer from '../../../components/layout/Footer'
import { CheckCircleIcon, DocumentTextIcon, HomeIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function SuccessPage() {
  const [orderId, setOrderId] = useState<string | null>(null)
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get order ID from URL on client side
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const id = searchParams.get('order')
      setOrderId(id)
      
      if (id) {
        // Fetch order details
        const fetchOrder = async () => {
          try {
            // You should implement this API call
            // const response = await orderService.getOrder(id)
            // setOrder(response.data)
            
            // Simulate loading
            setTimeout(() => {
              setOrder({
                orderId: id,
                status: 'paid',
                total: '₦15,750',
                date: new Date().toLocaleDateString(),
                items: 3
              })
              setLoading(false)
            }, 1000)
          } catch (error) {
            console.error('Error fetching order:', error)
            setLoading(false)
          }
        }
        fetchOrder()
      } else {
        // If no order ID, redirect to home or orders page
        router.push('/')
      }
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pepe-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Confirming your order...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-16 h-16 text-green-600" />
            </div>
            
            {/* Success Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for your order. We're preparing it now.
            </p>
            
            {/* Order Details */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-center mb-6">
                <DocumentTextIcon className="w-6 h-6 text-gray-500 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Order Number</span>
                  <span className="font-mono font-bold text-gray-900">{orderId}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Confirmed
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="text-xl font-bold text-pepe-primary">
                    {order?.total || '₦0'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Order Date</span>
                  <span className="font-medium">{new Date().toLocaleDateString('en-NG', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-blue-900 mb-4">What happens next?</h3>
              <ul className="text-left space-y-3 text-blue-800">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>We'll send you an email confirmation within 5 minutes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Your order will be prepared within 15-30 minutes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt=1.5 mr=3 flex-shrink-0"></div>
                  <span>You'll receive updates via SMS/Email</span>
                </li>
              </ul>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-pepe-primary text-white rounded-lg font-medium hover:bg-pepe-dark transition-colors"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
              
              <Link
                href="/orders"
                className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <ShoppingBagIcon className="w-5 h-5 mr-2" />
                View Orders
              </Link>
            </div>
            
            {/* Support Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-2">Need help?</p>
              <p className="text-gray-700">
                Call us at <a href="tel:+2348001234567" className="text-pepe-primary hover:underline">+234 800 123 4567</a> or 
                email <a href="mailto:support@pepescafe.com" className="text-pepe-primary hover:underline">support@pepescafe.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}























































// // app/checkout/success/page
// 'use client'

// import { useEffect, useState } from 'react'
// import { useSearchParams } from 'next/navigation'
// import Header from '../../../components/layout/Header'
// import Footer from '../../../components/layout/Footer'
// import { CheckCircleIcon, DocumentTextIcon, HomeIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
// import Link from 'next/link'

// export default function SuccessPage() {
//   const searchParams = useSearchParams()
//   const orderId = searchParams.get('order')
//   const [order, setOrder] = useState<any>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     if (orderId) {
//       // Fetch order details
//       const fetchOrder = async () => {
//         try {
//           // You should implement this API call
//           // const response = await orderService.getOrder(orderId)
//           // setOrder(response.data)
          
//           // Simulate loading
//           setTimeout(() => {
//             setOrder({
//               orderId,
//               status: 'paid',
//               total: '₦15,750',
//               date: new Date().toLocaleDateString(),
//               items: 3
//             })
//             setLoading(false)
//           }, 1000)
//         } catch (error) {
//           console.error('Error fetching order:', error)
//           setLoading(false)
//         }
//       }
//       fetchOrder()
//     }
//   }, [orderId])

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gray-50">
//         <Header />
//         <main className="flex-grow flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pepe-primary mx-auto"></div>
//             <p className="mt-4 text-gray-600">Confirming your order...</p>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Header />
      
//       <main className="flex-grow py-12">
//         <div className="container mx-auto px-4">
//           <div className="max-w-2xl mx-auto text-center">
//             {/* Success Icon */}
//             <div className="w-24 h-24 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center">
//               <CheckCircleIcon className="w-16 h-16 text-green-600" />
//             </div>
            
//             {/* Success Message */}
//             <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Payment Successful!
//             </h1>
//             <p className="text-xl text-gray-600 mb-8">
//               Thank you for your order. We're preparing it now.
//             </p>
            
//             {/* Order Details */}
//             <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
//               <div className="flex items-center justify-center mb-6">
//                 <DocumentTextIcon className="w-6 h-6 text-gray-500 mr-3" />
//                 <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
//               </div>
              
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Order Number</span>
//                   <span className="font-mono font-bold text-gray-900">{orderId}</span>
//                 </div>
                
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Status</span>
//                   <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
//                     Confirmed
//                   </span>
//                 </div>
                
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Total Amount</span>
//                   <span className="text-xl font-bold text-pepe-primary">
//                     {order?.total || '₦0'}
//                   </span>
//                 </div>
                
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Order Date</span>
//                   <span className="font-medium">{new Date().toLocaleDateString('en-NG', {
//                     weekday: 'long',
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric'
//                   })}</span>
//                 </div>
//               </div>
//             </div>
            
//             {/* Next Steps */}
//             <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
//               <h3 className="font-bold text-blue-900 mb-4">What happens next?</h3>
//               <ul className="text-left space-y-3 text-blue-800">
//                 <li className="flex items-start">
//                   <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
//                   <span>We'll send you an email confirmation within 5 minutes</span>
//                 </li>
//                 <li className="flex items-start">
//                   <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
//                   <span>Your order will be prepared within 15-30 minutes</span>
//                 </li>
//                 <li className="flex items-start">
//                   <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
//                   <span>You'll receive updates via SMS/Email</span>
//                 </li>
//               </ul>
//             </div>
            
//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link
//                 href="/"
//                 className="inline-flex items-center justify-center px-6 py-3 bg-pepe-primary text-white rounded-lg font-medium hover:bg-pepe-dark transition-colors"
//               >
//                 <HomeIcon className="w-5 h-5 mr-2" />
//                 Back to Home
//               </Link>
              
//               <Link
//                 href="/orders"
//                 className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
//               >
//                 <ShoppingBagIcon className="w-5 h-5 mr-2" />
//                 View Orders
//               </Link>
//             </div>
            
//             {/* Support Info */}
//             <div className="mt-8 pt-8 border-t border-gray-200">
//               <p className="text-gray-600 mb-2">Need help?</p>
//               <p className="text-gray-700">
//                 Call us at <a href="tel:+2348001234567" className="text-pepe-primary hover:underline">+234 800 123 4567</a> or 
//                 email <a href="mailto:support@pepescafe.com" className="text-pepe-primary hover:underline">support@pepescafe.com</a>
//               </p>
//             </div>
//           </div>
//         </div>
//       </main>
      
//       <Footer />
//     </div>
//   )
// }



