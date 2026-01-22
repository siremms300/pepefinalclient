// Desktop/pepefinal/frontend/components/checkout/PaymentMethod.tsx
'use client'

import { useState } from 'react'
import { CreditCardIcon, BanknotesIcon, QrCodeIcon } from '@heroicons/react/24/outline'

export default function PaymentMethod() {
  const [selectedMethod, setSelectedMethod] = useState('card')

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCardIcon, description: 'Pay with Visa, Mastercard, or Verve' },
    { id: 'transfer', name: 'Bank Transfer', icon: BanknotesIcon, description: 'Direct bank transfer' },
    { id: 'qr', name: 'QR Code', icon: QrCodeIcon, description: 'Scan to pay' },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
      
      {/* Payment Method Selection */}
      <div className="space-y-3 mb-6">
        {paymentMethods.map((method) => {
          const Icon = method.icon
          return (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedMethod === method.id
                  ? 'border-pepe-primary bg-pepe-primary/5'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg mr-4 ${
                  selectedMethod === method.id
                    ? 'bg-pepe-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-900">{method.name}</h3>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedMethod === method.id
                    ? 'border-pepe-primary bg-pepe-primary'
                    : 'border-gray-300'
                }`}>
                  {selectedMethod === method.id && (
                    <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5" />
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Card Payment Form (shown when card is selected) */}
      {selectedMethod === 'card' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                placeholder="MM/YY"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none"
              />
            </div>
            
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                placeholder="123"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pepe-primary focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Secure Payment Notice */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-green-800">
            Your payment is secure and encrypted. We never store your card details.
          </p>
        </div>
      </div>
    </div>
  )
}



