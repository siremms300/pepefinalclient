 

// components/products/ProductFilters.tsx - UPDATED to prevent infinite loop
'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  FunnelIcon, 
  XMarkIcon,
  ChevronDownIcon,
  TagIcon,
  StarIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
  CheckIcon,
  FireIcon
} from '@heroicons/react/24/outline'
import { categoryService } from '@/lib/services/api'

interface Category {
  id: string
  name: string
  count?: number
}

interface ProductFiltersProps {
  onFilterChange?: (filters: {
    category: string
    priceRange: string
    sortBy: string
    minRating: number
  }) => void
}

const priceRanges = [
  { id: 'all', name: 'All Prices' },
  { id: 'under-2000', name: 'Under ₦2,000' },
  { id: '2000-4000', name: '₦2,000 - ₦4,000' },
  { id: '4000-6000', name: '₦4,000 - ₦6,000' },
  { id: 'over-6000', name: 'Over ₦6,000' },
]

const sortOptions = [
  { id: 'popular', name: 'Most Popular', icon: FireIcon },
  { id: 'newest', name: 'Newest', icon: TagIcon },
  { id: 'price-low', name: 'Price: Low to High', icon: TagIcon },
  { id: 'price-high', name: 'Price: High to Low', icon: TagIcon },
  { id: 'rating', name: 'Top Rated', icon: StarIcon },
  { id: 'prep-time', name: 'Quickest', icon: ClockIcon },
]

const ratingOptions = [
  { value: 0, name: 'Any Rating' },
  { value: 4.5, name: '4.5+ Stars' },
  { value: 4, name: '4+ Stars' },
  { value: 3.5, name: '3.5+ Stars' },
]

