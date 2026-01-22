// app/dashboard/admin/page.tsx (Updated imports)
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/context/authContext'
import { 
  ShoppingBagIcon, 
  UsersIcon, 
  CurrencyDollarIcon, 
  TruckIcon
} from '@heroicons/react/24/outline'
import StatCard from '@/components/dashboard/StatCard'
import RecentOrders from '@/components/dashboard/RecentOrders'
import TopProducts from '@/components/dashboard/TopProducts'
import RevenueChart from '@/components/dashboard/RevenueChart'
// // app/dashboard/admin/page.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { useAuth } from '@/lib/context/authContext'
// import { 
//   ShoppingBagIcon, 
//   UsersIcon, 
//   CurrencyDollarIcon, 
//   TruckIcon,
//   ArrowTrendingUpIcon,
//   ChartBarIcon 
// } from '@heroicons/react/24/outline'
// import StatCard from '@/components/dashboard/StatCard'
// import RecentOrders from '@/components/dashboard/RecentOrders'
// import TopProducts from '@/components/dashboard/TopProducts'
// import RevenueChart from '@/components/dashboard/RevenueChart'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeCustomers: 0,
    pendingDeliveries: 0,
    monthlyGrowth: 0,
    averageOrderValue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setStats({
          totalOrders: data.data.totalOrders || 0,
          totalRevenue: data.data.totalRevenue || 0,
          activeCustomers: 0, // You'll need to implement this
          pendingDeliveries: data.data.pendingOrders || 0,
          monthlyGrowth: 15.5, // Example value
          averageOrderValue: data.data.totalRevenue / (data.data.totalOrders || 1)
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}. Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBagIcon}
          change="+12%"
          trend="up"
        />
        <StatCard
          title="Total Revenue"
          value={`₦${stats.totalRevenue.toLocaleString()}`}
          icon={CurrencyDollarIcon}
          change="+8.5%"
          trend="up"
        />
        <StatCard
          title="Active Customers"
          value={stats.activeCustomers}
          icon={UsersIcon}
          change="+5%"
          trend="up"
        />
        <StatCard
          title="Pending Deliveries"
          value={stats.pendingDeliveries}
          icon={TruckIcon}
          change="-2%"
          trend="down"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
            <select className="text-sm border rounded-lg px-3 py-1">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          <RevenueChart />
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
            <button className="text-pepe-primary text-sm font-medium">
              View All
            </button>
          </div>
          <TopProducts />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <p className="text-sm text-gray-600">Latest orders that need attention</p>
        </div>
        <RecentOrders />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Add New Product</h3>
          <p className="text-purple-100 mb-4">Quickly add new products to your store</p>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium">
            Add Product
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">View Analytics</h3>
          <p className="text-blue-100 mb-4">Detailed insights about your business</p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium">
            View Analytics
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Manage Riders</h3>
          <p className="text-green-100 mb-4">Approve and manage delivery riders</p>
          <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium">
            Manage Riders
          </button>
        </div>
      </div>
    </div>
  )
}