// components/checkout/CheckoutForm.tsx
'use client'

import { useState } from 'react'
import { 
  UserIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  HomeIcon, 
  MapPinIcon,
  BuildingStorefrontIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

interface CheckoutFormProps {
  orderType: 'delivery' | 'pickup'
  onFormUpdate: (data: any) => void
  disabled?: boolean
}

export default function CheckoutForm({ orderType, onFormUpdate, disabled = false }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    deliveryInstructions: '',
    pickupTime: '',
    saveInfo: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    let newValue: any = value
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement
      newValue = checked
    }
    
    setFormData(prev => {
      const updated = { ...prev, [name]: newValue }
      onFormUpdate(updated) // Notify parent
      return updated
    })
  }

  const pickupTimes = [
    'ASAP (15-20 min)',
    '30 minutes from now',
    '45 minutes from now',
    '1 hour from now',
    '1.5 hours from now',
    '2 hours from now',
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {orderType === 'delivery' ? 'Delivery Information' : 'Pickup Information'}
      </h2>
      
      <div className="space-y-6">
        {/* Name Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={disabled}
                className={`w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
                  disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                }`}
                placeholder="John"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={disabled}
                className={`w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
                  disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                }`}
                placeholder="Doe"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={disabled}
                className={`w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
                  disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                }`}
                placeholder="john@example.com"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={disabled}
                className={`w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
                  disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                }`}
                placeholder="+234 800 000 0000"
              />
            </div>
          </div>
        </div>

        {/* Pickup Information (only for pickup) */}
        {orderType === 'pickup' && (
          <>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center mb-3">
                <BuildingStorefrontIcon className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="font-semibold text-gray-900">Pickup Location</h3>
              </div>
              <p className="text-gray-700 font-medium mb-1">Pepe's Café & Brunch</p>
              <p className="text-sm text-gray-600 mb-3">123 Food Street, Lagos Island, Lagos</p>
              <div className="flex items-center text-sm">
                <ClockIcon className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-gray-700">
                  <span className="font-medium">Pickup Hours:</span> 7:00 AM - 4:00 PM daily
                </span>
              </div>
            </div>

            {/* Pickup Time Selection */}
            <div>
              <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Pickup Time *
              </label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  id="pickupTime"
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleChange}
                  required
                  disabled={disabled}
                  className={`w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all appearance-none ${
                    disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'
                  }`}
                >
                  <option value="">Select pickup time</option>
                  {pickupTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                  disabled ? 'opacity-50' : ''
                }`}>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Delivery Address (only for delivery) */}
        {orderType === 'delivery' && (
          <>
            {/* Address Line 1 */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <div className="relative">
                <HomeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  disabled={disabled}
                  className={`w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
                    disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                  }`}
                  placeholder="123 Main Street"
                />
              </div>
            </div>

            {/* Apartment/Suite */}
            <div>
              <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-2">
                Apartment, Suite, or Floor (Optional)
              </label>
              <input
                type="text"
                id="apartment"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                disabled={disabled}
                className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
                  disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                }`}
                placeholder="Apt 4B, Floor 2"
              />
            </div>

            {/* City, State, ZIP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled={disabled}
                  className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
                    disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                  }`}
                  placeholder="Lagos"
                />
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  disabled={disabled}
                  className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
                    disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                  }`}
                  placeholder="Lagos State"
                />
              </div>
              
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code *
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  disabled={disabled}
                  className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${
                    disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                  }`}
                  placeholder="100001"
                />
              </div>
            </div>

            {/* Delivery Instructions */}
            <div>
              <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Instructions (Optional)
              </label>
              <div className="relative">
                <MapPinIcon className={`absolute left-3 top-4 w-5 h-5 ${
                  disabled ? 'text-gray-300' : 'text-gray-400'
                }`} />
                <textarea
                  id="deliveryInstructions"
                  name="deliveryInstructions"
                  value={formData.deliveryInstructions}
                  onChange={handleChange}
                  rows={3}
                  disabled={disabled}
                  className={`w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all resize-none ${
                    disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                  }`}
                  placeholder="Leave at the gate, call when you arrive, etc."
                />
              </div>
            </div>
          </>
        )}

        {/* Save Info Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="saveInfo"
            name="saveInfo"
            checked={formData.saveInfo}
            onChange={handleChange}
            disabled={disabled}
            className={`w-4 h-4 text-pepe-primary rounded focus:ring-pepe-primary focus:ring-2 ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          <label htmlFor="saveInfo" className={`ml-3 text-sm ${
            disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
          }`}>
            Save this information for next time
          </label>
        </div>

        {/* Status Message when disabled */}
        {disabled && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-yellow-800">
                Form is disabled while processing your payment
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



















































// // Desktop/pepefinal/frontend/components/checkout/CheckoutForm.tsx
// 'use client'

// import { useState } from 'react'
// import { 
//   UserIcon, 
//   PhoneIcon, 
//   EnvelopeIcon, 
//   HomeIcon, 
//   MapPinIcon,
//   BuildingStorefrontIcon,
//   ClockIcon,
// } from '@heroicons/react/24/outline'

// interface CheckoutFormProps {
//   orderType: 'delivery' | 'pickup'
// }

// export default function CheckoutForm({ orderType }: CheckoutFormProps) {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     address: '',
//     apartment: '',
//     city: '',
//     state: '',
//     postalCode: '',
//     deliveryInstructions: '',
//     pickupTime: '',
//     saveInfo: false,
//   })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target
//     if (type === 'checkbox') {
//       const { checked } = e.target as HTMLInputElement
//       setFormData(prev => ({ ...prev, [name]: checked }))
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }))
//     }
//   }