export default function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPrice, setSelectedPrice] = useState('all')
  const [selectedSort, setSelectedSort] = useState('popular')
  const [selectedRating, setSelectedRating] = useState(0)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: false,
    sort: false,
    rating: false
  })

  useEffect(() => {
    loadCategories()
  }, [])

  // Use useCallback to memoize the filter change function
  const handleFilterChange = useCallback(() => {
    if (onFilterChange) {
      onFilterChange({
        category: selectedCategory,
        priceRange: selectedPrice,
        sortBy: selectedSort,
        minRating: selectedRating
      })
    }
  }, [selectedCategory, selectedPrice, selectedSort, selectedRating, onFilterChange])

  // Call handleFilterChange only when filter values change
  useEffect(() => {
    handleFilterChange()
  }, [handleFilterChange])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await categoryService.getCategories()
      
      if (response?.success) {
        const cats = response.data.map((cat: any) => ({
          id: cat._id,
          name: cat.name,
          count: 0
        }))
        setCategories(cats)
      }
    } catch (error) {
      console.error('Failed to load categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setSelectedPrice('all')
    setSelectedSort('popular')
    setSelectedRating(0)
  }

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedPrice !== 'all',
    selectedSort !== 'popular',
    selectedRating > 0
  ].filter(Boolean).length

  return (
    <>
      {/* Mobile Trigger Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center justify-center w-full p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow mb-6"
        >
          <div className="flex items-center">
            <AdjustmentsHorizontalIcon className="w-5 h-5 text-pepe-primary mr-3" />
            <span className="font-medium text-gray-900">Filter & Sort</span>
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-pepe-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </div>
        </button>

        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-50">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-[85%] max-w-md bg-white shadow-2xl">
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Filter Menu</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {activeFiltersCount > 0 ? `${activeFiltersCount} active filters` : 'No filters applied'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsMobileOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XMarkIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Categories */}
                  <div className="mb-8">
                    <button
                      onClick={() => toggleSection('category')}
                      className="flex items-center justify-between w-full mb-4"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                      <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.category ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedSections.category && (
                      <div className="space-y-2">
                        <button
                          onClick={() => setSelectedCategory('all')}
                          className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                            selectedCategory === 'all'
                              ? 'bg-pepe-primary text-white'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <span className="font-medium">All Categories</span>
                          {selectedCategory === 'all' && (
                            <CheckIcon className="w-5 h-5 ml-auto" />
                          )}
                        </button>
                        
                        {loading ? (
                          <div className="text-center py-4 text-gray-500">Loading...</div>
                        ) : categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                              selectedCategory === category.id
                                ? 'bg-pepe-primary text-white'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <span className="font-medium">{category.name}</span>
                            {selectedCategory === category.id && (
                              <CheckIcon className="w-5 h-5" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sort Options */}
                  <div className="mb-8">
                    <button
                      onClick={() => toggleSection('sort')}
                      className="flex items-center justify-between w-full mb-4"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Sort By</h3>
                      <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.sort ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedSections.sort && (
                      <div className="space-y-2">
                        {sortOptions.map((option) => {
                          const Icon = option.icon
                          return (
                            <button
                              key={option.id}
                              onClick={() => setSelectedSort(option.id)}
                              className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                                selectedSort === option.id
                                  ? 'bg-pepe-primary text-white'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <Icon className="w-5 h-5 mr-3" />
                              <span className="font-medium">{option.name}</span>
                              {selectedSort === option.id && (
                                <CheckIcon className="w-5 h-5 ml-auto" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Price Range */}
                  <div className="mb-8">
                    <button
                      onClick={() => toggleSection('price')}
                      className="flex items-center justify-between w-full mb-4"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Price Range</h3>
                      <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedSections.price && (
                      <div className="space-y-2">
                        {priceRanges.map((range) => (
                          <button
                            key={range.id}
                            onClick={() => setSelectedPrice(range.id)}
                            className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                              selectedPrice === range.id
                                ? 'bg-pepe-primary text-white'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <span className="font-medium">{range.name}</span>
                            {selectedPrice === range.id && (
                              <CheckIcon className="w-5 h-5" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="mb-8">
                    <button
                      onClick={() => toggleSection('rating')}
                      className="flex items-center justify-between w-full mb-4"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">Minimum Rating</h3>
                      <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedSections.rating && (
                      <div className="space-y-2">
                        {ratingOptions.map((rating) => (
                          <button
                            key={rating.value}
                            onClick={() => setSelectedRating(rating.value)}
                            className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                              selectedRating === rating.value
                                ? 'bg-pepe-primary text-white'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center">
                              <StarIcon className="w-5 h-5 mr-3 text-yellow-500" />
                              <span className="font-medium">{rating.name}</span>
                            </div>
                            {selectedRating === rating.value && (
                              <CheckIcon className="w-5 h-5" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t p-6">
                  <div className="flex gap-3">
                    <button
                      onClick={clearFilters}
                      className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setIsMobileOpen(false)}
                      className="flex-1 py-3 bg-pepe-primary text-white rounded-lg font-medium hover:bg-pink-500"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar - Clean Modern Design */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm p-6 space-y-8 sticky top-24">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <div className="flex items-center">
            <FunnelIcon className="w-6 h-6 text-pepe-primary mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              <p className="text-sm text-gray-500 mt-1">
                {activeFiltersCount > 0 ? `${activeFiltersCount} active` : 'No filters applied'}
              </p>
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-pepe-primary hover:text-pink-500 font-medium px-3 py-1 hover:bg-pepe-primary/10 rounded-lg transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Categories Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Categories</h3>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center w-full p-3 rounded-xl transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-pepe-primary to-pink-500 text-white shadow-md'
                  : 'hover:bg-gray-50 hover:shadow-sm border border-gray-200'
              }`}
            >
              <span className="font-medium">All Categories</span>
              {selectedCategory === 'all' && (
                <CheckIcon className="w-5 h-5 ml-auto" />
              )}
            </button>
            
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pepe-primary"></div>
                <span className="ml-3 text-gray-500 text-sm">Loading...</span>
              </div>
            ) : categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center justify-between w-full p-3 rounded-xl transition-all ${
                  selectedCategory === category.id
                    ? 'bg-pepe-primary text-white shadow-md'
                    : 'hover:bg-gray-50 hover:shadow-sm border border-gray-200'
                }`}
              >
                <span className="font-medium">{category.name}</span>
                <div className="flex items-center">
                  {selectedCategory === category.id && (
                    <CheckIcon className="w-5 h-5 mr-2" />
                  )}
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    selectedCategory === category.id
                      ? 'bg-white/20'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.count || 0}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Sort By</h3>
          <div className="space-y-2">
            {sortOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedSort(option.id)}
                  className={`flex items-center w-full p-3 rounded-xl transition-all ${
                    selectedSort === option.id
                      ? 'bg-pepe-primary text-white shadow-md'
                      : 'hover:bg-gray-50 hover:shadow-sm border border-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{option.name}</span>
                  {selectedSort === option.id && (
                    <CheckIcon className="w-5 h-5 ml-auto" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Price Range Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Price Range</h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setSelectedPrice(range.id)}
                className={`flex items-center justify-between w-full p-3 rounded-xl transition-all ${
                  selectedPrice === range.id
                    ? 'bg-pepe-primary text-white shadow-md'
                    : 'hover:bg-gray-50 hover:shadow-sm border border-gray-200'
                }`}
              >
                <span className="font-medium">{range.name}</span>
                {selectedPrice === range.id && (
                  <CheckIcon className="w-5 h-5" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Minimum Rating Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Minimum Rating</h3>
          <div className="space-y-2">
            {ratingOptions.map((rating) => (
              <button
                key={rating.value}
                onClick={() => setSelectedRating(rating.value)}
                className={`flex items-center justify-between w-full p-3 rounded-xl transition-all ${
                  selectedRating === rating.value
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-md'
                    : 'hover:bg-gray-50 hover:shadow-sm border border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <StarIcon className="w-5 h-5 mr-3 text-yellow-500" />
                  <span className="font-medium">{rating.name}</span>
                </div>
                {selectedRating === rating.value && (
                  <CheckIcon className="w-5 h-5" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}



