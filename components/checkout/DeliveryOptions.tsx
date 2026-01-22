// Desktop/pepefinal/frontend/components/checkout/DeliveryOptions.tsx
'use client'

import { useState } from 'react'
import { TruckIcon, ShoppingBagIcon, ClockIcon } from '@heroicons/react/24/outline'
// Alternative: BuildingStorefrontIcon is also available
// import { TruckIcon, BuildingStorefrontIcon, ClockIcon } from '@heroicons/react/24/outline'

export default function DeliveryOptions() {
  const [selectedOption, setSelectedOption] = useState('delivery')

  const options = [
    {
      id: 'delivery',
      name: 'Home Delivery',
      icon: TruckIcon,
      description: 'Delivered to your doorstep',
      price: '₦1,500',
      time: '30-45 min',
      note: 'Free delivery on orders over ₦10,000',
    },
    {
      id: 'pickup',
      name: 'Store Pickup',
      icon: ShoppingBagIcon, // Changed from StoreIcon to ShoppingBagIcon
      // Alternatively: icon: BuildingStorefrontIcon,
      description: 'Pick up at our café',
      price: 'Free',
      time: '15-20 min',
      note: 'Ready for pickup in 15 minutes',
    },
    {
      id: 'express',
      name: 'Express Delivery',
      icon: ClockIcon,
      description: 'Priority delivery',
      price: '₦2,500',
      time: '20-30 min',
      note: 'Guaranteed delivery within 30 minutes',
    },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Options</h2>
      
      <div className="space-y-4">
        {options.map((option) => {
          const Icon = option.icon
          return (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedOption === option.id
                  ? 'border-pepe-primary bg-pepe-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start">
                <div className={`p-3 rounded-lg mr-4 ${
                  selectedOption === option.id
                    ? 'bg-pepe-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{option.name}</h3>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                    <span className={`font-bold ${
                      option.price === 'Free' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {option.price}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex items-center text-sm">
                    <ClockIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600 mr-4">{option.time}</span>
                    <span className="text-blue-600">{option.note}</span>
                  </div>
                </div>
                
                <div className={`w-5 h-5 rounded-full border-2 ml-4 mt-2 ${
                  selectedOption === option.id
                    ? 'border-pepe-primary bg-pepe-primary'
                    : 'border-gray-300'
                }`}>
                  {selectedOption === option.id && (
                    <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5" />
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected Option Details */}
      {selectedOption && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Selected Option</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700">
                {options.find(o => o.id === selectedOption)?.name}
              </p>
              <p className="text-sm text-gray-500">
                {options.find(o => o.id === selectedOption)?.description}
              </p>
            </div>
            <p className="font-semibold text-pepe-primary">
              {options.find(o => o.id === selectedOption)?.price}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}