//   const pickupTimes = [
//     'ASAP (15-20 min)',
//     '30 minutes from now',
//     '45 minutes from now',
//     '1 hour from now',
//     '1.5 hours from now',
//     '2 hours from now',
//   ]

//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-6">
//       <h2 className="text-2xl font-bold text-gray-900 mb-6">
//         {orderType === 'delivery' ? 'Delivery Information' : 'Pickup Information'}
//       </h2>
      
//       <div className="space-y-6">
//         {/* Name Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
//               First Name *
//             </label>
//             <div className="relative">
//               <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 id="firstName"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 required
//                 className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all"
//                 placeholder="John"
//               />
//             </div>
//           </div>
          
//           <div>
//             <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
//               Last Name *
//             </label>
//             <div className="relative">
//               <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 id="lastName"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 required
//                 className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all"
//                 placeholder="Doe"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Contact Information */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//               Email Address *
//             </label>
//             <div className="relative">
//               <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all"
//                 placeholder="john@example.com"
//               />
//             </div>
//           </div>
          
//           <div>
//             <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
//               Phone Number *
//             </label>
//             <div className="relative">
//               <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 required
//                 className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all"
//                 placeholder="+234 800 000 0000"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Pickup Information (only for pickup) */}
//         {orderType === 'pickup' && (
//           <>
//             <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//               <div className="flex items-center mb-3">
//                 <BuildingStorefrontIcon className="w-6 h-6 text-blue-600 mr-3" />
//                 <h3 className="font-semibold text-gray-900">Pickup Location</h3>
//               </div>
//               <p className="text-gray-700 font-medium mb-1">Pepe's Café & Brunch</p>
//               <p className="text-sm text-gray-600 mb-3">123 Food Street, Lagos Island, Lagos</p>
//               <div className="flex items-center text-sm">
//                 <ClockIcon className="w-4 h-4 text-gray-500 mr-2" />
//                 <span className="text-gray-700">
//                   <span className="font-medium">Pickup Hours:</span> 7:00 AM - 4:00 PM daily
//                 </span>
//               </div>
//             </div>

