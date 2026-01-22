// Desktop/pepefinal/frontend/app/checkout/transfer/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Header from '../../../components/layout/Header'
import Footer from '../../../components/layout/Footer'
import { useCart } from '../../../lib/hooks/useCart'
import { 
  BanknotesIcon, 
  ClipboardDocumentIcon, 
  CheckCircleIcon,
  ArrowLeftIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

export default function TransferPage() {
  const { items, total, clearCart } = useCart()
  const [orderNumber, setOrderNumber] = useState('')
  const [copied, setCopied] = useState(false)
  const [paymentProofSent, setPaymentProofSent] = useState(false)
  
  // Generate order number on component mount
  useEffect(() => {
    const generatedOrderNumber = `PEPE-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    setOrderNumber(generatedOrderNumber)
  }, [])
  
  // Calculate totals
  const deliveryFee = total > 5000 ? 0 : 500
  const tax = total * 0.075
  const grandTotal = total + deliveryFee + tax

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePaymentProofSent = () => {
    setPaymentProofSent(true)
    // In a real app, you would send this to your backend
    console.log('Payment proof sent for order:', orderNumber)
  }

  const bankDetails = [
    { label: 'Bank Name', value: 'First Bank Nigeria', copyable: true },
    { label: 'Account Name', value: 'Pepe\'s Brunch & Cafe', copyable: true },
    { label: 'Account Number', value: '3081234567', copyable: true },
    { label: 'Bank Code', value: '011', copyable: true },
  ]

  const steps = [
    { number: 1, title: 'Transfer Amount', description: `Transfer ₦${grandTotal.toLocaleString()} to our account` },
    { number: 2, title: 'Send Proof', description: 'Email proof of payment to us' },
    { number: 3, title: 'Order Confirmation', description: 'We\'ll confirm and prepare your order' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-8">
            <a
              href="/checkout"
              className="inline-flex items-center text-pepe-primary hover:text-pepe-dark font-medium"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Checkout
            </a>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <BanknotesIcon className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Bank Transfer Payment
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Transfer the amount below to our bank account and send us proof of payment
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step.number === 1 ? 'bg-pepe-primary text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step.number}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="h-1 w-16 mx-8 bg-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Bank Details */}
              <div className="space-y-8">
                {/* Order Summary Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">{item.name}</span>
                          <span className="text-gray-500 ml-2">×{item.quantity}</span>
                        </div>
                        <div className="font-medium">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 border-t border-b py-4">
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
                  </div>
                  
                  <div className="flex justify-between items-center mt-6">
                    <span className="text-lg font-bold text-gray-900">Total to Transfer</span>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-pepe-primary">
                        ₦{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                      {deliveryFee === 0 && (
                        <div className="text-sm text-green-600 mt-1">Free delivery applied!</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order Details</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order Number</p>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <code className="font-mono font-bold text-gray-900">{orderNumber}</code>
                        <button
                          onClick={() => copyToClipboard(orderNumber)}
                          className="text-pepe-primary hover:text-pepe-dark"
                        >
                          <ClipboardDocumentIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Please include this order number in your transfer description</p>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <span className="font-medium">Important:</span> Include "{orderNumber}" as transfer description/remark
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Bank Instructions */}
              <div className="space-y-8">
                {/* Bank Details Card */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Bank Transfer Details</h2>
                  
                  <div className="space-y-4">
                    {bankDetails.map((detail) => (
                      <div key={detail.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">{detail.label}</p>
                          <p className="font-medium text-gray-900">{detail.value}</p>
                        </div>
                        {detail.copyable && (
                          <button
                            onClick={() => copyToClipboard(detail.value)}
                            className="text-pepe-primary hover:text-pepe-dark"
                            aria-label={`Copy ${detail.label}`}
                          >
                            <ClipboardDocumentIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Copy All Button */}
                  <button
                    onClick={() => copyToClipboard(`First Bank Nigeria\nPepe's Brunch & Cafe\n3081234567`)}
                    className="w-full mt-6 py-3 bg-pepe-primary text-white rounded-lg font-medium hover:bg-pepe-dark transition-colors flex items-center justify-center"
                  >
                    {copied ? (
                      <>
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <ClipboardDocumentIcon className="w-5 h-5 mr-2" />
                        Copy All Bank Details
                      </>
                    )}
                  </button>
                </div>

                {/* Payment Proof Submission */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Send Payment Proof</h2>
                  
                  {paymentProofSent ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Proof Sent Successfully!</h3>
                      <p className="text-gray-600 mb-6">
                        We've received your payment proof. We'll confirm your payment and start preparing your order.
                      </p>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center">
                            <ClockIcon className="w-5 h-5 text-blue-600 mr-3" />
                            <div>
                              <p className="font-medium text-blue-900">Next Steps</p>
                              <p className="text-sm text-blue-800 mt-1">
                                We'll send order confirmation within 30 minutes
                              </p>
                            </div>
                          </div>
                        </div>
                        <a
                          href="/"
                          className="block w-full py-3 bg-pepe-primary text-white rounded-lg font-medium text-center hover:bg-pepe-dark transition-colors"
                        >
                          Return to Home
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">How to send proof:</h4>
                        <ol className="list-decimal pl-5 space-y-2 text-sm text-blue-800">
                          <li>Complete the bank transfer with the exact amount</li>
                          <li>Take a screenshot or photo of the transfer confirmation</li>
                          <li>Email it to us with your order number</li>
                        </ol>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <EnvelopeIcon className="w-5 h-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600">Email Address</p>
                            <p className="font-medium text-gray-900">payments@pepescafe.com</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <PhoneIcon className="w-5 h-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600">WhatsApp</p>
                            <p className="font-medium text-gray-900">+234 800 123 4567</p>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={handlePaymentProofSent}
                        className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        I've Sent the Payment Proof
                      </button>
                    </div>
                  )}
                </div>

                {/* Important Notes */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                  <h3 className="font-bold text-yellow-900 mb-4">Important Notes</h3>
                  <ul className="space-y-3 text-sm text-yellow-800">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                      <span>Transfer <strong>exactly ₦{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> to avoid delays</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                      <span>Include <strong>{orderNumber}</strong> as transfer description</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                      <span>Order will be processed only after payment confirmation</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                      <span>Confirmation typically takes 30-60 minutes during business hours</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Support Information */}
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">Need help with your transfer?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+2348001234567"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  Call Support: +234 800 123 4567
                </a>
                <a
                  href="mailto:support@pepescafe.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-pepe-primary text-white rounded-lg font-medium hover:bg-pepe-dark"
                >
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                  Email Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}


