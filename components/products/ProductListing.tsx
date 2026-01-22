// components/products/ProductListing.tsx (UPDATED with filter props)
'use client'

import { useState, useEffect } from 'react'
import { productService, categoryService } from '@/lib/services/api'
import ProductCard from './ProductCard'
import { Squares2X2Icon, Bars3Icon } from '@heroicons/react/24/outline'

interface ProductListingProps {
  limit?: number
  selectedCategory?: string
  sortBy?: string
  priceRange?: string
  minRating?: number
}

// Transform backend product to frontend format with better category handling
const transformProduct = (product: any, categoriesMap: Map<string, string>) => ({
  id: product._id,
  name: product.name,
  description: product.description || 'No description available',
  price: product.price || 0,
  image: product.images?.[0]?.url || '',
  category: product.category?._id ? 
    (categoriesMap.get(product.category._id) || product.category?.name || 'Uncategorized') : 
    'Uncategorized',
  rating: product.rating || 0,
  reviewCount: product.reviewCount || 0,
  isPopular: product.featured || false,
  isVegetarian: product.tags?.includes('vegetarian') || false,
  isVegan: product.tags?.includes('vegan') || false,
  preparationTime: 15,
  stock: product.stock || 0,
  status: product.status || 'Active'
})

export default function ProductListing({ 
  limit, 
  selectedCategory: initialCategory,
  sortBy = 'popular',
  priceRange = 'all',
  minRating = 0
}: ProductListingProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all')
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [categoriesMap, setCategoriesMap] = useState<Map<string, string>>(new Map())
  const [categoryCounts, setCategoryCounts] = useState<Map<string, number>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  })
  
  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [currentPage, selectedCategory, sortBy, priceRange, minRating])

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories()
      
      if (response?.success) {
        const cats = response.data.map((cat: any) => ({
          id: cat._id,
          name: cat.name
        }))
        setCategories(cats)
        
        // Create a map for quick lookup
        const map = new Map<string, string>()
        cats.forEach((cat: any) => {
          map.set(cat.id, cat.name)
        })
        setCategoriesMap(map)
      }
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params: any = {
        page: currentPage,
        limit: limit || 12
      }
      
      // Only add category filter if it's not 'all'
      if (selectedCategory && selectedCategory !== 'all') {
        params.category = selectedCategory
      }
      
      // Add filter params if provided
      if (sortBy && sortBy !== 'popular') {
        params.sortBy = sortBy
      }
      
      if (minRating > 0) {
        params.minRating = minRating
      }
      
      // Add price range filter
      if (priceRange && priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number)
        if (!isNaN(min)) params.minPrice = min
        if (!isNaN(max)) params.maxPrice = max
      }
      
      console.log('Loading products with params:', params)
      
      const response = await productService.getProducts(params)
      
      if (response?.success) {
        // Handle both array and object formats
        const productsData = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.data || response.data || [])
        
        // Calculate category counts from the products
        const counts = new Map<string, number>()
        productsData.forEach((product: any) => {
          if (product.category?._id) {
            const currentCount = counts.get(product.category._id) || 0
            counts.set(product.category._id, currentCount + 1)
          }
        })
        setCategoryCounts(counts)
        
        setProducts(productsData)
        setPagination(response.pagination || {
          currentPage,
          totalPages: 1,
          totalProducts: productsData.length
        })
      } else {
        setError(response?.message || 'Failed to load products')
        setProducts([])
      }
    } catch (error: any) {
      console.error('Product loading error:', error)
      setError(error.message || 'Failed to load products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Get category count from our calculated counts
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return pagination.totalProducts
    return categoryCounts.get(categoryId) || 0
  }

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }

  // Get category display name
  const getCategoryDisplayName = (categoryId: string) => {
    if (categoryId === 'all') return 'All Items'
    const category = categories.find(c => c.id === categoryId)
    return category?.name || 'Unknown Category'
  }

  // Helper function to get sort display name
  const getSortDisplayName = () => {
    switch (sortBy) {
      case 'price_asc': return 'Price: Low to High'
      case 'price_desc': return 'Price: High to Low'
      case 'rating': return 'Highest Rated'
      case 'newest': return 'Newest'
      default: return 'Most Popular'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pepe-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
            <p className="text-sm text-gray-400 mt-2">
              Page {currentPage}, Category: {getCategoryDisplayName(selectedCategory || 'all')}
              {minRating > 0 && `, Rating: ${minRating}+`}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Error loading products</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadProducts}
            className="px-6 py-3 bg-pepe-primary text-white rounded-lg font-medium hover:bg-pepe-dark"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Categories Bar */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {getCategoryDisplayName(selectedCategory || 'all')}
            </h2>
            <div className="flex items-center flex-wrap gap-2 mt-2">
              <p className="text-gray-600">
                {pagination.totalProducts} {pagination.totalProducts === 1 ? 'item' : 'items'} available
              </p>
              {(sortBy !== 'popular' || minRating > 0) && (
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">•</span>
                  <span className="text-sm text-gray-500">
                    {getSortDisplayName()}
                    {minRating > 0 && ` • Rating: ${minRating}+`}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {!limit && (
            <div className="flex items-center space-x-4">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-pepe-primary text-white' : 'bg-white hover:bg-gray-50'}`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-pepe-primary text-white' : 'bg-white hover:bg-gray-50'}`}
                >
                  <Bars3Icon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-2 min-w-max">
            {/* "All" Button */}
            <button
              onClick={() => handleCategorySelect('all')}
              className={`flex items-center px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-pepe-primary text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">🍽️</span>
              <span className="font-medium">All Items</span>
              <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                selectedCategory === 'all'
                  ? 'bg-white/20'
                  : 'bg-gray-100'
              }`}>
                {pagination.totalProducts}
              </span>
            </button>
            
            {/* Backend Categories */}
            {categories && categories.length > 0 ? (
              categories.map((category) => {
                const count = getCategoryCount(category.id)
                
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`flex items-center px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                      selectedCategory === category.id
                        ? 'bg-pepe-primary text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">🥗</span>
                    <span className="font-medium">{category.name}</span>
                    <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                      selectedCategory === category.id
                        ? 'bg-white/20'
                        : 'bg-gray-100'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })
            ) : (
              <div className="flex items-center px-4 py-2 text-gray-500">
                <span className="mr-2">📁</span>
                <span>Loading categories...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {products.length > 0 ? (
        <>
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {products.map((product) => {
              const transformedProduct = transformProduct(product, categoriesMap)
              
              return (
                <ProductCard 
                  key={product._id} 
                  product={transformedProduct}
                  viewMode={viewMode}
                />
              )
            })}
          </div>
          
          {/* Pagination - Only show on full products page */}
          {!limit && pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg ${
                        currentPage === page
                          ? 'bg-pepe-primary text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">🍽️</span>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            No products match your current filters.
            {minRating > 0 && ` Try lowering the minimum rating requirement.`}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all')
              setCurrentPage(1)
            }}
            className="px-6 py-3 bg-pepe-primary text-white rounded-lg font-medium hover:bg-pepe-dark"
          >
            View All Products
          </button>
        </div>
      )}
    </div>
  )
}












































