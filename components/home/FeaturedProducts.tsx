// frontend/components/home/FeaturedProducts.tsx
'use client'

import { useState } from 'react'
import ProductCard from '@/components/dashboard/ProductCard'
import { StarIcon, FireIcon } from '@heroicons/react/24/solid'

export default function FeaturedProducts() {
  const [activeCategory, setActiveCategory] = useState('all')
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'brunch', name: 'Brunch' },
    { id: 'pastries', name: 'Pastries' },
    { id: 'beverages', name: 'Beverages' },
  ]

  const featuredProducts = [
    {
      id: 1,
      name: 'Avocado Toast Deluxe',
      description: 'Sourdough bread with smashed avocado, cherry tomatoes, and poached eggs',
      price: 4500,
      image: '/food1.jpg',
      category: 'breakfast',
      rating: 4.8,
      isPopular: true,
    },
    {
      id: 2,
      name: 'Pancake Stack',
      description: 'Fluffy buttermilk pancakes with maple syrup and fresh berries',
      price: 5200,
      image: '/food2.jpg',
      category: 'brunch',
      rating: 4.9,
      isPopular: true,
    },
    {
      id: 3,
      name: 'Croissant Breakfast',
      description: 'Freshly baked croissant with ham, cheese, and scrambled eggs',
      price: 3800,
      image: '/food3.jpg',
      category: 'breakfast',
      rating: 4.6,
      isPopular: false,
    },
    {
      id: 4,
      name: 'Iced Caramel Latte',
      description: 'Premium coffee with caramel syrup and cold milk',
      price: 2800,
      image: '/food4.jpg',
      category: 'beverages',
      rating: 4.7,
      isPopular: true,
    },
    {
      id: 5,
      name: 'Chocolate Chip Muffin',
      description: 'Freshly baked muffin with chocolate chips and walnuts',
      price: 1800,
      image: '/food5.jpg',
      category: 'pastries',
      rating: 4.5,
      isPopular: false,
    },
    {
      id: 6,
      name: 'Full English Breakfast',
      description: 'Sausages, bacon, eggs, beans, mushrooms, and toast',
      price: 6500,
      image: '/food6.jpg',
      category: 'brunch',
      rating: 4.8,
      isPopular: true,
    },
  ]

  const filteredProducts = activeCategory === 'all' 
    ? featuredProducts 
    : featuredProducts.filter(product => product.category === activeCategory)

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-pepe-secondary text-pepe-dark px-4 py-2 rounded-full mb-4">
            <FireIcon className="w-5 h-5 text-pepe-primary" />
            <span className="font-semibold">Featured Items</span>
          </div>
          <h2 className="font-display font-bold text-4xl text-pepe-dark mb-4">
            Our Most Popular Dishes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our customer favorites. Each dish is prepared with fresh ingredients and served with love.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-pepe-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                {/* Product Image */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-pepe-secondary to-pepe-light">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto bg-pepe-primary/20 rounded-full flex items-center justify-center mb-4">
                        <span className="text-5xl">🍽️</span>
                      </div>
                      <p className="text-pepe-dark font-medium">Food Image</p>
                    </div>
                  </div>
                  
                  {/* Popular Badge */}
                  {product.isPopular && (
                    <div className="absolute top-4 left-4 bg-pepe-primary text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                      <FireIcon className="w-4 h-4 mr-1" />
                      Popular
                    </div>
                  )}
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
                    <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-semibold">{product.rating}</span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-pepe-primary bg-pepe-secondary px-3 py-1 rounded-full">
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-display font-bold text-pepe-dark mb-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-pepe-dark">₦{product.price.toLocaleString()}</span>
                    </div>
                    
                    <button className="bg-pepe-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-500 transition-colors flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center px-8 py-3 border-2 border-pepe-primary text-pepe-primary font-semibold rounded-lg hover:bg-pepe-primary hover:text-white transition-colors">
            View Full Menu
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}


