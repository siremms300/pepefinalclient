// components/dashboard/RecentOrders.tsx
'use client'

import { useState, useEffect } from 'react'
import { ClockIcon, TruckIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

interface Order {
  _id: string
  orderId: string
  customer: {
    name: string
    email: string
  }
  total: number
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed'
  items: number
  createdAt: string
}

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, fetch from API
    // For now, use mock data
    const mockOrders: Order[] = [
      {
        _id: '1',
        orderId: 'ORD-001234',
        customer: { name: 'John Doe', email: 'john@example.com' },
        total: 12500,
        order_status: 'pending',
        payment_status: 'paid',
        items: 3,
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        _id: '2',
        orderId: 'ORD-001235',
        customer: { name: 'Jane Smith', email: 'jane@example.com' },
        total: 8900,
        order_status: 'processing',
        payment_status: 'paid',
        items: 2,
        createdAt: '2024-01-15T09:15:00Z'
      },
      {
        _id: '3',
        orderId: 'ORD-001236',
        customer: { name: 'Mike Johnson', email: 'mike@example.com' },
        total: 21000,
        order_status: 'shipped',
        payment_status: 'paid',
        items: 5,
        createdAt: '2024-01-14T14:20:00Z'
      },
      {
        _id: '4',
        orderId: 'ORD-001237',
        customer: { name: 'Sarah Williams', email: 'sarah@example.com' },
        total: 15600,
        order_status: 'delivered',
        payment_status: 'paid',
        items: 4,
        createdAt: '2024-01-14T11:45:00Z'
      },
      {
        _id: '5',
        orderId: 'ORD-001238',
        customer: { name: 'Robert Brown', email: 'robert@example.com' },
        total: 4500,
        order_status: 'cancelled',
        payment_status: 'refunded',
        items: 1,
        createdAt: '2024-01-13T16:10:00Z'
      }
    ]
    
    setOrders(mockOrders)
    setLoading(false)
  }, [])

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pepe-primary"></div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => {
            const StatusIcon = getStatusIcon(order.order_status)
            return (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">#{order.orderId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                    <div className="text-sm text-gray-500">{order.customer.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <StatusIcon className="w-4 h-4 mr-1.5" />
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.order_status)}`}>
                      {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.items} {order.items === 1 ? 'item' : 'items'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    ₦{order.total.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}