// // components/products/ProductListing.tsx (FIXED - Categories in filter)
// 'use client'

// import { useState, useEffect } from 'react'
// import { productService, categoryService } from '@/lib/services/api'
// import ProductCard from './ProductCard'
// import { Squares2X2Icon, Bars3Icon } from '@heroicons/react/24/outline'

// interface ProductListingProps {
//   limit?: number
//   selectedCategory?: string
// }

// // Transform backend product to frontend format with better category handling
// const transformProduct = (product: any, categoriesMap: Map<string, string>) => ({
//   id: product._id,
//   name: product.name,
//   description: product.description || 'No description available',
//   price: product.price || 0,
//   image: product.images?.[0]?.url || '',
//   category: product.category?._id ? 
//     (categoriesMap.get(product.category._id) || product.category?.name || 'Uncategorized') : 
//     'Uncategorized',
//   rating: product.rating || 0,
//   reviewCount: product.reviewCount || 0,
//   isPopular: product.featured || false,
//   isVegetarian: product.tags?.includes('vegetarian') || false,
//   isVegan: product.tags?.includes('vegan') || false,
//   preparationTime: 15,
//   stock: product.stock || 0,
//   status: product.status || 'Active'
// })

// export default function ProductListing({ limit, selectedCategory: initialCategory }: ProductListingProps) {
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
//   const [currentPage, setCurrentPage] = useState(1)
//   const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all')
//   const [products, setProducts] = useState<any[]>([])
//   const [categories, setCategories] = useState<any[]>([])
//   const [categoriesMap, setCategoriesMap] = useState<Map<string, string>>(new Map())
//   const [categoryCounts, setCategoryCounts] = useState<Map<string, number>>(new Map())
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalProducts: 0
//   })
  
