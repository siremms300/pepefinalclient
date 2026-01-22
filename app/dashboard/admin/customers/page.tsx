// app/dashboard/admin/customers/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  UserCircleIcon,
  CalendarIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface Customer {
  _id: string
  name: string
  email: string
  mobile?: string
  avatar?: string
  role: 'user' | 'admin' | 'rider'
  status: 'Active' | 'Inactive' | 'Suspended'
  createdAt: string
  last_login_date?: string
  orderCount?: number
  totalSpent?: number
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const itemsPerPage = 10

  useEffect(() => {
    fetchCustomers()
  }, [currentPage, statusFilter])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        role: 'user',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter })
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setCustomers(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (customerId: string, newStatus: Customer['status']) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/admin/users/${customerId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()
      if (data.success) {
        fetchCustomers()
      }
    } catch (error) {
      console.error('Error updating customer status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-yellow-100 text-yellow-800'
      case 'Suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
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
          <h1 className="text-2xl font-bold text-gray-900">Customers Management</h1>
          <p className="text-gray-600">Manage your customer accounts</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-pepe-primary text-white rounded-lg hover:bg-pink-500">
            + Add Customer
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">1,842</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCircleIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900">1,452</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Orders/Customer</p>
              <p className="text-2xl font-bold text-gray-900">3.2</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShoppingBagIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Spend/Customer</p>
              <p className="text-2xl font-bold text-gray-900">₦45,200</p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
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
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchCustomers()}
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
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={fetchCustomers}
              className="flex-1 px-4 py-2 bg-pepe-primary text-white rounded-lg hover:bg-pink-500"
            >
              Search
            </button>
            <button
              onClick={() => {
                setSearch('')
                setStatusFilter('')
                setCurrentPage(1)
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pepe-primary"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {customer.avatar ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={customer.avatar}
                                alt={customer.name}
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gradient-to-br from-pepe-primary to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {customer.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Joined {formatDate(customer.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400" />
                            {customer.email}
                          </div>
                          {customer.mobile && (
                            <div className="flex items-center text-sm text-gray-500">
                              <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                              {customer.mobile}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <ShoppingBagIcon className="w-4 h-4 mr-2 text-gray-400" />
                          {customer.orderCount || 0} orders
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-semibold text-gray-900">
                          <CurrencyDollarIcon className="w-4 h-4 mr-2 text-gray-400" />
                          ₦{(customer.totalSpent || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(customer.last_login_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedCustomer(customer)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          <select
                            value={customer.status}
                            onChange={(e) => handleStatusUpdate(customer._id, e.target.value as Customer['status'])}
                            className="text-sm border rounded px-2 py-1"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Suspended">Suspended</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, customers.length)} of{' '}
                  {customers.length} customers
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
                    disabled={customers.length < itemsPerPage}
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

      {/* Top Customers */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
          <p className="text-gray-600">Highest spending customers</p>
        </div>
        <div className="divide-y">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pepe-primary to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {['J', 'M', 'S', 'A', 'R'][i-1]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{['John Doe', 'Mary Smith', 'Sarah Johnson', 'Alex Brown', 'Robert Wilson'][i-1]}</p>
                    <p className="text-sm text-gray-500">Customer since Jan 2024</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₦{(125000 * i).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{12 * i} orders</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}