//             {/* Pickup Time Selection */}
//             <div>
//               <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-2">
//                 Preferred Pickup Time *
//               </label>
//               <div className="relative">
//                 <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <select
//                   id="pickupTime"
//                   name="pickupTime"
//                   value={formData.pickupTime}
//                   onChange={handleChange}
//                   required
//                   className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all appearance-none bg-white"
//                 >
//                   <option value="">Select pickup time</option>
//                   {pickupTimes.map((time) => (
//                     <option key={time} value={time}>
//                       {time}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {/* Delivery Address (only for delivery) */}
//         {orderType === 'delivery' && (
//           <>
//             {/* Address Line 1 */}
//             <div>
//               <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
//                 Street Address *
//               </label>
//               <div className="relative">
//                 <HomeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   id="address"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleChange}
//                   required
//                   className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all"
//                   placeholder="123 Main Street"
//                 />
//               </div>
//             </div>

//             {/* Apartment/Suite */}
//             <div>
//               <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-2">
//                 Apartment, Suite, or Floor (Optional)
//               </label>
//               <input
//                 type="text"
//                 id="apartment"
//                 name="apartment"
//                 value={formData.apartment}
//                 onChange={handleChange}
//                 className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all"
//                 placeholder="Apt 4B, Floor 2"
//               />
//             </div>

//             {/* City, State, ZIP */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
//                   City *
//                 </label>
//                 <input
//                   type="text"
//                   id="city"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all"
//                   placeholder="Lagos"
//                 />
//               </div>
              
//               <div>
//                 <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
//                   State *
//                 </label>
//                 <input
//                   type="text"
//                   id="state"
//                   name="state"
//                   value={formData.state}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all"
//                   placeholder="Lagos State"
//                 />
//               </div>
              
//               <div>
//                 <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
//                   Postal Code *
//                 </label>
//                 <input
//                   type="text"
//                   id="postalCode"
//                   name="postalCode"
//                   value={formData.postalCode}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all"
//                   placeholder="100001"
//                 />
//               </div>
//             </div>

//             {/* Delivery Instructions */}
//             <div>
//               <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700 mb-2">
//                 Delivery Instructions (Optional)
//               </label>
//               <div className="relative">
//                 <MapPinIcon className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
//                 <textarea
//                   id="deliveryInstructions"
//                   name="deliveryInstructions"
//                   value={formData.deliveryInstructions}
//                   onChange={handleChange}
//                   rows={3}
//                   className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all resize-none"
//                   placeholder="Leave at the gate, call when you arrive, etc."
//                 />
//               </div>
//             </div>
//           </>
//         )}

//         {/* Save Info Checkbox */}
//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             id="saveInfo"
//             name="saveInfo"
//             checked={formData.saveInfo}
//             onChange={handleChange}
//             className="w-4 h-4 text-pepe-primary rounded focus:ring-pepe-primary focus:ring-2"
//           />
//           <label htmlFor="saveInfo" className="ml-3 text-sm text-gray-700">
//             Save this information for next time
//           </label>
//         </div>
//       </div>
//     </div>
//   )
// }




























































// // Desktop/pepefinal/frontend/components/checkout/CheckoutForm.tsx
// 'use client'

// import { useState } from 'react'
// import { 
//   UserIcon, 
//   PhoneIcon, 
//   EnvelopeIcon, 
//   HomeIcon, 
//   MapPinIcon,
//   BuildingStorefrontIcon,
//   ClockIcon,
//   ArrowRightIcon
// } from '@heroicons/react/24/outline'

// interface CheckoutFormProps {
//   orderType: 'delivery' | 'pickup'
//   onContinue: () => void // This prop should trigger moving to next step
// }

// export default function CheckoutForm({ orderType, onContinue }: CheckoutFormProps) {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     address: '',
//     apartment: '',
//     city: '',
//     state: '',
//     postalCode: '',
//     deliveryInstructions: '',
//     pickupTime: '',
//     saveInfo: false,
//   })

