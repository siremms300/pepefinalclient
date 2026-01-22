'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
  EyeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface OrderItem {
  productId: string
  name: string
  image?: string
  quantity: number
  price: number
}

interface Order {
  _id: string
  orderId: string
  items: OrderItem[]
  total: number
  subtotal: number
  shipping: number
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method: 'cod' | 'card' | 'paypal' | 'bank_transfer'
  createdAt: string
}

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        ...(statusFilter && { status: statusFilter })
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setOrders(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReorder = async (order: Order) => {
    try {
      // Add all items from order to cart
      for (const item of order.items) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity
          })
        })
        
        const data = await response.json()
        if (!data.success) {
          throw new Error('Failed to add item to cart')
        }
      }
      
      alert('Order items added to cart!')
    } catch (error) {
      console.error('Error reordering:', error)
      alert('Failed to add items to cart')
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ order_status: 'cancelled' })
      })

      const data = await response.json()
      if (data.success) {
        fetchOrders()
        alert('Order cancelled successfully')
      }
    } catch (error) {
      console.error('Error cancelling order:', error)
      alert('Failed to cancel order')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return ClockIcon
      case 'confirmed': return CheckCircleIcon
      case 'processing': return ClockIcon
      case 'shipped': return TruckIcon
      case 'delivered': return CheckCircleIcon
      case 'cancelled': return XCircleIcon
      default: return ClockIcon
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-indigo-100 text-indigo-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cod': return 'Cash on Delivery'
      case 'card': return 'Card Payment'
      case 'paypal': return 'PayPal'
      case 'bank_transfer': return 'Bank Transfer'
      default: return method
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const filteredOrders = orders.filter(order =>
    order.orderId.toLowerCase().includes(search.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">View and manage your orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
            >
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Refresh Button */}
          <div>
            <button
              onClick={fetchOrders}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2"
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pepe-primary"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-6">
            {statusFilter 
              ? `You have no ${statusFilter} orders`
              : "You haven't placed any orders yet"}
          </p>
          <a
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-pepe-primary text-white rounded-lg hover:bg-pink-500"
          >
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.order_status)
            return (
              <div key={order._id} className="bg-white rounded-xl shadow overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <ShoppingBagIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <h3 className="font-bold text-gray-900">Order #{order.orderId}</h3>
                          <p className="text-sm text-gray-600">
                            Placed on {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="w-5 h-5" />
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.order_status)}`}>
                          {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">₦{order.total.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <ShoppingBagIcon className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity} × ₦{item.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                    
                    {order.items.length > 2 && (
                      <div className="text-center text-gray-500 text-sm">
                        +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>₦{order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span>₦{order.shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span>{getPaymentMethodText(order.payment_method)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                      <span>Total:</span>
                      <span>₦{order.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                    <a
                      href={`/dashboard/user/orders/${order._id}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
                    >
                      View Details
                    </a>
                    {order.order_status === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                      >
                        Cancel Order
                      </button>
                    )}
                    {order.order_status === 'delivered' && (
                      <button
                        onClick={() => handleReorder(order)}
                        className="flex-1 px-4 py-2 bg-pepe-primary text-white rounded-lg hover:bg-pink-500 flex items-center justify-center space-x-2"
                      >
                        <ArrowPathIcon className="w-5 h-5" />
                        <span>Reorder</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Order Status Guide */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { status: 'pending', icon: ClockIcon, description: 'Your order has been received and is awaiting confirmation' },
            { status: 'confirmed', icon: CheckCircleIcon, description: 'Order confirmed and being prepared' },
            { status: 'processing', icon: ClockIcon, description: 'Order is being processed in the kitchen' },
            { status: 'shipped', icon: TruckIcon, description: 'Order is on the way to your delivery address' },
            { status: 'delivered', icon: CheckCircleIcon, description: 'Order has been successfully delivered' },
            { status: 'cancelled', icon: XCircleIcon, description: 'Order has been cancelled' }
          ].map((item) => {
            const Icon = item.icon
            const color = getStatusColor(item.status)
            return (
              <div key={item.status} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">{item.status}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}