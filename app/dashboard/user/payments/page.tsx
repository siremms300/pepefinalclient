// app/dashboard/user/payments/page.tsx - Fixed version
'use client'

import { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  CreditCardIcon, 
  TrashIcon,
  CheckCircleIcon,
  BanknotesIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

interface PaymentMethod {
  id: string
  type: 'card' | 'bank'
  last4: string
  brand?: string // Make brand optional since bank methods don't have it
  isDefault: boolean
  expiry?: string
  bankName?: string
  accountName?: string
}

export default function UserPaymentsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'visa',
      isDefault: true,
      expiry: '12/25'
    },
    {
      id: '2',
      type: 'bank',
      last4: '7890',
      bankName: 'Guaranty Trust Bank',
      accountName: 'John Doe',
      isDefault: false
    }
  ])
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'card' | 'bank'>('card')
  const [loading, setLoading] = useState(false)

  const handleSetDefault = async (methodId: string) => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setPaymentMethods(prev => prev.map(method => ({
        ...method,
        isDefault: method.id === methodId
      })))
      
      alert('Default payment method updated!')
    } catch (error) {
      console.error('Error setting default:', error)
      alert('Failed to update default payment method')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (methodId: string) => {
    if (!confirm('Are you sure you want to remove this payment method?')) return
    
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setPaymentMethods(prev => prev.filter(method => method.id !== methodId))
      alert('Payment method removed successfully')
    } catch (error) {
      console.error('Error deleting payment method:', error)
      alert('Failed to remove payment method')
    } finally {
      setLoading(false)
    }
  }

  // FIXED: Handle cases where brand is undefined
  const getCardBrandIcon = (brand?: string) => {
    if (!brand) return { color: 'bg-gray-600 text-white', label: 'Card' }
    
    const brands: Record<string, { color: string; label: string }> = {
      visa: { color: 'bg-blue-600 text-white', label: 'Visa' },
      mastercard: { color: 'bg-red-600 text-white', label: 'Mastercard' },
      verve: { color: 'bg-purple-600 text-white', label: 'Verve' },
      americanexpress: { color: 'bg-green-600 text-white', label: 'Amex' }
    }
    
    return brands[brand.toLowerCase()] || { color: 'bg-gray-600 text-white', label: 'Card' }
  }

  const formatCardNumber = (last4: string) => {
    return `•••• •••• •••• ${last4}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-gray-600">Manage your saved payment methods</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-pepe-primary text-white rounded-lg hover:bg-pink-500"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Payment Method</span>
        </button>
      </div>

      {/* Payment Methods List */}
      {paymentMethods.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <CreditCardIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods</h3>
          <p className="text-gray-600 mb-6">Add a payment method to make checkout faster</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-6 py-3 bg-pepe-primary text-white rounded-lg hover:bg-pink-500"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Payment Method
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map((method) => {
            // Only get brand info for card payments
            const brandInfo = method.type === 'card' 
              ? getCardBrandIcon(method.brand)
              : { color: 'bg-indigo-600 text-white', label: 'Bank' }
            
            return (
              <div key={method.id} className="bg-white rounded-xl shadow border-2 border-gray-200 hover:border-pepe-primary transition-colors">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${brandInfo.color}`}>
                        {method.type === 'card' ? (
                          <CreditCardIcon className="w-6 h-6" />
                        ) : (
                          <BanknotesIcon className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-gray-900">
                            {method.type === 'card' 
                              ? `${brandInfo.label} Card`
                              : method.bankName || 'Bank Account'
                            }
                          </h3>
                          {method.isDefault && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600">
                          {method.type === 'card' 
                            ? `${formatCardNumber(method.last4)} • Expires ${method.expiry}`
                            : `${method.accountName} • •••• ${method.last4}`
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      {!method.isDefault && (
                        <>
                          <button
                            onClick={() => handleSetDefault(method.id)}
                            disabled={loading}
                            className="px-4 py-2 text-sm text-pepe-primary border border-pepe-primary rounded-lg hover:bg-pepe-primary hover:text-white disabled:opacity-50"
                          >
                            Set as Default
                          </button>
                          <button
                            onClick={() => handleDelete(method.id)}
                            disabled={loading}
                            className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-50"
                            title="Remove"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Security Info */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <ShieldCheckIcon className="w-6 h-6 text-green-600" />
              <h4 className="font-medium text-gray-900">Secure Payments</h4>
            </div>
            <p className="text-sm text-gray-600">
              Your payment information is encrypted and securely stored
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <CreditCardIcon className="w-6 h-6 text-blue-600" />
              <h4 className="font-medium text-gray-900">No Card Storage</h4>
            </div>
            <p className="text-sm text-gray-600">
              We don't store your card details on our servers
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <CheckCircleIcon className="w-6 h-6 text-purple-600" />
              <h4 className="font-medium text-gray-900">PCI Compliant</h4>
            </div>
            <p className="text-sm text-gray-600">
              We follow industry security standards for payment processing
            </p>
          </div>
        </div>
      </div>

      {/* Add Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add Payment Method</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                {(['card', 'bank'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 px-4 rounded-md text-center text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-white shadow text-pepe-primary'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab === 'card' ? 'Credit/Debit Card' : 'Bank Account'}
                  </button>
                ))}
              </div>

              {activeTab === 'card' ? (
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                        maxLength={3}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="saveCard"
                      className="w-4 h-4 text-pepe-primary rounded focus:ring-pepe-primary"
                    />
                    <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700">
                      Save this card for future purchases
                    </label>
                  </div>
                </form>
              ) : (
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name
                    </label>
                    <select className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary">
                      <option value="">Select Bank</option>
                      <option value="gtb">Guaranty Trust Bank</option>
                      <option value="zenith">Zenith Bank</option>
                      <option value="access">Access Bank</option>
                      <option value="firstbank">First Bank</option>
                      <option value="uba">United Bank for Africa</option>
                      <option value="fidelity">Fidelity Bank</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      placeholder="0123456789"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                      maxLength={10}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                    />
                  </div>
                </form>
              )}

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    alert('Payment method added!')
                  }}
                  className="px-6 py-2 bg-pepe-primary text-white rounded-lg hover:bg-pink-500"
                >
                  Add Payment Method
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}