//   useEffect(() => {
//     loadCategories()
//   }, [])

//   useEffect(() => {
//     loadProducts()
//   }, [currentPage, selectedCategory])

//   const loadCategories = async () => {
//     try {
//       const response = await categoryService.getCategories()
      
//       if (response?.success) {
//         const cats = response.data.map((cat: any) => ({
//           id: cat._id,
//           name: cat.name
//         }))
//         setCategories(cats)
        
//         // Create a map for quick lookup
//         const map = new Map<string, string>()
//         cats.forEach((cat: any) => {
//           map.set(cat.id, cat.name)
//         })
//         setCategoriesMap(map)
//       }
//     } catch (error) {
//       console.error('Failed to load categories:', error)
//     }
//   }

//   const loadProducts = async () => {
//     try {
//       setLoading(true)
//       setError(null)
      
//       const params: any = {
//         page: currentPage,
//         limit: limit || 12
//       }
      
//       // Only add category filter if it's not 'all'
//       if (selectedCategory !== 'all') {
//         params.category = selectedCategory
//       }
      
//       const response = await productService.getProducts(params)
      
//       if (response?.success) {
//         // Handle both array and object formats
//         const productsData = Array.isArray(response.data) 
//           ? response.data 
//           : (response.data?.data || response.data || [])
        
//         // Calculate category counts from the products
//         const counts = new Map<string, number>()
//         productsData.forEach((product: any) => {
//           if (product.category?._id) {
//             const currentCount = counts.get(product.category._id) || 0
//             counts.set(product.category._id, currentCount + 1)
//           }
//         })
//         setCategoryCounts(counts)
        
//         setProducts(productsData)
//         setPagination(response.pagination || {
//           currentPage,
//           totalPages: 1,
//           totalProducts: productsData.length
//         })
//       } else {
//         setError(response?.message || 'Failed to load products')
//         setProducts([])
//       }
//     } catch (error: any) {
//       console.error('Product loading error:', error)
//       setError(error.message || 'Failed to load products')
//       setProducts([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Get category count from our calculated counts
//   const getCategoryCount = (categoryId: string) => {
//     if (categoryId === 'all') return pagination.totalProducts
//     return categoryCounts.get(categoryId) || 0
//   }

//   // Handle category selection
//   const handleCategorySelect = (categoryId: string) => {
//     setSelectedCategory(categoryId)
//     setCurrentPage(1)
//   }