//   const [errors, setErrors] = useState<Record<string, string>>({})

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target
//     if (type === 'checkbox') {
//       const { checked } = e.target as HTMLInputElement
//       setFormData(prev => ({ ...prev, [name]: checked }))
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }))
//     }
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }))
//     }
//   }

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {}
    
//     // Required fields for all orders
//     if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
//     if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required'
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email'
//     }
//     if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    
//     // Required fields for delivery
//     if (orderType === 'delivery') {
//       if (!formData.address.trim()) newErrors.address = 'Address is required'
//       if (!formData.city.trim()) newErrors.city = 'City is required'
//       if (!formData.state.trim()) newErrors.state = 'State is required'
//       if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required'
//     }
    
//     // Required fields for pickup
//     if (orderType === 'pickup' && !formData.pickupTime) {
//       newErrors.pickupTime = 'Please select a pickup time'
//     }
    
//     return newErrors
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
    
//     const validationErrors = validateForm()
    
//     if (Object.keys(validationErrors).length === 0) {
//       // Form is valid, proceed to next step
//       console.log('Form submitted successfully:', { ...formData, orderType })
//       onContinue() // This will move to payment step
//     } else {
//       setErrors(validationErrors)
//       // Scroll to first error
//       const firstError = Object.keys(validationErrors)[0]
//       const element = document.getElementById(firstError)
//       if (element) {
//         element.scrollIntoView({ behavior: 'smooth', block: 'center' })
//       }
//     }
//   }

//   const pickupTimes = [
//     'ASAP (15-20 min)',
//     '30 minutes from now',
//     '45 minutes from now',
//     '1 hour from now',
//     '1.5 hours from now',
//     '2 hours from now',
//   ]

//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-6">
//       <h2 className="text-2xl font-bold text-gray-900 mb-6">
//         {orderType === 'delivery' ? 'Delivery Information' : 'Pickup Information'}
//       </h2>
      
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Name Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
//               First Name *
//             </label>
//             <div className="relative">
//               <UserIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.firstName ? 'text-red-400' : 'text-gray-400'}`} />
//               <input
//                 type="text"
//                 id="firstName"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${errors.firstName ? 'border-red-300' : 'border-gray-300'}`}
//                 placeholder="John"
//               />
//             </div>
//             {errors.firstName && (
//               <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
//             )}
//           </div>
          
//           <div>
//             <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
//               Last Name *
//             </label>
//             <div className="relative">
//               <UserIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.lastName ? 'text-red-400' : 'text-gray-400'}`} />
//               <input
//                 type="text"
//                 id="lastName"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${errors.lastName ? 'border-red-300' : 'border-gray-300'}`}
//                 placeholder="Doe"
//               />
//             </div>
//             {errors.lastName && (
//               <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
//             )}
//           </div>
//         </div>

//         {/* Contact Information */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//               Email Address *
//             </label>
//             <div className="relative">
//               <EnvelopeIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
//                 placeholder="john@example.com"
//               />
//             </div>
//             {errors.email && (
//               <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//             )}
//           </div>
          
//           <div>
//             <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
//               Phone Number *
//             </label>
//             <div className="relative">
//               <PhoneIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.phone ? 'text-red-400' : 'text-gray-400'}`} />
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}
//                 placeholder="+234 800 000 0000"
//               />
//             </div>
//             {errors.phone && (
//               <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
//             )}
//           </div>
//         </div>

//         {/* Pickup Information (only for pickup) */}
//         {orderType === 'pickup' && (
//           <>
//             <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//               <div className="flex items-center mb-3">
//                 <BuildingStorefrontIcon className="w-6 h-6 text-blue-600 mr-3" />
//                 <h3 className="font-semibold text-gray-900">Pickup Location</h3>
//               </div>
//               <p className="text-gray-700 font-medium mb-1">Pepe's Café & Brunch</p>
//               <p className="text-sm text-gray-600 mb-3">123 Food Street, Lagos Island, Lagos</p>
//               <div className="flex items-center text-sm">
//                 <ClockIcon className="w-4 h-4 text-gray-500 mr-2" />
//                 <span className="text-gray-700">
//                   <span className="font-medium">Pickup Hours:</span> 7:00 AM - 4:00 PM daily
//                 </span>
//               </div>
//             </div>

