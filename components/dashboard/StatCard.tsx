// components/dashboard/StatCard.tsx
import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  change?: string
  trend?: 'up' | 'down'
}

export default function StatCard({ title, value, icon: Icon, change, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? '↗' : '↘'} {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-pepe-primary/10 rounded-lg">
          <Icon className="w-6 h-6 text-pepe-primary" />
        </div>
      </div>
    </div>
  )
}