//   // Get category display name
//   const getCategoryDisplayName = (categoryId: string) => {
//     if (categoryId === 'all') return 'All Items'
//     const category = categories.find(c => c.id === categoryId)
//     return category?.name || 'Unknown Category'
//   }

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex justify-center items-center h-64">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pepe-primary mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading products from backend...</p>
//             <p className="text-sm text-gray-400 mt-2">
//               Page {currentPage}, Category: {getCategoryDisplayName(selectedCategory)}
//             </p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="space-y-6">
//         <div className="text-center py-16">
//           <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
//             <span className="text-3xl">⚠️</span>
//           </div>
//           <h3 className="text-xl font-medium text-gray-900 mb-2">Error loading products</h3>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={loadProducts}
//             className="px-6 py-3 bg-pepe-primary text-white rounded-lg font-medium hover:bg-pepe-dark"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div>
//       {/* Categories Bar */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
//               {getCategoryDisplayName(selectedCategory)}
//             </h2>
//             <p className="text-gray-600 mt-2">
//               {pagination.totalProducts} {pagination.totalProducts === 1 ? 'item' : 'items'} available
//             </p>
//           </div>
          
//           {!limit && (
//             <div className="flex items-center space-x-4">
//               <div className="flex border border-gray-300 rounded-lg overflow-hidden">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-2 ${viewMode === 'grid' ? 'bg-pepe-primary text-white' : 'bg-white hover:bg-gray-50'}`}
//                 >
//                   <Squares2X2Icon className="w-5 h-5" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-2 ${viewMode === 'list' ? 'bg-pepe-primary text-white' : 'bg-white hover:bg-gray-50'}`}
//                 >
//                   <Bars3Icon className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Category Filter - FIXED: Now properly showing backend categories */}
//         <div className="overflow-x-auto pb-4">
//           <div className="flex space-x-2 min-w-max">
//             {/* "All" Button */}
//             <button
//               onClick={() => handleCategorySelect('all')}
//               className={`flex items-center px-4 py-2 rounded-full transition-all whitespace-nowrap ${
//                 selectedCategory === 'all'
//                   ? 'bg-pepe-primary text-white shadow-md'
//                   : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//               }`}
//             >
//               <span className="mr-2">🍽️</span>
//               <span className="font-medium">All Items</span>
//               <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
//                 selectedCategory === 'all'
//                   ? 'bg-white/20'
//                   : 'bg-gray-100'
//               }`}>
//                 {pagination.totalProducts}
//               </span>
//             </button>
            
//             {/* Backend Categories - FIXED: Now properly rendering */}
//             {categories && categories.length > 0 ? (
//               categories.map((category) => {
//                 const count = getCategoryCount(category.id)
                
//                 return (
//                   <button
//                     key={category.id}
//                     onClick={() => handleCategorySelect(category.id)}
//                     className={`flex items-center px-4 py-2 rounded-full transition-all whitespace-nowrap ${
//                       selectedCategory === category.id
//                         ? 'bg-pepe-primary text-white shadow-md'
//                         : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     <span className="mr-2">🥗</span>
//                     <span className="font-medium">{category.name}</span>
//                     <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
//                       selectedCategory === category.id
//                         ? 'bg-white/20'
//                         : 'bg-gray-100'
//                     }`}>
//                       {count}
//                     </span>
//                   </button>
//                 )
//               })
//             ) : (
//               <div className="flex items-center px-4 py-2 text-gray-500">
//                 <span className="mr-2">📁</span>
//                 <span>Loading categories...</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Products Grid/List */}
//       {products.length > 0 ? (
//         <>
//           <div className={viewMode === 'grid' 
//             ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
//             : 'space-y-4'
//           }>
//             {products.map((product) => {
//               const transformedProduct = transformProduct(product, categoriesMap)
              
//               return (
//                 <ProductCard 
//                   key={product._id} 
//                   product={transformedProduct}
//                   viewMode={viewMode}
//                 />
//               )
//             })}
//           </div>
          
//           {/* Pagination - Only show on full products page */}
//           {!limit && pagination.totalPages > 1 && (
//             <div className="mt-12 flex justify-center">
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                   disabled={currentPage === 1}
//                   className="px-4 py-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
//                 >
//                   Previous
//                 </button>
                
