// components/products/RelatedProducts.tsx
'use client'

import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { productService } from '@/lib/services/api'
import { transformProduct } from '@/lib/utils/transformers'

interface RelatedProductsProps {
  categoryId: string
  currentProductId: string
  limit?: number
}

export default function RelatedProducts({ 
  categoryId, 
  currentProductId, 
  limit = 4 
}: RelatedProductsProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [totalProducts, setTotalProducts] = useState(0)

  useEffect(() => {
    loadRelatedProducts()
  }, [categoryId, currentPage])

  const loadRelatedProducts = async () => {
    try {
      setLoading(true)
      const response = await productService.getProducts({
        category: categoryId,
        limit,
        page: currentPage + 1,
        exclude: currentProductId
      })
      
      if (response.success) {
        // Filter out current product
        const filtered = (response.data || []).filter(
          (product: any) => product._id !== currentProductId
        )
        setRelatedProducts(filtered)
        setTotalProducts(response.pagination?.totalProducts || filtered.length)
      }
    } catch (error) {
      console.error('Failed to load related products:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(totalProducts / limit)
  const startIndex = currentPage * limit
  const currentProducts = relatedProducts.slice(startIndex, startIndex + limit)

  if (loading) {
    return (
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-xl"></div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">You Might Also Like</h2>
          <p className="text-gray-600 mt-2">Discover more delicious options</p>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="p-3 rounded-xl bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:shadow-md transition-all"
              aria-label="Previous page"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage + 1} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="p-3 rounded-xl bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:shadow-md transition-all"
              aria-label="Next page"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => {
          const transformedProduct = transformProduct(product)
          return (
            <ProductCard 
              key={product._id} 
              product={transformedProduct}
              viewMode="grid"
              showAddToCart={true}
            />
          )
        })}
      </div>

      {/* View All Button */}
      {totalProducts > limit && (
        <div className="text-center mt-12">
          <a
            href={`/products?category=${categoryId}`}
            className="inline-flex items-center px-8 py-4 border-2 border-pepe-primary text-pepe-primary rounded-xl font-bold text-lg hover:bg-pepe-primary hover:text-white transition-colors hover:shadow-lg"
          >
            View All Related Items
            <ChevronRightIcon className="w-5 h-5 ml-3" />
          </a>
        </div>
      )}
    </div>
  )
}


















// // Desktop/pepefinal/frontend/components/products/RelatedProducts.tsx
// 'use client'

// import { useState } from 'react'
// import ProductCard from './ProductCard'
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

// interface RelatedProductsProps {
//   currentProductId: number
// }

// export default function RelatedProducts({ currentProductId }: RelatedProductsProps) {
//   const [currentPage, setCurrentPage] = useState(0)
  
//   // Mock related products
//   const relatedProducts = [
//     {
//       id: 2,
//       name: 'Pancake Stack',
//       description: 'Fluffy buttermilk pancakes with maple syrup and fresh berries',
//       price: 5200,
//       image: '/food/pancakes.jpg',
//       category: 'breakfast',
//       rating: 4.9,
//       reviewCount: 98,
//       isPopular: true,
//       isVegetarian: true,
//       preparationTime: 20,
//     },
//     {
//       id: 3,
//       name: 'Eggs Benedict',
//       description: 'Poached eggs on English muffins with hollandaise sauce',
//       price: 5800,
//       image: '/food/eggs-benedict.jpg',
//       category: 'brunch',
//       rating: 4.8,
//       reviewCount: 112,
//       isPopular: true,
//       preparationTime: 20,
//     },
//     {
//       id: 4,
//       name: 'Breakfast Burrito',
//       description: 'Scrambled eggs, cheese, sausage, and veggies in a tortilla',
//       price: 4800,
//       image: '/food/burrito.jpg',
//       category: 'breakfast',
//       rating: 4.6,
//       reviewCount: 92,
//       isPopular: true,
//       preparationTime: 15,
//     },
//     {
//       id: 5,
//       name: 'Fruit Smoothie Bowl',
//       description: 'Blended fruits topped with granola, coconut, and fresh berries',
//       price: 4200,
//       image: '/food/smoothie-bowl.jpg',
//       category: 'breakfast',
//       rating: 4.4,
//       reviewCount: 67,
//       isVegetarian: true,
//       isVegan: true,
//       preparationTime: 10,
//     },
//   ]

//   // Filter out current product
//   const filteredProducts = relatedProducts.filter(p => p.id !== currentProductId)
  
//   // Pagination
//   const productsPerPage = 3
//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
//   const startIndex = currentPage * productsPerPage
//   const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

//   return (
//     <div>
//       {/* Section Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h2 className="text-3xl font-bold text-gray-900">You Might Also Like</h2>
//           <p className="text-gray-600">Discover more delicious options</p>
//         </div>
        
//         {/* Pagination Controls */}
//         {totalPages > 1 && (
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
//               disabled={currentPage === 0}
//               className="p-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               aria-label="Previous page"
//             >
//               <ChevronLeftIcon className="w-5 h-5" />
//             </button>
            
//             <span className="text-sm font-medium text-gray-700">
//               {currentPage + 1} / {totalPages}
//             </span>
            
//             <button
//               onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
//               disabled={currentPage === totalPages - 1}
//               className="p-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               aria-label="Next page"
//             >
//               <ChevronRightIcon className="w-5 h-5" />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Products Grid */}
//       {currentProducts.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {currentProducts.map((product) => (
//             <ProductCard 
//               key={product.id} 
//               product={product} 
//               viewMode="grid"
//               showAddToCart={true}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12">
//           <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//             <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No related products found</h3>
//           <p className="text-gray-500">Check back later for more options</p>
//         </div>
//       )}

//       {/* View All Button */}
//       {filteredProducts.length > 3 && (
//         <div className="text-center mt-8">
//           <a
//             href="/products"
//             className="inline-flex items-center px-6 py-3 border-2 border-pepe-primary text-pepe-primary rounded-xl font-medium hover:bg-pepe-primary hover:text-white transition-colors"
//           >
//             View All Menu Items
//             <ChevronRightIcon className="w-5 h-5 ml-2" />
//           </a>
//         </div>
//       )}
//     </div>
//   )
// }

