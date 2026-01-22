// components/dashboard/TopProducts.tsx
'use client'

import { ShoppingBagIcon, StarIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'

interface Product {
  id: string
  name: string
  category: string
  sales: number
  revenue: number
  growth: number
  rating: number
  image: string
}

export default function TopProducts() {
  const products: Product[] = [
    {
      id: '1',
      name: 'Classic Cheeseburger',
      category: 'Burgers',
      sales: 245,
      revenue: 612500,
      growth: 15.2,
      rating: 4.8,
      image: '🍔'
    },
    {
      id: '2',
      name: 'Crispy Chicken Sandwich',
      category: 'Sandwiches',
      sales: 198,
      revenue: 495000,
      growth: 8.5,
      rating: 4.7,
      image: '🥪'
    },
    {
      id: '3',
      name: 'Fresh Garden Salad',
      category: 'Salads',
      sales: 156,
      revenue: 312000,
      growth: 22.3,
      rating: 4.9,
      image: '🥗'
    },
    {
      id: '4',
      name: 'Pepe\'s Special Pizza',
      category: 'Pizza',
      sales: 134,
      revenue: 402000,
      growth: -3.2,
      rating: 4.6,
      image: '🍕'
    },
    {
      id: '5',
      name: 'Chocolate Brownie Sundae',
      category: 'Desserts',
      sales: 112,
      revenue: 280000,
      growth: 12.7,
      rating: 4.8,
      image: '🍨'
    }
  ]

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg text-xl">
              {product.image}
            </div>
            <div>
              <div className="font-medium text-gray-900">{product.name}</div>
              <div className="text-sm text-gray-500">{product.category}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Sales */}
            <div className="text-right">
              <div className="font-semibold text-gray-900">{product.sales}</div>
              <div className="text-xs text-gray-500">Sales</div>
            </div>
            
            {/* Revenue */}
            <div className="text-right">
              <div className="font-semibold text-gray-900">₦{(product.revenue / 1000).toFixed(0)}K</div>
              <div className="text-xs text-gray-500">Revenue</div>
            </div>
            
            {/* Growth */}
            <div className="text-right">
              <div className={`flex items-center font-semibold ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.growth >= 0 ? (
                  <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                )}
                {Math.abs(product.growth)}%
              </div>
              <div className="text-xs text-gray-500">Growth</div>
            </div>
            
            {/* Rating */}
            <div className="text-right">
              <div className="flex items-center font-semibold text-gray-900">
                <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                {product.rating}
              </div>
              <div className="text-xs text-gray-500">Rating</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}