//                 {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//                   const page = i + 1
//                   return (
//                     <button
//                       key={page}
//                       onClick={() => setCurrentPage(page)}
//                       className={`w-10 h-10 rounded-lg ${
//                         currentPage === page
//                           ? 'bg-pepe-primary text-white'
//                           : 'bg-white border border-gray-300 hover:bg-gray-50'
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   )
//                 })}
                
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
//                   disabled={currentPage === pagination.totalPages}
//                   className="px-4 py-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       ) : (
//         <div className="text-center py-16">
//           <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
//             <span className="text-4xl">🍽️</span>
//           </div>
//           <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
//           <p className="text-gray-600 mb-6">
//             No products available in this category.
//           </p>
//           <button
//             onClick={() => handleCategorySelect('all')}
//             className="px-6 py-3 bg-pepe-primary text-white rounded-lg font-medium hover:bg-pepe-dark"
//           >
//             View All Products
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

















































































// // components/products/ProductListing.tsx (FIXED - Categories in filter)
// 'use client'

// import { useState, useEffect } from 'react'
// import { productService, categoryService } from '@/lib/services/api'
// import ProductCard from './ProductCard'
// import { Squares2X2Icon, Bars3Icon } from '@heroicons/react/24/outline'

// interface ProductListingProps {
//   limit?: number
//   selectedCategory?: string
// }

// // Transform backend product to frontend format with better category handling
// const transformProduct = (product: any, categoriesMap: Map<string, string>) => ({
//   id: product._id,
//   name: product.name,
//   description: product.description || 'No description available',
//   price: product.price || 0,
//   image: product.images?.[0]?.url || '',
//   category: product.category?._id ? 
//     (categoriesMap.get(product.category._id) || product.category?.name || 'Uncategorized') : 
//     'Uncategorized',
//   rating: product.rating || 0,
//   reviewCount: product.reviewCount || 0,
//   isPopular: product.featured || false,
//   isVegetarian: product.tags?.includes('vegetarian') || false,
//   isVegan: product.tags?.includes('vegan') || false,
//   preparationTime: 15,
//   stock: product.stock || 0,
//   status: product.status || 'Active'
// })

// export default function ProductListing({ limit, selectedCategory: initialCategory }: ProductListingProps) {
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
//   const [currentPage, setCurrentPage] = useState(1)
//   const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all')
//   const [products, setProducts] = useState<any[]>([])
//   const [categories, setCategories] = useState<any[]>([])
//   const [categoriesMap, setCategoriesMap] = useState<Map<string, string>>(new Map())
//   const [categoryCounts, setCategoryCounts] = useState<Map<string, number>>(new Map())
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalProducts: 0
//   })
  
//   useEffect(() => {
//     loadCategories()
//   }, [])

//   useEffect(() => {
//     loadProducts()
//   }, [currentPage, selectedCategory])

//   const loadCategories = async () => {
//     try {
//       const response = await categoryService.getCategories()
//       console.log('📂 Categories response:', response)
      
//       if (response?.success) {
//         const cats = response.data.map((cat: any) => ({
//           id: cat._id,
//           name: cat.name
//         }))
//         setCategories(cats)
        
//         // Create a map for quick lookup
//         const map = new Map<string, string>()
//         cats.forEach((cat: any) => {
//           map.set(cat.id, cat.name)
//         })
//         setCategoriesMap(map)
//       }
//     } catch (error) {
//       console.error('Failed to load categories:', error)
//     }
//   }

//   const loadProducts = async () => {
//     try {
//       setLoading(true)
//       setError(null)
      
//       const params: any = {
//         page: currentPage,
//         limit: limit || 12
//       }
      
//       // Only add category filter if it's not 'all'
//       if (selectedCategory !== 'all') {
//         params.category = selectedCategory
//       }
      
//       console.log('📡 Loading products with params:', params)
      
//       const response = await productService.getProducts(params)
//       console.log('📦 Products response:', response)
      
//       if (response?.success) {
//         // Handle both array and object formats
//         const productsData = Array.isArray(response.data) 
//           ? response.data 
//           : (response.data?.data || response.data || [])
        
