// Desktop/pepefinal/frontend/components/checkout/PaymentOptions.tsx
'use client'

import { useState } from 'react'
import { CreditCardIcon, BanknotesIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

interface PaymentOptionsProps {
  selectedPayment: 'paystack' | 'transfer'
  onSelectPayment: (method: 'paystack' | 'transfer') => void
  orderType: 'delivery' | 'pickup'
  onPaySuccess: () => void
  onBack: () => void
}

export default function PaymentOptions({
  selectedPayment,
  onSelectPayment,
  orderType,
  onPaySuccess,
  onBack
}: PaymentOptionsProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayWithPaystack = () => {
    setIsProcessing(true)
    // Initialize Paystack payment
    // @ts-ignore - Paystack is loaded via script
    if (window.PaystackPop) {
      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY, // Your Paystack public key
        email: 'customer@email.com', // Get from form
        amount: 1000000, // Amount in kobo (₦10,000 = 1000000)
        currency: 'NGN',
        ref: 'PEPE_' + Date.now(),
        callback: function(response: any) {
          setIsProcessing(false)
          console.log('Payment successful:', response)
          onPaySuccess()
        },
        onClose: function() {
          setIsProcessing(false)
          console.log('Payment window closed')
        }
      })
      handler.openIframe()
    } else {
      console.error('Paystack not loaded')
      setIsProcessing(false)
    }
  }

  const paymentMethods = [
    {
      id: 'paystack',
      name: 'Pay Online',
      icon: CreditCardIcon,
      description: 'Pay instantly with card or bank',
      features: ['Visa/Mastercard', 'Bank Transfer', 'Instant confirmation']
    },
    {
      id: 'transfer',
      name: 'Bank Transfer',
      icon: BanknotesIcon,
      description: 'Transfer directly to our bank',
      features: ['Manual processing', 'Send proof of payment', '24-hour confirmation']
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg mr-4"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
          <p className="text-gray-600">Choose how you want to pay</p>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-4 mb-8">
        {paymentMethods.map((method) => {
          const Icon = method.icon
          return (
            <button
              key={method.id}
              onClick={() => onSelectPayment(method.id as 'paystack' | 'transfer')}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedPayment === method.id
                  ? 'border-pepe-primary bg-pepe-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start">
                <div className={`p-3 rounded-lg mr-4 ${
                  selectedPayment === method.id
                    ? 'bg-pepe-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      selectedPayment === method.id
                        ? 'border-pepe-primary bg-pepe-primary'
                        : 'border-gray-300'
                    }`}>
                      {selectedPayment === method.id && (
                        <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5" />
                      )}
                    </div>
                  </div>
                  
                  <ul className="mt-3 space-y-1">
                    {method.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected Payment Details */}
      {selectedPayment === 'paystack' && (
        <div className="mb-8">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-blue-800">
                Your payment is secured with 256-bit SSL encryption. We never store your card details.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedPayment === 'transfer' && (
        <div className="mb-8">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Bank Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Bank Name:</span>
                <span className="font-medium">First Bank</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Name:</span>
                <span className="font-medium">Pepe's Brunch & Cafe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number:</span>
                <span className="font-mono font-medium">3081234567</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              After transferring, please send proof of payment to{' '}
              <a href="mailto:payments@pepescafe.com" className="text-pepe-primary hover:underline">
                payments@pepescafe.com
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {selectedPayment === 'paystack' && (
          <button
            onClick={handlePayWithPaystack}
            disabled={isProcessing}
            className="w-full py-4 bg-pepe-primary text-white rounded-xl font-bold text-lg hover:bg-pepe-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>
        )}

        {selectedPayment === 'transfer' && (
          <button
            onClick={onPaySuccess}
            className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
          >
            I've Made the Transfer
          </button>
        )}

        <button
          onClick={onBack}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          Back to Information
        </button>
      </div>
    </div>
  )
}