//             {/* Pickup Time Selection */}
//             <div>
//               <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-2">
//                 Preferred Pickup Time *
//               </label>
//               <div className="relative">
//                 <ClockIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.pickupTime ? 'text-red-400' : 'text-gray-400'}`} />
//                 <select
//                   id="pickupTime"
//                   name="pickupTime"
//                   value={formData.pickupTime}
//                   onChange={handleChange}
//                   className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all appearance-none bg-white ${errors.pickupTime ? 'border-red-300' : 'border-gray-300'}`}
//                 >
//                   <option value="">Select pickup time</option>
//                   {pickupTimes.map((time) => (
//                     <option key={time} value={time}>
//                       {time}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </div>
//               </div>
//               {errors.pickupTime && (
//                 <p className="mt-1 text-sm text-red-600">{errors.pickupTime}</p>
//               )}
//             </div>
//           </>
//         )}

//         {/* Delivery Address (only for delivery) */}
//         {orderType === 'delivery' && (
//           <>
//             {/* Address Line 1 */}
//             <div>
//               <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
//                 Street Address *
//               </label>
//               <div className="relative">
//                 <HomeIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.address ? 'text-red-400' : 'text-gray-400'}`} />
//                 <input
//                   type="text"
//                   id="address"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleChange}
//                   className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${errors.address ? 'border-red-300' : 'border-gray-300'}`}
//                   placeholder="123 Main Street"
//                 />
//               </div>
//               {errors.address && (
//                 <p className="mt-1 text-sm text-red-600">{errors.address}</p>
//               )}
//             </div>

//             {/* Apartment/Suite */}
//             <div>
//               <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-2">
//                 Apartment, Suite, or Floor (Optional)
//               </label>
//               <input
//                 type="text"
//                 id="apartment"
//                 name="apartment"
//                 value={formData.apartment}
//                 onChange={handleChange}
//                 className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all"
//                 placeholder="Apt 4B, Floor 2"
//               />
//             </div>

//             {/* City, State, ZIP */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
//                   City *
//                 </label>
//                 <input
//                   type="text"
//                   id="city"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${errors.city ? 'border-red-300' : 'border-gray-300'}`}
//                   placeholder="Lagos"
//                 />
//                 {errors.city && (
//                   <p className="mt-1 text-sm text-red-600">{errors.city}</p>
//                 )}
//               </div>
              
//               <div>
//                 <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
//                   State *
//                 </label>
//                 <input
//                   type="text"
//                   id="state"
//                   name="state"
//                   value={formData.state}
//                   onChange={handleChange}
//                   className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${errors.state ? 'border-red-300' : 'border-gray-300'}`}
//                   placeholder="Lagos State"
//                 />
//                 {errors.state && (
//                   <p className="mt-1 text-sm text-red-600">{errors.state}</p>
//                 )}
//               </div>
              
//               <div>
//                 <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
//                   Postal Code *
//                 </label>
//                 <input
//                   type="text"
//                   id="postalCode"
//                   name="postalCode"
//                   value={formData.postalCode}
//                   onChange={handleChange}
//                   className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all ${errors.postalCode ? 'border-red-300' : 'border-gray-300'}`}
//                   placeholder="100001"
//                 />
//                 {errors.postalCode && (
//                   <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
//                 )}
//               </div>
//             </div>

//             {/* Delivery Instructions */}
//             <div>
//               <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700 mb-2">
//                 Delivery Instructions (Optional)
//               </label>
//               <div className="relative">
//                 <MapPinIcon className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
//                 <textarea
//                   id="deliveryInstructions"
//                   name="deliveryInstructions"
//                   value={formData.deliveryInstructions}
//                   onChange={handleChange}
//                   rows={3}
//                   className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all resize-none"
//                   placeholder="Leave at the gate, call when you arrive, etc."
//                 />
//               </div>
//             </div>
//           </>
//         )}

