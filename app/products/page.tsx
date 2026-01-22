// app/products/page.tsx - UPDATED to prevent infinite loop
'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import ProductListing from '../../components/products/ProductListing'
import ProductFilters from '../../components/products/ProductFilters'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { categoryService } from '../../lib/services/api'

export default function ProductsPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    sortBy: 'popular',
    minRating: 0
  })
  const [loadingFilters, setLoadingFilters] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories()
      
      if (response?.success) {
        const formattedCategories = response.data.map((cat: any) => ({
          id: cat._id,
          name: cat.name,
          count: 0
        }))
        setCategories(formattedCategories)
      }
    } catch (error) {
      console.error('Failed to load categories:', error)
    } finally {
      setLoadingFilters(false)
    }
  }

  // Use useCallback to memoize the filter change handler
  const handleFilterChange = useCallback((newFilters: any) => {
    console.log('Filters updated:', newFilters)
    setFilters(newFilters)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="grow py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Full Menu</h1>
            <p className="text-gray-600">Browse all our delicious breakfast and brunch options</p>
          </div>
          
          {/* Active Filters Display */}
          {(filters.category !== 'all' || filters.minRating > 0) && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-blue-800 mr-2">Active filters:</span>
                  <div className="flex flex-wrap gap-2">
                    {filters.category !== 'all' && (
                      <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        Category: {categories.find(c => c.id === filters.category)?.name || filters.category}
                        <button 
                          onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.minRating > 0 && (
                      <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                        Rating: {filters.minRating}+
                        <button 
                          onClick={() => setFilters(prev => ({ ...prev, minRating: 0 }))}
                          className="ml-2 text-yellow-600 hover:text-yellow-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setFilters({
                    category: 'all',
                    priceRange: 'all',
                    sortBy: 'popular',
                    minRating: 0
                  })}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block lg:w-1/4">
              <div className="sticky top-24">
                {loadingFilters ? (
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="small" />
                      <span className="ml-3 text-gray-600">Loading filters...</span>
                    </div>
                  </div>
                ) : (
                  <ProductFilters onFilterChange={handleFilterChange} />
                )}
              </div>
            </aside>
            
            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Pass filters to ProductListing */}
              <ProductListing 
                selectedCategory={filters.category === 'all' ? '' : filters.category}
                sortBy={filters.sortBy}
                priceRange={filters.priceRange}
                minRating={filters.minRating}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}





































// // app/products/page.tsx - UPDATED to make filters work
// 'use client'

// import { useState, useEffect } from 'react'
// import Header from '../../components/layout/Header'
// import Footer from '../../components/layout/Footer'
// import ProductListing from '../../components/products/ProductListing'
// import ProductFilters from '../../components/products/ProductFilters'
// import LoadingSpinner from '../../components/ui/LoadingSpinner'
// import { categoryService } from '../../lib/services/api'

// export default function ProductsPage() {
//   const [categories, setCategories] = useState<any[]>([])
//   const [filters, setFilters] = useState({
//     category: 'all',
//     priceRange: 'all',
//     sortBy: 'popular',
//     minRating: 0
//   })
//   const [loadingFilters, setLoadingFilters] = useState(true)

//   useEffect(() => {
//     loadCategories()
//   }, [])

//   const loadCategories = async () => {
//     try {
//       const response = await categoryService.getCategories()
      
//       if (response?.success) {
//         const formattedCategories = response.data.map((cat: any) => ({
//           id: cat._id,
//           name: cat.name,
//           count: 0
//         }))
//         setCategories(formattedCategories)
//       }
//     } catch (error) {
//       console.error('Failed to load categories:', error)
//     } finally {
//       setLoadingFilters(false)
//     }
//   }

//   const handleFilterChange = (newFilters: any) => {
//     console.log('Filters updated:', newFilters)
//     setFilters(newFilters)
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Header />
      
//       <main className="flex-grow py-8">
//         <div className="container mx-auto px-4">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Full Menu</h1>
//             <p className="text-gray-600">Browse all our delicious breakfast and brunch options</p>
//           </div>
          
//           {/* Active Filters Display */}
//           {(filters.category !== 'all' || filters.minRating > 0) && (
//             <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <span className="text-sm font-medium text-blue-800 mr-2">Active filters:</span>
//                   <div className="flex flex-wrap gap-2">
//                     {filters.category !== 'all' && (
//                       <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
//                         Category: {categories.find(c => c.id === filters.category)?.name || filters.category}
//                         <button 
//                           onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}
//                           className="ml-2 text-blue-600 hover:text-blue-800"
//                         >
//                           ×
//                         </button>
//                       </span>
//                     )}
//                     {filters.minRating > 0 && (
//                       <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
//                         Rating: {filters.minRating}+
//                         <button 
//                           onClick={() => setFilters(prev => ({ ...prev, minRating: 0 }))}
//                           className="ml-2 text-yellow-600 hover:text-yellow-800"
//                         >
//                           ×
//                         </button>
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <button 
//                   onClick={() => setFilters({
//                     category: 'all',
//                     priceRange: 'all',
//                     sortBy: 'popular',
//                     minRating: 0
//                   })}
//                   className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//                 >
//                   Clear all
//                 </button>
//               </div>
//             </div>
//           )}
          
//           <div className="flex flex-col lg:flex-row gap-8">
//             {/* Desktop Sidebar */}
//             <aside className="hidden lg:block lg:w-1/4">
//               <div className="sticky top-24">
//                 {loadingFilters ? (
//                   <div className="bg-white rounded-xl shadow p-6">
//                     <div className="flex items-center justify-center">
//                       <LoadingSpinner size="small" />
//                       <span className="ml-3 text-gray-600">Loading filters...</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <ProductFilters onFilterChange={handleFilterChange} />
//                 )}
//               </div>
//             </aside>
            
//             {/* Main Content */}
//             <div className="lg:w-3/4">
//               {/* Pass filters to ProductListing */}
//               <ProductListing 
//                 selectedCategory={filters.category === 'all' ? '' : filters.category}
//                 sortBy={filters.sortBy}
//                 // Add other filter props as needed
//               />
//             </div>
//           </div>
//         </div>
//       </main>
      
//       <Footer />
//     </div>
//   )
// }




































// // Desktop/pepefinal/frontend/app/products/page.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import Header from '../../components/layout/Header'
// import Footer from '../../components/layout/Footer'
// import ProductListing from '../../components/products/ProductListing'
// import ProductFilters from '../../components/products/ProductFilters'
// import { Suspense } from 'react'
// import LoadingSpinner from '../../components/ui/LoadingSpinner'
// import { categoryService } from '../../lib/services/api'

// export default function ProductsPage() {
//   const [categories, setCategories] = useState<any[]>([])
//   const [selectedFilters, setSelectedFilters] = useState({
//     selectedCategories: ['all'],
//     selectedPrice: 'all',
//     selectedDietary: [],
//     minRating: 0,
//     sortBy: 'popular'
//   })
//   const [loadingFilters, setLoadingFilters] = useState(true)

//   useEffect(() => {
//     loadCategories()
//   }, [])

//   const loadCategories = async () => {
//     try {
//       console.log('🔄 Loading categories for filter...')
//       const response = await categoryService.getCategories()
      
//       console.log('📊 Categories API response:', response)
      
//       if (response?.success) {
//         const formattedCategories = response.data.map((cat: any) => ({
//           id: cat._id,
//           name: cat.name,
//           count: 0 // We'll update this when we load products
//         }))
        
//         console.log('✅ Formatted categories:', formattedCategories)
//         setCategories(formattedCategories)
//       } else {
//         console.warn('⚠️ No categories found or API error:', response)
//         setCategories([])
//       }
//     } catch (error) {
//       console.error('❌ Failed to load categories:', error)
//       setCategories([])
//     } finally {
//       setLoadingFilters(false)
//     }
//   }

//   const handleFilterChange = (filters: any) => {
//     console.log('🎯 Filter changed:', filters)
//     setSelectedFilters(filters)
    
//     // You can pass these filters to ProductListing or update URL params
//     // For now, we'll just log them
//     // In the future, you could pass these to ProductListing via props
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Header />
      
//       <main className="flex-grow py-8">
//         <div className="container mx-auto px-4">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Full Menu</h1>
//             <p className="text-gray-600">Browse all our delicious breakfast and brunch options</p>
//           </div>
          
//           {/* Mobile filters button will show here on mobile only */}
//           <div className="lg:hidden mb-6">
//             {loadingFilters ? (
//               <div className="flex items-center justify-center p-6 bg-white rounded-xl shadow">
//                 <LoadingSpinner size="small" />
//                 <span className="ml-3 text-gray-600">Loading filters...</span>
//               </div>
//             ) : (
//               <ProductFilters 
//                 categories={categories}
//                 onFilterChange={handleFilterChange}
//               />
//             )}
//           </div>
          
//           <div className="flex flex-col lg:flex-row gap-8">
//             {/* Desktop Sidebar - Hidden on mobile */}
//             <aside className="hidden lg:block lg:w-1/4">
//               <div className="sticky top-24">
//                 {loadingFilters ? (
//                   <div className="bg-white rounded-xl shadow p-6">
//                     <div className="flex items-center justify-center">
//                       <LoadingSpinner size="small" />
//                       <span className="ml-3 text-gray-600">Loading filters...</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <ProductFilters 
//                     categories={categories}
//                     onFilterChange={handleFilterChange}
//                   />
//                 )}
//               </div>
//             </aside>
            
//             {/* Main Content */}
//             <div className="lg:w-3/4">
//               {/* Debug info for development */}
//               {process.env.NODE_ENV === 'development' && (
//                 <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                   <p className="text-sm text-blue-800">
//                     <span className="font-medium">Filters Loaded:</span> {categories.length} categories
//                   </p>
//                   {selectedFilters.selectedCategories.length > 0 && !selectedFilters.selectedCategories.includes('all') && (
//                     <p className="text-sm text-blue-800 mt-1">
//                       Active category filter(s): {selectedFilters.selectedCategories.map(id => {
//                         const cat = categories.find(c => c.id === id)
//                         return cat?.name || id
//                       }).join(', ')}
//                     </p>
//                   )}
//                 </div>
//               )}
              
//               {/* Full Product Listing (no limit) */}
//               <Suspense fallback={
//                 <div className="flex justify-center items-center h-64">
//                   <LoadingSpinner size="large" />
//                   <span className="ml-3 text-lg">Loading products...</span>
//                 </div>
//               }>
//                 <ProductListing />
//               </Suspense>
//             </div>
//           </div>
//         </div>
//       </main>
      
//       <Footer />
//     </div>
//   )
// }






























// // Desktop/pepefinal/frontend/app/products/page.tsx
// import Header from '../../components/layout/Header'
// import Footer from '../../components/layout/Footer'
// import ProductListing from '../../components/products/ProductListing'
// import ProductFilters from '../../components/products/ProductFilters'
// import { Suspense } from 'react'
// import LoadingSpinner from '../../components/ui/LoadingSpinner'

// export const metadata = {
//   title: "Menu | Pepe's Brunch and Cafe",
//   description: "Explore our delicious menu",
// }

// export default function ProductsPage() {
//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Header />
      
//       <main className="flex-grow py-8">
//         <div className="container mx-auto px-4">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Full Menu</h1>
//             <p className="text-gray-600">Browse all our delicious breakfast and brunch options</p>
//           </div>
          
//           {/* Mobile filters button will show here on mobile only */}
//           <div className="lg:hidden mb-6">
//             <ProductFilters />
//           </div>
          
//           <div className="flex flex-col lg:flex-row gap-8">
//             {/* Desktop Sidebar - Hidden on mobile */}
//             <aside className="hidden lg:block lg:w-1/4">
//               <div className="sticky top-24">
//                 <ProductFilters />
//               </div>
//             </aside>
            
//             {/* Main Content */}
//             <div className="lg:w-3/4">
//               {/* Full Product Listing (no limit) */}
//               <Suspense fallback={
//                 <div className="flex justify-center items-center h-64">
//                   <LoadingSpinner size="large" />
//                   <span className="ml-3 text-lg">Loading products...</span>
//                 </div>
//               }>
//                 <ProductListing />
//               </Suspense>
//             </div>
//           </div>
//         </div>
//       </main>
      
//       <Footer />
//     </div>
//   )
// }











































// // Desktop/pepefinal/frontend/app/products/page.tsx
// import Header from '../../components/layout/Header'
// import Footer from '../../components/layout/Footer'
// import ProductListing from '../../components/products/ProductListing'
// import ProductFilters from '../../components/products/ProductFilters'
// import { Suspense } from 'react'
// import LoadingSpinner from '../../components/ui/LoadingSpinner'

// export const metadata = {
//   title: "Menu | Pepe's Brunch and Cafe",
//   description: "Explore our delicious menu",
// }

// export default function ProductsPage() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
      
//       <main className="flex-grow container mx-auto px-4 py-8">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-pepe-dark mb-2">Our Menu</h1>
//           <p className="text-gray-600">Discover delicious breakfast and brunch options</p>
//         </div>
        
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Desktop Sidebar - Hidden on mobile */}
//           <aside className="hidden lg:block lg:w-1/4">
//             <div className="sticky top-24">
//               <ProductFilters />
//             </div>
//           </aside>
          
//           {/* Main Content */}
//           <main className="lg:w-3/4">
//             {/* Mobile filters button will show here on mobile only */}
//             <div className="lg:hidden mb-6">
//               <ProductFilters />
//             </div>
            
//             <Suspense fallback={
//               <div className="flex justify-center items-center h-64">
//                 <LoadingSpinner size="large" />
//                 <span className="ml-3 text-lg">Loading products...</span>
//               </div>
//             }>
//               <ProductListing />
//             </Suspense>
//           </main>
//         </div>
//       </main>
      
//       <Footer />
//     </div>
//   )
// }