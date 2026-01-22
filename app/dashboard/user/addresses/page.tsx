'use client'

import { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  MapPinIcon, 
  PencilIcon, 
  TrashIcon,
  CheckCircleIcon,
  HomeIcon,
  BriefcaseIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface Address {
  _id: string
  address_line: string
  city: string
  state: string
  pincode: string
  country: string
  mobile?: string
  status: boolean
  type?: 'home' | 'work' | 'other'
}

export default function UserAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState({
    address_line: '',
    city: '',
    state: '',
    pincode: '',
    country: 'Nigeria',
    mobile: '',
    type: 'home' as 'home' | 'work' | 'other',
    isDefault: false
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setAddresses(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingAddress
        ? `${process.env.NEXT_PUBLIC_API_URL}/addresses/${editingAddress._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/addresses`

      const response = await fetch(url, {
        method: editingAddress ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        if (formData.isDefault) {
          // Set as default address
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${data.data._id}/default`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
        }
        
        fetchAddresses()
        setShowAddModal(false)
        setEditingAddress(null)
        resetForm()
        alert(editingAddress ? 'Address updated!' : 'Address added!')
      }
    } catch (error) {
      console.error('Error saving address:', error)
      alert('Failed to save address')
    }
  }

  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        fetchAddresses()
        alert('Address deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting address:', error)
      alert('Failed to delete address')
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addresses/${addressId}/default`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        fetchAddresses()
        alert('Default address updated!')
      }
    } catch (error) {
      console.error('Error setting default address:', error)
      alert('Failed to update default address')
    }
  }

  const resetForm = () => {
    setFormData({
      address_line: '',
      city: '',
      state: '',
      pincode: '',
      country: 'Nigeria',
      mobile: '',
      type: 'home',
      isDefault: false
    })
    setEditingAddress(null)
  }

  const startEdit = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      address_line: address.address_line,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      mobile: address.mobile || '',
      type: address.type || 'home',
      isDefault: address.status
    })
    setShowAddModal(true)
  }

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'home': return HomeIcon
      case 'work': return BriefcaseIcon
      default: return UserIcon
    }
  }

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'home': return 'bg-blue-100 text-blue-600'
      case 'work': return 'bg-purple-100 text-purple-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
          <p className="text-gray-600">Manage your delivery addresses</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowAddModal(true)
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-pepe-primary text-white rounded-lg hover:bg-pink-500"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Addresses Grid */}
      {loading ? (
        <div className="text-center py-12">Loading addresses...</div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <MapPinIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
          <p className="text-gray-600 mb-6">Add your first delivery address to get started</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-6 py-3 bg-pepe-primary text-white rounded-lg hover:bg-pink-500"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => {
            const TypeIcon = getTypeIcon(address.type)
            return (
              <div key={address._id} className="bg-white rounded-xl shadow border-2 border-gray-200 hover:border-pepe-primary transition-colors">
                <div className="p-6">
                  {/* Address Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(address.type)}`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 capitalize">
                          {address.type || 'Address'}
                        </h3>
                        {address.status && (
                          <div className="flex items-center text-green-600 text-sm">
                            <CheckCircleIcon className="w-4 h-4 mr-1" />
                            Default Address
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(address)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      {!address.status && (
                        <button
                          onClick={() => handleDelete(address._id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="space-y-2">
                    <p className="text-gray-900">{address.address_line}</p>
                    <p className="text-gray-900">{address.city}, {address.state}</p>
                    <p className="text-gray-900">{address.pincode}, {address.country}</p>
                    {address.mobile && (
                      <p className="text-gray-900 mt-3">Phone: {address.mobile}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    {!address.status ? (
                      <button
                        onClick={() => handleSetDefault(address._id)}
                        className="w-full px-4 py-2 border border-pepe-primary text-pepe-primary rounded-lg hover:bg-pepe-primary hover:text-white transition-colors"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <div className="text-center text-green-600 font-medium">
                        ✓ This is your default delivery address
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Address Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['home', 'work', 'other'] as const).map((type) => {
                      const Icon = getTypeIcon(type)
                      return (
                        <label
                          key={type}
                          className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer ${
                            formData.type === type
                              ? 'border-pepe-primary bg-pepe-primary bg-opacity-5'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            value={type}
                            checked={formData.type === type}
                            onChange={(e) => setFormData({...formData, type: e.target.value as 'home' | 'work' | 'other'})}
                            className="sr-only"
                          />
                          <Icon className="w-6 h-6 mb-2" />
                          <span className="text-sm font-medium capitalize">{type}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Address Line */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <textarea
                    value={formData.address_line}
                    onChange={(e) => setFormData({...formData, address_line: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                    required
                    placeholder="House number, street name, building name"
                  />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                      required
                      placeholder="e.g., Lagos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                      required
                    >
                      <option value="">Select State</option>
                      <option value="Lagos">Lagos</option>
                      <option value="Abuja">Abuja</option>
                      <option value="Rivers">Rivers</option>
                      <option value="Kano">Kano</option>
                      <option value="Oyo">Oyo</option>
                      <option value="Delta">Delta</option>
                      <option value="Enugu">Enugu</option>
                      <option value="Cross River">Cross River</option>
                    </select>
                  </div>
                </div>

                {/* Pincode & Country */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                      required
                      placeholder="e.g., 100001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                      required
                    >
                      <option value="Nigeria">Nigeria</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Kenya">Kenya</option>
                      <option value="South Africa">South Africa</option>
                    </select>
                  </div>
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
                    placeholder="+234 800 000 0000"
                  />
                </div>

                {/* Set as Default */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                    className="w-4 h-4 text-pepe-primary rounded focus:ring-pepe-primary"
                  />
                  <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                    Set as default delivery address
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      resetForm()
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-pepe-primary text-white rounded-lg hover:bg-pink-500"
                  >
                    {editingAddress ? 'Update Address' : 'Add Address'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}