//         {/* Save Info Checkbox */}
//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             id="saveInfo"
//             name="saveInfo"
//             checked={formData.saveInfo}
//             onChange={handleChange}
//             className="w-4 h-4 text-pepe-primary rounded focus:ring-pepe-primary focus:ring-2"
//           />
//           <label htmlFor="saveInfo" className="ml-3 text-sm text-gray-700">
//             Save this information for next time
//           </label>
//         </div>

//         {/* Form Actions */}
//         <div className="pt-6 border-t border-gray-200">
//           <button
//             type="submit"
//             className="w-full py-4 px-6 bg-pepe-primary text-white rounded-xl font-bold text-lg hover:bg-pepe-dark transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
//           >
//             {orderType === 'delivery' ? 'Continue to Payment' : 'Continue to Payment'}
//             <ArrowRightIcon className="w-5 h-5" />
//           </button>
          
//           <p className="mt-3 text-xs text-gray-500 text-center">
//             By continuing, you agree to our Terms of Service and Privacy Policy
//           </p>
//         </div>
//       </form>
//     </div>
//   )
// }





















































// // // Desktop/pepefinal/frontend/components/checkout/CheckoutForm.tsx
// // 'use client'

// // import { useState } from 'react'
// // import { 
// //   UserIcon, 
// //   PhoneIcon, 
// //   EnvelopeIcon, 
// //   HomeIcon, 
// //   MapPinIcon,
// //   BuildingStorefrontIcon,
// //   ClockIcon
// // } from '@heroicons/react/24/outline'

// // interface CheckoutFormProps {
// //   orderType: 'delivery' | 'pickup'
// // }

// // // Add this interface at the top of CheckoutForm.tsx
// // interface CheckoutFormProps {
// //   orderType: 'delivery' | 'pickup'
// //   onContinue: () => void
// // }

// // // Update the submit handler in CheckoutForm.tsx
// // const handleSubmit = (e: React.FormEvent) => {
// //   e.preventDefault()
// //   console.log('Form submitted:', { ...formData, orderType })
// //   onContinue() // Call this to move to payment step
// // }

// // export default function CheckoutForm({ orderType }: CheckoutFormProps) {
// //   const [formData, setFormData] = useState({
// //     firstName: '',
// //     lastName: '',
// //     email: '',
// //     phone: '',
// //     address: '',
// //     apartment: '',
// //     city: '',
// //     state: '',
// //     postalCode: '',
// //     deliveryInstructions: '',
// //     pickupTime: '',
// //     saveInfo: false,
// //   })

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
// //     const { name, value, type } = e.target
// //     if (type === 'checkbox') {
// //       const { checked } = e.target as HTMLInputElement
// //       setFormData(prev => ({ ...prev, [name]: checked }))
// //     } else {
// //       setFormData(prev => ({ ...prev, [name]: value }))
// //     }
// //   }

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault()
// //     console.log('Form submitted:', { ...formData, orderType })
// //     // Handle form submission here
// //   }

// //   const pickupTimes = [
// //     'ASAP (15-20 min)',
// //     '30 minutes from now',
// //     '45 minutes from now',
// //     '1 hour from now',
// //     '1.5 hours from now',
// //     '2 hours from now',
// //   ]

// //   return (
// //     <div className="bg-white rounded-2xl shadow-sm p-6">
// //       <h2 className="text-2xl font-bold text-gray-900 mb-6">
// //         {orderType === 'delivery' ? 'Delivery Information' : 'Pickup Information'}
// //       </h2>
      
