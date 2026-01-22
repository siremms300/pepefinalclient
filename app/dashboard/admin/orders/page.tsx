'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowDownTrayIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

interface OrderItem {
  productId: string
  name: string
  image?: string
  quantity: number
  price: number
  pricingTier: 'retail' | 'wholesale'
}

interface Address {
  address_line: string
  city: string
  state: string
  pincode: string
  country: string
  mobile?: string
}

interface Order {
  _id: string
  orderId: string
  userId: {
    _id: string
    name: string
    email: string
    mobile?: string
  }
  items: OrderItem[]
  delivery_address: Address
  subtotal: number
  shipping: number
  total: number
  totalSavings: number
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method: 'cod' | 'card' | 'paypal' | 'bank_transfer'
  notes?: string
  createdAt: string
  updatedAt: string
}

interface OrderDetailsModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: (orderId: string, newStatus: Order['order_status']) => void
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ 
  order, 
  isOpen, 
  onClose,
  onStatusUpdate 
}) => {
  if (!order || !isOpen) return null

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cod': return 'Cash on Delivery'
      case 'card': return 'Card Payment'
      case 'paypal': return 'PayPal'
      case 'bank_transfer': return 'Bank Transfer'
      default: return method
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

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
              <p className="text-gray-600">Order #{order.orderId}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Order Info */}
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <UserCircleIcon className="w-5 h-5 mr-2" />
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <UserCircleIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="font-medium">{order.userId.name}</span>
                  </div>
                  <div className="flex items-center">
                    <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <span>{order.userId.email}</span>
                  </div>
                  {order.userId.mobile && (
                    <div className="flex items-center">
                      <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{order.userId.mobile}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  Delivery Address
                </h3>
                <div className="space-y-1">
                  <p className="text-gray-700">{order.delivery_address.address_line}</p>
                  <p className="text-gray-700">{order.delivery_address.city}, {order.delivery_address.state}</p>
                  <p className="text-gray-700">{order.delivery_address.pincode}, {order.delivery_address.country}</p>
                  {order.delivery_address.mobile && (
                    <p className="text-gray-700 mt-2">Phone: {order.delivery_address.mobile}</p>
                  )}
                </div>
              </div>

              {/* Order Notes */}
              {order.notes && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <ExclamationCircleIcon className="w-5 h-5 mr-2" />
                    Order Notes
                  </h3>
                  <p className="text-gray-700 italic">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Right Column - Order Details */}
            <div className="space-y-6">
              {/* Status Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2">Order Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
                    {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                  </span>
                </div>
                <div className="bg-white border rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentColor(order.payment_status)}`}>
                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white border rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                  Payment Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{getPaymentMethodText(order.payment_method)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span>{new Date(order.createdAt).toLocaleDateString('en-NG', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white border rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <ShoppingBagIcon className="w-5 h-5 mr-2" />
                  Order Items ({order.items.length})
                </h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center space-x-3">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <ShoppingBagIcon className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.pricingTier === 'wholesale' ? 'Wholesale' : 'Retail'} • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">₦{item.price.toLocaleString()} each</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>₦{order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span>₦{order.shipping.toLocaleString()}</span>
                  </div>
                  {order.totalSavings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Savings:</span>
                      <span>-₦{order.totalSavings.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span>₦{order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
            {order.order_status !== 'delivered' && order.order_status !== 'cancelled' && (
              <select
                value={order.order_status}
                onChange={(e) => onStatusUpdate(order._id, e.target.value as Order['order_status'])}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            )}
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Print Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchOrders()
  }, [currentPage, statusFilter, paymentFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(paymentFilter && { payment_status: paymentFilter })
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/all?${params}`, {
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

  const handleStatusUpdate = async (orderId: string, newStatus: Order['order_status']) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ order_status: newStatus })
      })

      const data = await response.json()
      if (data.success) {
        fetchOrders()
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, order_status: newStatus } : null)
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
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

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cod': return 'COD'
      case 'card': return 'Card'
      case 'paypal': return 'PayPal'
      case 'bank_transfer': return 'Transfer'
      default: return method
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600">View and manage customer orders</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <ArrowDownTrayIcon className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
            />
          </div>

          {/* Order Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
            >
              <option value="">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-pepe-primary text-white rounded-lg hover:bg-pink-500"
            >
              Apply Filters
            </button>
            <button
              onClick={() => {
                setSearch('')
                setStatusFilter('')
                setPaymentFilter('')
                setCurrentPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <TruckIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.order_status === 'pending').length}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₦{orders
                  .filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString())
                  .reduce((sum, order) => sum + order.total, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ₦{orders.length > 0 
                  ? Math.round(orders.reduce((sum, order) => sum + order.total, 0) / orders.length).toLocaleString()
                  : '0'}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShoppingBagIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pepe-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <TruckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">No orders match your current filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => {
                    const StatusIcon = getStatusIcon(order.order_status)
                    return (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="flex items-center">
                              <DocumentTextIcon className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="font-medium text-gray-900">#{order.orderId}</span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {formatDate(order.createdAt)}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              <span className="inline-flex items-center">
                                <ShoppingBagIcon className="w-3 h-3 mr-1" />
                                {order.items.length} items
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Payment: {getPaymentMethodText(order.payment_method)}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{order.userId.name}</div>
                            <div className="text-sm text-gray-500">{order.userId.email}</div>
                            {order.userId.mobile && (
                              <div className="text-sm text-gray-500">{order.userId.mobile}</div>
                            )}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <StatusIcon className="w-4 h-4 mr-2" />
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.order_status)}`}>
                              {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentColor(order.payment_status)}`}>
                              {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                            </span>
                            {order.payment_method === 'cod' && order.payment_status === 'pending' && (
                              <div className="text-xs text-yellow-600">Payment on delivery</div>
                            )}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-lg font-semibold text-gray-900">
                              ₦{order.total.toLocaleString()}
                            </div>
                            {order.totalSavings > 0 && (
                              <div className="text-xs text-green-600">
                                Saved ₦{order.totalSavings.toLocaleString()}
                              </div>
                            )}
                            <div className="text-xs text-gray-500">
                              Shipping: ₦{order.shipping.toLocaleString()}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(order)}
                              className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                            >
                              <EyeIcon className="w-4 h-4" />
                              <span>View</span>
                            </button>
                            <select
                              value={order.order_status}
                              onChange={(e) => handleStatusUpdate(order._id, e.target.value as Order['order_status'])}
                              className="px-2 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-pepe-primary"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirm</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancel</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, orders.length)} of{' '}
                  {orders.length} orders
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={orders.length < itemsPerPage}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedOrder(null)
        }}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  )
}










































// // app/dashboard/admin/orders/page.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { 
//   MagnifyingGlassIcon, 
//   FunnelIcon, 
//   ArrowDownTrayIcon,
//   EyeIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   ClockIcon,
//   TruckIcon
// } from '@heroicons/react/24/outline'

// interface Order {
//   _id: string
//   orderId: string
//   customer: {
//     name: string
//     email: string
//     phone?: string
//   }
//   items: Array<{
//     name: string
//     quantity: number
//     price: number
//   }>
//   total: number
//   order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
//   payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
//   createdAt: string
//   delivery_address?: {
//     address_line: string
//     city: string
//     state: string
//   }
// }

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([])
//   const [loading, setLoading] = useState(true)
//   const [search, setSearch] = useState('')
//   const [statusFilter, setStatusFilter] = useState('')
//   const [paymentFilter, setPaymentFilter] = useState('')
//   const [selectedOrders, setSelectedOrders] = useState<string[]>([])
//   const [currentPage, setCurrentPage] = useState(1)
//   const itemsPerPage = 10

//   useEffect(() => {
//     fetchOrders()
//   }, [currentPage, statusFilter, paymentFilter])

//   const fetchOrders = async () => {
//     try {
//       setLoading(true)
//       const params = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: itemsPerPage.toString(),
//         ...(search && { search }),
//         ...(statusFilter && { status: statusFilter }),
//         ...(paymentFilter && { payment_status: paymentFilter })
//       })

//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/all?${params}`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       })
      
//       const data = await response.json()
//       if (data.success) {
//         setOrders(data.data || [])
//       }
//     } catch (error) {
//       console.error('Error fetching orders:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleStatusUpdate = async (orderId: string, newStatus: Order['order_status']) => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/orders/${orderId}/status`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ order_status: newStatus })
//       })

//       const data = await response.json()
//       if (data.success) {
//         fetchOrders()
//       }
//     } catch (error) {
//       console.error('Error updating order status:', error)
//     }
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'pending': return ClockIcon
//       case 'confirmed': return CheckCircleIcon
//       case 'processing': return ClockIcon
//       case 'shipped': return TruckIcon
//       case 'delivered': return CheckCircleIcon
//       case 'cancelled': return XCircleIcon
//       default: return ClockIcon
//     }
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800'
//       case 'confirmed': return 'bg-blue-100 text-blue-800'
//       case 'processing': return 'bg-indigo-100 text-indigo-800'
//       case 'shipped': return 'bg-purple-100 text-purple-800'
//       case 'delivered': return 'bg-green-100 text-green-800'
//       case 'cancelled': return 'bg-red-100 text-red-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const getPaymentColor = (status: string) => {
//     switch (status) {
//       case 'paid': return 'bg-green-100 text-green-800'
//       case 'pending': return 'bg-yellow-100 text-yellow-800'
//       case 'failed': return 'bg-red-100 text-red-800'
//       case 'refunded': return 'bg-gray-100 text-gray-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-NG', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric'
//     })
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
//           <p className="text-gray-600">View and manage customer orders</p>
//         </div>
//         <div className="flex space-x-3">
//           <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//             <ArrowDownTrayIcon className="w-5 h-5" />
//             <span>Export</span>
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow p-4">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {/* Search */}
//           <div className="relative">
//             <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search orders..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
//               className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
//             />
//           </div>

//           {/* Order Status Filter */}
//           <div>
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
//             >
//               <option value="">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="confirmed">Confirmed</option>
//               <option value="processing">Processing</option>
//               <option value="shipped">Shipped</option>
//               <option value="delivered">Delivered</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>

//           {/* Payment Status Filter */}
//           <div>
//             <select
//               value={paymentFilter}
//               onChange={(e) => setPaymentFilter(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pepe-primary"
//             >
//               <option value="">All Payments</option>
//               <option value="paid">Paid</option>
//               <option value="pending">Pending</option>
//               <option value="failed">Failed</option>
//               <option value="refunded">Refunded</option>
//             </select>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex space-x-2">
//             <button
//               onClick={fetchOrders}
//               className="px-4 py-2 bg-pepe-primary text-white rounded-lg hover:bg-pink-500"
//             >
//               Apply Filters
//             </button>
//             <button
//               onClick={() => {
//                 setSearch('')
//                 setStatusFilter('')
//                 setPaymentFilter('')
//                 setCurrentPage(1)
//               }}
//               className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//             >
//               Clear
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white rounded-xl shadow p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Orders</p>
//               <p className="text-2xl font-bold text-gray-900">1,245</p>
//             </div>
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <TruckIcon className="w-6 h-6 text-blue-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Pending Orders</p>
//               <p className="text-2xl font-bold text-gray-900">42</p>
//             </div>
//             <div className="p-2 bg-yellow-100 rounded-lg">
//               <ClockIcon className="w-6 h-6 text-yellow-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Today's Revenue</p>
//               <p className="text-2xl font-bold text-gray-900">₦245,800</p>
//             </div>
//             <div className="p-2 bg-green-100 rounded-lg">
//               <TruckIcon className="w-6 h-6 text-green-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Avg. Order Value</p>
//               <p className="text-2xl font-bold text-gray-900">₦12,450</p>
//             </div>
//             <div className="p-2 bg-purple-100 rounded-lg">
//               <TruckIcon className="w-6 h-6 text-purple-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Orders Table */}
//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         {loading ? (
//           <div className="p-8 text-center">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pepe-primary"></div>
//           </div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Order ID
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Customer
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Payment
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Items
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Total
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {orders.map((order) => {
//                     const StatusIcon = getStatusIcon(order.order_status)
//                     return (
//                       <tr key={order._id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">
//                             #{order.orderId}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div>
//                             <div className="text-sm font-medium text-gray-900">
//                               {order.customer.name} 
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               {order.customer.email} 
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <StatusIcon className="w-4 h-4 mr-2" />
//                             <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.order_status)}`}>
//                               {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentColor(order.payment_status)}`}>
//                             {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {order.items.length} items
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-semibold text-gray-900">
//                             ₦{order.total.toLocaleString()}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {formatDate(order.createdAt)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handleStatusUpdate(order._id, 'confirmed')}
//                               className="text-blue-600 hover:text-blue-900"
//                               title="Confirm Order"
//                             >
//                               <CheckCircleIcon className="w-5 h-5" />
//                             </button>
//                             <button
//                               onClick={() => handleStatusUpdate(order._id, 'processing')}
//                               className="text-indigo-600 hover:text-indigo-900"
//                               title="Mark as Processing"
//                             >
//                               <ClockIcon className="w-5 h-5" />
//                             </button>
//                             <button
//                               onClick={() => handleStatusUpdate(order._id, 'shipped')}
//                               className="text-purple-600 hover:text-purple-900"
//                               title="Mark as Shipped"
//                             >
//                               <TruckIcon className="w-5 h-5" />
//                             </button>
//                             <button
//                               onClick={() => handleStatusUpdate(order._id, 'delivered')}
//                               className="text-green-600 hover:text-green-900"
//                               title="Mark as Delivered"
//                             >
//                               <CheckCircleIcon className="w-5 h-5" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     )
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="px-6 py-4 border-t border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div className="text-sm text-gray-700">
//                   Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
//                   {Math.min(currentPage * itemsPerPage, orders.length)} of{' '}
//                   {orders.length} orders
//                 </div>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                     disabled={currentPage === 1}
//                     className="px-3 py-1 border rounded disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(prev => prev + 1)}
//                     disabled={orders.length < itemsPerPage}
//                     className="px-3 py-1 border rounded disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Bulk Actions */}
//       <div className="bg-white rounded-xl shadow p-4">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Actions</h3>
//         <div className="flex space-x-4">
//           <select className="px-4 py-2 border rounded-lg">
//             <option>Bulk Actions</option>
//             <option>Mark as Processing</option>
//             <option>Mark as Shipped</option>
//             <option>Mark as Delivered</option>
//             <option>Cancel Orders</option>
//           </select>
//           <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
//             Apply
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }