// app/dashboard/user/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/context/authContext'
import { 
  ShoppingBagIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  MapPinIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Order {
  _id: string
  orderId: string
  total: number
  order_status: string
  createdAt: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export default function UserDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // Fetch orders
      const ordersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const ordersData = await ordersResponse.json()
      
      if (ordersData.success) {
        setOrders(ordersData.data.slice(0, 5))
        
        // Calculate stats
        const stats = ordersData.data.reduce((acc: any, order: Order) => {
          acc.totalOrders++
          if (order.order_status === 'pending') acc.pendingOrders++
          if (order.order_status === 'delivered') acc.deliveredOrders++
          if (order.order_status === 'cancelled') acc.cancelledOrders++
          return acc
        }, { totalOrders: 0, pendingOrders: 0, deliveredOrders: 0, cancelledOrders: 0 })
        
        setStats(stats)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return ClockIcon
      case 'processing': return ClockIcon
      case 'shipped': return TruckIcon
      case 'delivered': return CheckCircleIcon
      case 'cancelled': return XCircleIcon
      default: return ClockIcon
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pepe-primary to-pink-500 rounded-2xl shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-white/90">Here's your order summary and quick actions</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <ShoppingBagIcon className="w-8 h-8 text-pepe-primary" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
            </div>
            <ClockIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">{stats.deliveredOrders}</p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelledOrders}</p>
            </div>
            <XCircleIcon className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Recent Orders and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="divide-y">
            {orders.length > 0 ? (
              orders.map((order) => {
                const StatusIcon = getStatusIcon(order.order_status)
                return (
                  <div key={order._id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">#{order.orderId}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₦{order.total.toLocaleString()}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {order.order_status}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-8 text-center text-gray-500">
                No orders yet
              </div>
            )}
          </div>
          {orders.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <Link href="/dashboard/user/orders" className="text-pepe-primary hover:text-pink-500 font-medium">
                View all orders →
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/user/addresses"
              className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
            >
              <MapPinIcon className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Manage Addresses</p>
                <p className="text-sm text-gray-600">Add or edit delivery addresses</p>
              </div>
            </Link>

            <Link
              href="/dashboard/user/payments"
              className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
            >
              <CreditCardIcon className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Payment Methods</p>
                <p className="text-sm text-gray-600">Add or remove payment methods</p>
              </div>
            </Link>

            <Link
              href="/products"
              className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
            >
              <ShoppingBagIcon className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Continue Shopping</p>
                <p className="text-sm text-gray-600">Browse our delicious menu</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Special Offers */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Special Offer! 🎁</h3>
            <p className="text-blue-100">Get 15% off your next order with code: PEPE15</p>
          </div>
          <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  )
}