// //       <form onSubmit={handleSubmit} className="space-y-6">
// //         {/* Name Section */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //           <div>
// //             <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
// //               First Name
// //             </label>
// //             <div className="relative">
// //               <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
// //               <input
// //                 type="text"
// //                 id="firstName"
// //                 name="firstName"
// //                 value={formData.firstName}
// //                 onChange={handleChange}
// //                 required
// //                 className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all"
// //                 placeholder="John"
// //               />
// //             </div>
// //           </div>
          
// //           <div>
// //             <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
// //               Last Name
// //             </label>
// //             <div className="relative">
// //               <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
// //               <input
// //                 type="text"
// //                 id="lastName"
// //                 name="lastName"
// //                 value={formData.lastName}
// //                 onChange={handleChange}
// //                 required
// //                 className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all"
// //                 placeholder="Doe"
// //               />
// //             </div>
// //           </div>
// //         </div>

// //         {/* Contact Information */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //           <div>
// //             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
// //               Email Address
// //             </label>
// //             <div className="relative">
// //               <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
// //               <input
// //                 type="email"
// //                 id="email"
// //                 name="email"
// //                 value={formData.email}
// //                 onChange={handleChange}
// //                 required
// //                 className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all"
// //                 placeholder="john@example.com"
// //               />
// //             </div>
// //           </div>
          
// //           <div>
// //             <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
// //               Phone Number
// //             </label>
// //             <div className="relative">
// //               <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
// //               <input
// //                 type="tel"
// //                 id="phone"
// //                 name="phone"
// //                 value={formData.phone}
// //                 onChange={handleChange}
// //                 required
// //                 className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all"
// //                 placeholder="+234 800 000 0000"
// //               />
// //             </div>
// //           </div>
// //         </div>

// //         {/* Pickup Information (only for pickup) */}
// //         {orderType === 'pickup' && (
// //           <>
// //             <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
// //               <div className="flex items-center mb-3">
// //                 <BuildingStorefrontIcon className="w-6 h-6 text-blue-600 mr-3" />
// //                 <h3 className="font-semibold text-gray-900">Pickup Location</h3>
// //               </div>
// //               <p className="text-gray-700 font-medium mb-1">Pepe's Café & Brunch</p>
// //               <p className="text-sm text-gray-600 mb-3">123 Food Street, Lagos Island, Lagos</p>
// //               <div className="flex items-center text-sm">
// //                 <ClockIcon className="w-4 h-4 text-gray-500 mr-2" />
// //                 <span className="text-gray-700">
// //                   <span className="font-medium">Pickup Hours:</span> 7:00 AM - 4:00 PM daily
// //                 </span>
// //               </div>
// //             </div>

// //             {/* Pickup Time Selection */}
// //             <div>
// //               <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 mb-2">
// //                 Preferred Pickup Time
// //               </label>
// //               <div className="relative">
// //                 <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
// //                 <select
// //                   id="pickupTime"
// //                   name="pickupTime"
// //                   value={formData.pickupTime}
// //                   onChange={handleChange}
// //                   required
// //                   className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all appearance-none bg-white"
// //                 >
// //                   <option value="">Select pickup time</option>
// //                   {pickupTimes.map((time) => (
// //                     <option key={time} value={time}>
// //                       {time}
// //                     </option>
// //                   ))}
// //                 </select>
// //                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
// //                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
// //                   </svg>
// //                 </div>
// //               </div>
// //             </div>
// //           </>
// //         )}

// //         {/* Delivery Address (only for delivery) */}
// //         {orderType === 'delivery' && (
// //           <>
// //             {/* Address Line 1 */}
// //             <div>
// //               <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
// //                 Street Address
// //               </label>
// //               <div className="relative">
// //                 <HomeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
// //                 <input
// //                   type="text"
// //                   id="address"
// //                   name="address"
// //                   value={formData.address}
// //                   onChange={handleChange}
// //                   required
// //                   className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all"
// //                   placeholder="123 Main Street"
// //                 />
// //               </div>
// //             </div>

