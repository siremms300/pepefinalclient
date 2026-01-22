// components/dashboard/RevenueChart.tsx
'use client'

import { useState } from 'react'
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

export default function RevenueChart() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const revenueData = {
    month: [
      { day: 'Mon', revenue: 85000 },
      { day: 'Tue', revenue: 92000 },
      { day: 'Wed', revenue: 78000 },
      { day: 'Thu', revenue: 105000 },
      { day: 'Fri', revenue: 125000 },
      { day: 'Sat', revenue: 98000 },
      { day: 'Sun', revenue: 89000 }
    ],
    week: [
      { day: '1', revenue: 15000 },
      { day: '2', revenue: 22000 },
      { day: '3', revenue: 18000 },
      { day: '4', revenue: 25000 },
      { day: '5', revenue: 32000 },
      { day: '6', revenue: 28000 },
      { day: '7', revenue: 24000 }
    ]
  }

  const data = revenueData[selectedPeriod as keyof typeof revenueData]
  const maxRevenue = Math.max(...data.map(d => d.revenue))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-3xl font-bold text-gray-900">₦{data.reduce((a, b) => a + b.revenue, 0).toLocaleString()}</p>
          <div className="flex items-center text-sm text-green-600 mt-1">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            <span>12.5% increase from last {selectedPeriod}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          {['week', 'month'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${
                selectedPeriod === period
                  ? 'bg-pepe-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 flex items-end space-x-2">
        {data.map((item, index) => {
          const height = (item.revenue / maxRevenue) * 100
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-pepe-primary to-pink-500 rounded-t-lg"
                style={{ height: `${height}%` }}
              />
              <div className="mt-2 text-xs text-gray-500">{item.day}</div>
              <div className="text-xs font-medium text-gray-700 mt-1">
                ₦{(item.revenue / 1000).toFixed(0)}K
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-pepe-primary mr-2"></div>
            <span className="text-gray-600">Revenue</span>
          </div>
          <div className="text-gray-900 font-medium">
            ₦{data.reduce((a, b) => a + b.revenue, 0).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}