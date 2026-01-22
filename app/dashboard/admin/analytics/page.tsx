// app/dashboard/admin/analytics/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  TruckIcon
} from '@heroicons/react/24/outline'

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('month')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    activeRiders: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    customerGrowth: 0
  })

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      // Fetch from API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setStats({
          totalRevenue: data.data.totalRevenue || 0,
          totalOrders: data.data.totalOrders || 0,
          totalCustomers: 0, // You'll need to implement this
          activeRiders: 0, // You'll need to implement this
          revenueGrowth: 12.5,
          orderGrowth: 8.2,
          customerGrowth: 5.7
        })
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue (₦)',
        data: [45000, 52000, 48000, 61000, 78000, 85000, 92000],
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        fill: true
      }
    ]
  }

  const orderData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Orders',
        data: [120, 145, 130, 165, 195, 210, 230],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true
      }
    ]
  }

  const topProducts = [
    { name: 'Classic Cheeseburger', sales: 245, revenue: 612500 },
    { name: 'Crispy Chicken Sandwich', sales: 198, revenue: 495000 },
    { name: 'Fresh Garden Salad', sales: 156, revenue: 312000 },
    { name: 'Pepe\'s Special Pizza', sales: 134, revenue: 402000 },
    { name: 'Chocolate Brownie Sundae', sales: 112, revenue: 280000 }
  ]

  const topCustomers = [
    { name: 'John Doe', orders: 24, spent: 245000 },
    { name: 'Mary Smith', orders: 18, spent: 189000 },
    { name: 'Sarah Johnson', orders: 16, spent: 156000 },
    { name: 'Alex Brown', orders: 14, spent: 142000 },
    { name: 'Robert Wilson', orders: 12, spent: 125000 }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pepe-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Business insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border rounded-lg px-3 py-1"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-pepe-primary text-white rounded-lg hover:bg-pink-500">
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₦{stats.totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">{stats.revenueGrowth}%</span>
                <span className="text-sm text-gray-500 ml-2">vs last period</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalOrders}
              </p>
              <div className="flex items-center mt-2">
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">{stats.orderGrowth}%</span>
                <span className="text-sm text-gray-500 ml-2">vs last period</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalCustomers}
              </p>
              <div className="flex items-center mt-2">
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">{stats.customerGrowth}%</span>
                <span className="text-sm text-gray-500 ml-2">vs last period</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <UsersIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Riders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.activeRiders}
              </p>
              <div className="flex items-center mt-2">
                <ArrowTrendingDownIcon className="w-4 h-4 text-red-600 mr-1" />
                <span className="text-sm text-red-600">-2%</span>
                <span className="text-sm text-gray-500 ml-2">vs last period</span>
              </div>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <TruckIcon className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-pepe-primary mr-2"></div>
                <span>Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            {/* Simple bar chart using divs */}
            <div className="flex items-end h-48 space-x-2 mt-4">
              {revenueData.datasets[0].data.map((value, index) => {
                const height = (value / Math.max(...revenueData.datasets[0].data)) * 100
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-pepe-primary to-pink-500 rounded-t-lg"
                      style={{ height: `${height}%` }}
                    />
                    <div className="mt-2 text-xs text-gray-500">{revenueData.labels[index]}</div>
                    <div className="text-xs font-medium text-gray-700 mt-1">
                      ₦{(value / 1000).toFixed(0)}K
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Order Trends</h2>
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                <span>Orders</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <div className="flex items-end h-48 space-x-2 mt-4">
              {orderData.datasets[0].data.map((value, index) => {
                const height = (value / Math.max(...orderData.datasets[0].data)) * 100
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-purple-500 to-violet-500 rounded-t-lg"
                      style={{ height: `${height}%` }}
                    />
                    <div className="mt-2 text-xs text-gray-500">{orderData.labels[index]}</div>
                    <div className="text-xs font-medium text-gray-700 mt-1">
                      {value}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products & Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
            <p className="text-sm text-gray-600">Best selling products by revenue</p>
          </div>
          <div className="divide-y">
            {topProducts.map((product, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
                      <span className="text-lg">{['🍔', '🥪', '🥗', '🍕', '🍨'][index]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₦{(product.revenue / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-gray-500">Revenue</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Customers</h2>
            <p className="text-sm text-gray-600">Highest spending customers</p>
          </div>
          <div className="divide-y">
            {topCustomers.map((customer, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-pepe-primary to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₦{(customer.spent / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-gray-500">Total spent</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">4.7</div>
            <div className="text-sm text-gray-600 mt-1">Average Rating</div>
            <div className="flex justify-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">92%</div>
            <div className="text-sm text-gray-600 mt-1">Order Completion Rate</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">24min</div>
            <div className="text-sm text-gray-600 mt-1">Average Delivery Time</div>
            <div className="text-sm text-green-600 mt-1">
              <ArrowTrendingDownIcon className="w-4 h-4 inline mr-1" />
              12% faster than last month
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}