//         // Calculate category counts from the products
//         const counts = new Map<string, number>()
//         productsData.forEach((product: any) => {
//           if (product.category?._id) {
//             const currentCount = counts.get(product.category._id) || 0
//             counts.set(product.category._id, currentCount + 1)
//           }
//         })
//         setCategoryCounts(counts)
        
//         setProducts(productsData)
//         setPagination(response.pagination || {
//           currentPage,
//           totalPages: 1,
//           totalProducts: productsData.length
//         })
//       } else {
//         setError(response?.message || 'Failed to load products')
//         setProducts([])
//       }
//     } catch (error: any) {
//       console.error('❌ Product loading error:', error)
//       setError(error.message || 'Failed to load products')
//       setProducts([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Get category count from our calculated counts
//   const getCategoryCount = (categoryId: string) => {
//     if (categoryId === 'all') return pagination.totalProducts
//     return categoryCounts.get(categoryId) || 0
//   }

//   // Handle category selection
//   const handleCategorySelect = (categoryId: string) => {
//     console.log('Selecting category:', categoryId, 'name:', categories.find(c => c.id === categoryId)?.name)
//     setSelectedCategory(categoryId)
//     setCurrentPage(1)
//   }

//   // Get category display name
//   const getCategoryDisplayName = (categoryId: string) => {
//     if (categoryId === 'all') return 'All Items'
//     const category = categories.find(c => c.id === categoryId)
//     return category?.name || 'Unknown Category'
//   }

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex justify-center items-center h-64">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pepe-primary mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading products from backend...</p>
//             <p className="text-sm text-gray-400 mt-2">
//               Page {currentPage}, Category: {getCategoryDisplayName(selectedCategory)}
//             </p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="space-y-6">
//         <div className="text-center py-16">
//           <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
//             <span className="text-3xl">⚠️</span>
//           </div>
//           <h3 className="text-xl font-medium text-gray-900 mb-2">Error loading products</h3>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={loadProducts}
//             className="px-6 py-3 bg-pepe-primary text-white rounded-lg font-medium hover:bg-pepe-dark"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div>
//       {/* Categories Bar */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
//               {getCategoryDisplayName(selectedCategory)}
//             </h2>
//             <p className="text-gray-600 mt-2">
//               {pagination.totalProducts} {pagination.totalProducts === 1 ? 'item' : 'items'} available
//             </p>
//           </div>
          
//           {!limit && (
//             <div className="flex items-center space-x-4">
//               <div className="flex border border-gray-300 rounded-lg overflow-hidden">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-2 ${viewMode === 'grid' ? 'bg-pepe-primary text-white' : 'bg-white hover:bg-gray-50'}`}
//                 >
//                   <Squares2X2Icon className="w-5 h-5" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-2 ${viewMode === 'list' ? 'bg-pepe-primary text-white' : 'bg-white hover:bg-gray-50'}`}
//                 >
//                   <Bars3Icon className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Category Filter - FIXED: Now properly showing backend categories */}
//         <div className="overflow-x-auto pb-4">
//           <div className="flex space-x-2 min-w-max">
//             {/* "All" Button */}
//             <button
//               onClick={() => handleCategorySelect('all')}
//               className={`flex items-center px-4 py-2 rounded-full transition-all whitespace-nowrap ${
//                 selectedCategory === 'all'
//                   ? 'bg-pepe-primary text-white shadow-md'
//                   : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//               }`}
//             >
//               <span className="mr-2">🍽️</span>
//               <span className="font-medium">All Items</span>
//               <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
//                 selectedCategory === 'all'
//                   ? 'bg-white/20'
//                   : 'bg-gray-100'
//               }`}>
//                 {pagination.totalProducts}
//               </span>
//             </button>
            
//             {/* Backend Categories - FIXED: Now properly rendering */}
//             {categories && categories.length > 0 ? (
//               categories.map((category) => {
//                 const count = getCategoryCount(category.id)
//                 console.log('Rendering category button:', {
//                   id: category.id,
//                   name: category.name,
//                   count: count,
//                   selected: selectedCategory === category.id
//                 })
                
