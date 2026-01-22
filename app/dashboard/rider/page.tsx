// app/dashboard/rider/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/context/authContext'
import { 
  TruckIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  CurrencyDollarIcon,
  MapPinIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface Delivery {
  _id: string
  orderId: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  status: 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled'
  amount: number
  distance: string
  estimatedTime: string
}

export default function RiderDashboard() {
  const { user } = useAuth()
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    todaysDeliveries: 0,
    totalEarnings: 0,
    todaysEarnings: 0,
    acceptanceRate: 0,
    averageRating: 0
  })
  const [loading, setLoading] = useState(true)
  const [isAvailable, setIsAvailable] = useState(true)

  useEffect(() => {
    fetchRiderData()
  }, [])

  const fetchRiderData = async () => {
    try {
      // Fetch rider stats
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/riders/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      }

      // Fetch pending deliveries
      const deliveriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/riders/orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (deliveriesResponse.ok) {
        const deliveriesData = await deliveriesResponse.json()
        setDeliveries(deliveriesData.data)
      }
    } catch (error) {
      console.error('Error fetching rider data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAvailability = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/riders/availability`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ available: !isAvailable })
      })
      
      if (response.ok) {
        setIsAvailable(!isAvailable)
      }
    } catch (error) {
      console.error('Error toggling availability:', error)
    }
  }

  const handleAcceptDelivery = async (deliveryId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/riders/orders/${deliveryId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        fetchRiderData() // Refresh data
      }
    } catch (error) {
      console.error('Error accepting delivery:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header with Availability Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rider Dashboard</h1>
          <p className="text-gray-600">Ready to deliver delicious food!</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm text-gray-600">{isAvailable ? 'Available' : 'Offline'}</span>
          </div>
          <button
            onClick={handleToggleAvailability}
            className={`px-4 py-2 rounded-lg font-medium ${
              isAvailable 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isAvailable ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Deliveries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todaysDeliveries}</p>
            </div>
            <TruckIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Earnings</p>
              <p className="text-2xl font-bold text-gray-900">₦{stats.todaysEarnings.toLocaleString()}</p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Deliveries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDeliveries}</p>
            </div>
            <UserGroupIcon className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Acceptance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.acceptanceRate}%</p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Available Deliveries */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Available Deliveries</h2>
          <p className="text-sm text-gray-600">Pick up new delivery requests</p>
        </div>
        
        <div className="divide-y">
          {deliveries.length > 0 ? (
            deliveries.map((delivery) => (
              <div key={delivery._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-gray-900">#{delivery.orderId}</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        {delivery.estimatedTime} away
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <UserGroupIcon className="w-4 h-4 mr-2" />
                        {delivery.customerName} • {delivery.customerPhone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        {delivery.deliveryAddress}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <TruckIcon className="w-4 h-4 mr-2" />
                        {delivery.distance} • ₦{delivery.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleAcceptDelivery(delivery._id)}
                    disabled={!isAvailable}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      isAvailable
                        ? 'bg-pepe-primary text-white hover:bg-pink-500'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No available deliveries at the moment
            </div>
          )}
        </div>
      </div>

      {/* Current Active Delivery */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Active Delivery</h3>
            {deliveries.some(d => d.status === 'accepted' || d.status === 'picked_up') ? (
              <div>
                <p className="text-green-100">Delivering order #ORD12345 to John Doe</p>
                <p className="text-sm text-green-200 mt-1">ETA: 15 minutes</p>
              </div>
            ) : (
              <p className="text-green-100">No active delivery. Accept a delivery to get started!</p>
            )}
          </div>
          <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}