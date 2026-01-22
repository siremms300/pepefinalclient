// app/dashboard/admin/riders/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon, 
  TruckIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PhoneIcon,
  MapPinIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface Rider {
  _id: string
  name: string
  email: string
  mobile: string
  avatar?: string
  status: 'Active' | 'Inactive' | 'Suspended' | 'Pending'
  vehicleType?: string
  licenseNumber?: string
  rating?: number
  completedDeliveries?: number
  totalEarnings?: number
  location?: string
  createdAt: string
  last_active?: string
}

export default function AdminRidersPage() {
  const [riders, setRiders] = useState<Rider[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null)
  const itemsPerPage = 10

  useEffect(() => {
    fetchRiders()
  }, [currentPage, statusFilter])

  const fetchRiders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        role: 'rider',
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
        setRiders(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching riders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (riderId: string, newStatus: Rider['status']) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/admin/users/${riderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()
      if (data.success) {
        fetchRiders()
      }
    } catch (error) {
      console.error('Error updating rider status:', error)
    }
  }

  const handleApproveRider = async (riderId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/admin/users/${riderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Active' })
      })

      const data = await response.json()
      if (data.success) {
        fetchRiders()
        alert('Rider approved successfully!')
      }
    } catch (error) {
      console.error('Error approving rider:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-yellow-100 text-yellow-800'
      case 'Suspended': return 'bg-red-100 text-red-800'
      case 'Pending': return 'bg-blue-100 text-blue-800'
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
          <h1 className="text-2xl font-bold text-gray-900">Riders Management</h1>
          <p className="text-gray-600">Manage your delivery riders</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-pepe-primary text-white rounded-lg hover:bg-pink-500">
            + Add Rider
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Riders</p>
              <p className="text-2xl font-bold text-gray-900">42</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <TruckIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Riders</p>
              <p className="text-2xl font-bold text-gray-900">28</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Rating</p>
              <p className="text-2xl font-bold text-gray-900">4.7</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <StarIcon className="w-6 h-6 text-purple-600" />
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
              placeholder="Search riders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchRiders()}
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
              <option value="Pending">Pending Approval</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={fetchRiders}
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

      {/* Riders Table */}
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
                      Rider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deliveries
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Earnings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {riders.map((rider) => (
                    <tr key={rider._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {rider.avatar ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={rider.avatar}
                                alt={rider.name}
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {rider.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {rider.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {rider.vehicleType || 'Motorcycle'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                            {rider.mobile}
                          </div>
                          {rider.location && (
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
                              {rider.location}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(rider.status)}`}>
                          {rider.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <TruckIcon className="w-4 h-4 mr-2 text-gray-400" />
                          {rider.completedDeliveries || 0} deliveries
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ₦{(rider.totalEarnings || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium text-gray-900">
                            {rider.rating?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {rider.status === 'Pending' && (
                            <button
                              onClick={() => handleApproveRider(rider._id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedRider(rider)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          <select
                            value={rider.status}
                            onChange={(e) => handleStatusUpdate(rider._id, e.target.value as Rider['status'])}
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
                  {Math.min(currentPage * itemsPerPage, riders.length)} of{' '}
                  {riders.length} riders
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
                    disabled={riders.length < itemsPerPage}
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

      {/* Pending Approvals */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
          <p className="text-gray-600">Riders waiting for approval</p>
        </div>
        <div className="divide-y">
          {riders.filter(r => r.status === 'Pending').slice(0, 3).map((rider) => (
            <div key={rider._id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {rider.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{rider.name}</p>
                    <p className="text-sm text-gray-500">Applied {formatDate(rider.createdAt)}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApproveRider(rider._id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(rider._id, 'Suspended')}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
          {riders.filter(r => r.status === 'Pending').length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No pending approvals
            </div>
          )}
        </div>
      </div>
    </div>
  )
}