// //             {/* Apartment/Suite */}
// //             <div>
// //               <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-2">
// //                 Apartment, Suite, or Floor (Optional)
// //               </label>
// //               <input
// //                 type="text"
// //                 id="apartment"
// //                 name="apartment"
// //                 value={formData.apartment}
// //                 onChange={handleChange}
// //                 className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all"
// //                 placeholder="Apt 4B, Floor 2"
// //               />
// //             </div>

// //             {/* City, State, ZIP */}
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //               <div>
// //                 <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
// //                   City
// //                 </label>
// //                 <input
// //                   type="text"
// //                   id="city"
// //                   name="city"
// //                   value={formData.city}
// //                   onChange={handleChange}
// //                   required
// //                   className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all"
// //                   placeholder="Lagos"
// //                 />
// //               </div>
              
// //               <div>
// //                 <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
// //                   State
// //                 </label>
// //                 <input
// //                   type="text"
// //                   id="state"
// //                   name="state"
// //                   value={formData.state}
// //                   onChange={handleChange}
// //                   required
// //                   className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all"
// //                   placeholder="Lagos State"
// //                 />
// //               </div>
              
// //               <div>
// //                 <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
// //                   Postal Code
// //                 </label>
// //                 <input
// //                   type="text"
// //                   id="postalCode"
// //                   name="postalCode"
// //                   value={formData.postalCode}
// //                   onChange={handleChange}
// //                   required
// //                   className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all"
// //                   placeholder="100001"
// //                 />
// //               </div>
// //             </div>

// //             {/* Delivery Instructions */}
// //             <div>
// //               <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700 mb-2">
// //                 Delivery Instructions (Optional)
// //               </label>
// //               <div className="relative">
// //                 <MapPinIcon className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
// //                 <textarea
// //                   id="deliveryInstructions"
// //                   name="deliveryInstructions"
// //                   value={formData.deliveryInstructions}
// //                   onChange={handleChange}
// //                   rows={3}
// //                   className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all resize-none"
// //                   placeholder="Leave at the gate, call when you arrive, etc."
// //                 />
// //               </div>
// //             </div>
// //           </>
// //         )}

// //         {/* Special Instructions (for both delivery and pickup) */}
// //         <div>
// //           <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700 mb-2">
// //             Special Instructions {orderType === 'delivery' ? '(Delivery)' : '(Pickup)'}
// //           </label>
// //           <div className="relative">
// //             <MapPinIcon className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
// //             <textarea
// //               id="deliveryInstructions"
// //               name="deliveryInstructions"
// //               value={formData.deliveryInstructions}
// //               onChange={handleChange}
// //               rows={3}
// //               className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none transition-all resize-none"
// //               placeholder={
// //                 orderType === 'delivery' 
// //                   ? "Leave at the gate, call when you arrive, etc."
// //                   : "Any special requests for your order?"
// //               }
// //             />
// //           </div>
// //         </div>

// //         {/* Save Info Checkbox */}
// //         <div className="flex items-center">
// //           <input
// //             type="checkbox"
// //             id="saveInfo"
// //             name="saveInfo"
// //             checked={formData.saveInfo}
// //             onChange={handleChange}
// //             className="w-4 h-4 text-pepe-primary rounded focus:ring-pepe-primary focus:ring-2"
// //           />
// //           <label htmlFor="saveInfo" className="ml-3 text-sm text-gray-700">
// //             Save this information for next time
// //           </label>
// //         </div>

// //         {/* Form Actions */}
// //         <div className="pt-4 border-t border-gray-200">
// //           <button
// //             type="submit"
// //             className="w-full py-4 px-6 bg-pepe-primary text-white rounded-xl font-bold text-lg hover:bg-pepe-dark transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pepe-primary"
// //           >
// //             {orderType === 'delivery' ? 'Continue to Delivery Options' : 'Continue to Payment'}
// //           </button>
          
// //           <p className="mt-3 text-xs text-gray-500 text-center">
// //             By continuing, you agree to our Terms of Service and Privacy Policy
// //           </p>
// //         </div>
// //       </form>
// //     </div>
// //   )
// // }