//                 return (
//                   <button
//                     key={category.id}
//                     onClick={() => handleCategorySelect(category.id)}
//                     className={`flex items-center px-4 py-2 rounded-full transition-all whitespace-nowrap ${
//                       selectedCategory === category.id
//                         ? 'bg-pepe-primary text-white shadow-md'
//                         : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     <span className="mr-2">🥗</span>
//                     <span className="font-medium">{category.name}</span>
//                     <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
//                       selectedCategory === category.id
//                         ? 'bg-white/20'
//                         : 'bg-gray-100'
//                     }`}>
//                       {count}
//                     </span>
//                   </button>
//                 )
//               })
//             ) : (
//               <div className="flex items-center px-4 py-2 text-gray-500">
//                 <span className="mr-2">📁</span>
//                 <span>Loading categories...</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Products Grid/List */}
//       {products.length > 0 ? (
//         <>
//           <div className={viewMode === 'grid' 
//             ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
//             : 'space-y-4'
//           }>
//             {products.map((product) => {
//               const transformedProduct = transformProduct(product, categoriesMap)
              
//               return (
//                 <ProductCard 
//                   key={product._id} 
//                   product={transformedProduct}
//                   viewMode={viewMode}
//                 />
//               )
//             })}
//           </div>
          
//           {/* Pagination - Only show on full products page */}
//           {!limit && pagination.totalPages > 1 && (
//             <div className="mt-12 flex justify-center">
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                   disabled={currentPage === 1}
//                   className="px-4 py-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
//                 >
//                   Previous
//                 </button>
                
//                 {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//                   const page = i + 1
//                   return (
//                     <button
//                       key={page}
//                       onClick={() => setCurrentPage(page)}
//                       className={`w-10 h-10 rounded-lg ${
//                         currentPage === page
//                           ? 'bg-pepe-primary text-white'
//                           : 'bg-white border border-gray-300 hover:bg-gray-50'
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   )
//                 })}
                
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
//                   disabled={currentPage === pagination.totalPages}
//                   className="px-4 py-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       ) : (
//         <div className="text-center py-16">
//           <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
//             <span className="text-4xl">🍽️</span>
//           </div>
//           <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
//           <p className="text-gray-600 mb-6">
//             No products available in this category.
//           </p>
//           <button
//             onClick={() => handleCategorySelect('all')}
//             className="px-6 py-3 bg-pepe-primary text-white rounded-lg font-medium hover:bg-pepe-dark"
//           >
//             View All Products
//           </button>
//         </div>
//       )}

//       {/* Debug info for categories */}
//       {process.env.NODE_ENV === 'development' && (
//         <div className="mt-8 p-4 bg-gray-100 rounded-lg">
//           <details>
//             <summary className="cursor-pointer font-medium text-gray-700">
//               Category Debug Info (Click to expand)
//             </summary>
//             <div className="mt-3 space-y-3">
//               <div>
//                 <p className="text-sm font-medium">Total Categories Loaded: {categories.length}</p>
//                 <p className="text-sm">Selected Category: {selectedCategory} ({getCategoryDisplayName(selectedCategory)})</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium">Categories List:</p>
//                 <pre className="text-xs bg-gray-800 text-gray-100 p-2 rounded mt-1 overflow-auto max-h-40">
//                   {JSON.stringify(categories.map(cat => ({
//                     id: cat.id,
//                     name: cat.name,
//                     count: getCategoryCount(cat.id)
//                   })), null, 2)}
//                 </pre>
//               </div>
//               <div>
//                 <p className="text-sm font-medium">Category Counts:</p>
//                 <pre className="text-xs bg-gray-800 text-gray-100 p-2 rounded mt-1">
//                   {JSON.stringify(Object.fromEntries(categoryCounts), null, 2)}
//                 </pre>
//               </div>
//             </div>
//           </details>
//         </div>
//       )}
//     </div>
//   )
// }



