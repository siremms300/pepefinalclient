// components/products/ProductCard.tsx (Updated for backend data)
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { StarIcon, FireIcon, ClockIcon, PlusIcon } from '@heroicons/react/24/solid'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useCart } from '../../lib/hooks/useCart'
import { useToast } from '../providers/ToastProvider'

// Update the interface to match backend data
interface Product {
  id: string | number  // Changed: Can be string (MongoDB _id) or number
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  reviewCount: number
  isPopular?: boolean
  isVegetarian?: boolean
  isVegan?: boolean
  preparationTime?: number
  stock?: number  // Added: from backend
  status?: string // Added: from backend
}

interface ProductCardProps {
  product: Product
  viewMode: 'grid' | 'list'
  showAddToCart?: boolean
}

export default function ProductCard({ product, viewMode, showAddToCart = true }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { showToast } = useToast()

  // const handleAddToCart = () => {
  //   // Check if product is in stock
  //   if (product.stock === 0) {
  //     showToast(`${product.name} is out of stock!`)
  //     return
  //   }
    
  //   addToCart({
  //     id: product.id.toString(), // Ensure string ID
  //     name: product.name,
  //     price: product.price,
  //     image: product.image,
  //   })
    
  //   // Show toast notification instead of opening cart
  //   showToast(`${product.name} added to cart!`)
  // }

  // In components/products/ProductCard.tsx, update the handleAddToCart function:
// const handleAddToCart = () => {
//   // Check if product is in stock
//   if (product.stock === 0) {
//     showToast(`${product.name} is out of stock!`)
//     return
//   }
  
//   // Ensure price is a number
//   const price = Number(product.price) || 0
  
//   addToCart({
//     id: product.id.toString(), // Ensure string ID
//     name: product.name,
//     price: price, // Use converted price
//     image: product.image,
//   })
  
//   showToast(`${product.name} added to cart!`)
// }

// In components/products/ProductCard.tsx, update the handleAddToCart function:
const handleAddToCart = (e?: React.MouseEvent) => {
  // If event is provided, prevent default navigation
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  // Check if product is in stock
  if (product.stock === 0) {
    showToast(`${product.name} is out of stock!`)
    return
  }
  
  // Ensure price is a number
  const price = Number(product.price) || 0
  
  addToCart({
    id: product.id.toString(),
    name: product.name,
    price: price,
    image: product.image,
  })
  
  showToast(`${product.name} added to cart!`)
}

  // Check if product is out of stock
  const isOutOfStock = product.stock === 0 || product.status === 'Out of Stock'

  if (viewMode === 'list') {
    return (
      <Link href={`/products/${product.id}`} className="block">
        <div className={`bg-white rounded-xl shadow-sm border ${isOutOfStock ? 'border-gray-300 opacity-75' : 'border-gray-200'} overflow-hidden hover:shadow-md transition-shadow`}>
          <div className="flex">
            {/* Image */}
            <div className="w-32 h-32 md:w-48 md:h-48 relative flex-shrink-0">
              
              <div className="absolute inset-0 bg-gradient-to-br from-pepe-secondary to-pepe-light flex items-center justify-center">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-pepe-primary/20 rounded-full flex items-center justify-center mb-2">
                      <span className="text-3xl md:text-4xl">🍽️</span>
                    </div>
                    <p className="text-sm text-pepe-dark font-medium">Food Image</p>
                  </div>
                )}
              </div>
              
              {/* Popular Badge */}
              {product.isPopular && (
                <div className="absolute top-2 left-2 bg-pepe-primary text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                  <FireIcon className="w-3 h-3 mr-1" />
                  Popular
                </div>
              )}
              
              {/* Stock Status */}
              {isOutOfStock && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-4 md:p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium text-pepe-primary bg-pepe-secondary px-2 py-1 rounded">
                      {product.category}
                    </span>
                    {product.isVegetarian && (
                      <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                        Vegetarian
                      </span>
                    )}
                    {product.isVegan && (
                      <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                        Vegan
                      </span>
                    )}
                  </div>
                  
                  <h3 className={`text-lg md:text-xl font-bold ${isOutOfStock ? 'text-gray-400' : 'text-pepe-dark hover:text-pepe-primary'} transition-colors`}>
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{product.rating || 0}</span>
                      <span className="text-gray-500 text-sm ml-1">
                        ({product.reviewCount || 0})
                      </span>
                    </div>
                    
                    {product.preparationTime && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {product.preparationTime} min
                      </div>
                    )}
                    
                    {product.stock !== undefined && !isOutOfStock && (
                      <div className="flex items-center text-green-600 text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        {product.stock} in stock
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right pl-4">
                  <div className={`text-2xl font-bold ${isOutOfStock ? 'text-gray-400' : 'text-pepe-dark'}`}>
                    ₦{product.price.toLocaleString()}
                  </div>
                  
                  {showAddToCart && (
                    <div className="flex items-center space-x-2 mt-4">
                      <div className={`flex items-center border ${isOutOfStock ? 'border-gray-300' : 'border-gray-300'} rounded-lg`}>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setQuantity(prev => Math.max(1, prev - 1))
                          }}
                          className={`px-3 py-1 ${isOutOfStock ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'} z-10`}
                          disabled={isOutOfStock}
                        >
                          -
                        </button>
                        <span className={`px-3 py-1 ${isOutOfStock ? 'text-gray-400' : ''}`}>{quantity}</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setQuantity(prev => prev + 1)
                          }}
                          className={`px-3 py-1 ${isOutOfStock ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'} z-10`}
                          disabled={isOutOfStock}
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart();
                        }}
                        disabled={isOutOfStock}
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors z-10 ${
                          isOutOfStock 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-pepe-primary text-white hover:bg-pink-500'
                        }`}
                      >
                        <PlusIcon className="w-4 h-4 mr-1" />
                        {isOutOfStock ? 'Out of Stock' : 'Add'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Grid View
  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className={`bg-white rounded-xl shadow-sm border ${isOutOfStock ? 'border-gray-300 opacity-75' : 'border-gray-200'} overflow-hidden hover:shadow-md transition-shadow group`}>
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-pepe-secondary to-pepe-light">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-pepe-primary/20 rounded-full flex items-center justify-center mb-2">
                  <span className="text-3xl md:text-4xl">🍽️</span>
                </div>
                <p className="text-sm text-pepe-dark font-medium">Food Image</p>
              </div>
            </div>
          )}
          
          {/* Popular Badge */}
          {product.isPopular && (
            <div className="absolute top-3 left-3 bg-pepe-primary text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
              <FireIcon className="w-3 h-3 mr-1" />
              Popular
            </div>
          )}
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
            <StarIcon className="w-3 h-3 text-yellow-500 mr-1" />
            <span className="font-medium">{product.rating || 0}</span>
          </div>
          
          {/* Stock Status */}
          {isOutOfStock ? (
            <div className="absolute bottom-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Out of Stock
            </div>
          ) : (
            product.stock !== undefined && (
              <div className="absolute bottom-3 left-3 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                {product.stock} in stock
              </div>
            )
          )}
          
          {/* Add to Cart Button (Floating) */}
          {showAddToCart && !isOutOfStock && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart();
              }}
              className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-lg hover:bg-pepe-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100 z-10"
              aria-label="Add to cart"
            >
              <ShoppingBagIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-medium text-pepe-primary bg-pepe-secondary px-2 py-1 rounded">
              {product.category}
            </span>
            {product.isVegetarian && (
              <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                Veg
              </span>
            )}
          </div>
          
          <h3 className={`font-bold ${isOutOfStock ? 'text-gray-400' : 'text-pepe-dark group-hover:text-pepe-primary'} transition-colors line-clamp-1`}>
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mt-4">
            <div className={`text-xl font-bold ${isOutOfStock ? 'text-gray-400' : 'text-pepe-dark'}`}>
              ₦{product.price.toLocaleString()}
            </div>
            
            <div className="flex items-center space-x-2">
              {product.preparationTime && (
                <div className="flex items-center text-gray-500 text-sm">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {product.preparationTime}min
                </div>
              )}
              
              {/* Add to Cart Button (Inline - for mobile/small screens) */}
              {showAddToCart && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                  disabled={isOutOfStock}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors text-sm z-10 ${
                    isOutOfStock 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-pepe-primary text-white hover:bg-pink-500'
                  }`}
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  {isOutOfStock ? 'Out of Stock' : 'Add'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
























































// // components/products/ProductCard.tsx (Updated for backend data)
// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { StarIcon, FireIcon, ClockIcon, PlusIcon } from '@heroicons/react/24/solid'
// import { ShoppingBagIcon } from '@heroicons/react/24/outline'
// import { useCart } from '../../lib/hooks/useCart'
// import { useToast } from '../providers/ToastProvider'

// // Update the interface to match backend data
// interface Product {
//   id: string | number  // Changed: Can be string (MongoDB _id) or number
//   name: string
//   description: string
//   price: number
//   image: string
//   category: string
//   rating: number
//   reviewCount: number
//   isPopular?: boolean
//   isVegetarian?: boolean
//   isVegan?: boolean
//   preparationTime?: number
//   stock?: number  // Added: from backend
//   status?: string // Added: from backend
// }

// interface ProductCardProps {
//   product: Product
//   viewMode: 'grid' | 'list'
//   showAddToCart?: boolean
// }

// export default function ProductCard({ product, viewMode, showAddToCart = true }: ProductCardProps) {
//   const [quantity, setQuantity] = useState(1)
//   const { addToCart } = useCart()
//   const { showToast } = useToast()

//   const handleAddToCart = () => {
//     // Check if product is in stock
//     if (product.stock === 0) {
//       showToast(`${product.name} is out of stock!`)
//       return
//     }
    
//     addToCart({
//       id: product.id.toString(), // Ensure string ID
//       name: product.name,
//       price: product.price,
//       image: product.image,
//     })
    
//     // Show toast notification instead of opening cart
//     showToast(`${product.name} added to cart!`)
//   }

//   // Check if product is out of stock
//   const isOutOfStock = product.stock === 0 || product.status === 'Out of Stock'

//   if (viewMode === 'list') {
//     return (

//       // In ProductCard.tsx, at the beginning of the component:

//       <div className={`bg-white rounded-xl shadow-sm border ${isOutOfStock ? 'border-gray-300 opacity-75' : 'border-gray-200'} overflow-hidden hover:shadow-md transition-shadow`}>
//         <div className="flex">
//           {/* Image */}
//           <div className="w-32 h-32 md:w-48 md:h-48 relative flex-shrink-0">
            
//             <div className="absolute inset-0 bg-gradient-to-br from-pepe-secondary to-pepe-light flex items-center justify-center">
//               {product.image ? (
//                 <img 
//                   src={product.image} 
//                   alt={product.name}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="text-center">
//                   <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-pepe-primary/20 rounded-full flex items-center justify-center mb-2">
//                     <span className="text-3xl md:text-4xl">🍽️</span>
//                   </div>
//                   <p className="text-sm text-pepe-dark font-medium">Food Image</p>
//                 </div>
//               )}
//             </div>
            
//             {/* Popular Badge */}
//             {product.isPopular && (
//               <div className="absolute top-2 left-2 bg-pepe-primary text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
//                 <FireIcon className="w-3 h-3 mr-1" />
//                 Popular
//               </div>
//             )}
            
//             {/* Stock Status */}
//             {isOutOfStock && (
//               <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
//                 Out of Stock
//               </div>
//             )}
//           </div>

//           {/* Content */}
//           <div className="flex-1 p-4 md:p-6">
//             <div className="flex justify-between items-start">
//               <div className="flex-1">
//                 <div className="flex items-center space-x-2 mb-1">
//                   <span className="text-xs font-medium text-pepe-primary bg-pepe-secondary px-2 py-1 rounded">
//                     {product.category}
//                   </span>
//                   {product.isVegetarian && (
//                     <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
//                       Vegetarian
//                     </span>
//                   )}
//                   {product.isVegan && (
//                     <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
//                       Vegan
//                     </span>
//                   )}
//                 </div>
                
//                 <Link href={`/products/${product.id}`}>
//                   <h3 className={`text-lg md:text-xl font-bold ${isOutOfStock ? 'text-gray-400' : 'text-pepe-dark hover:text-pepe-primary'} transition-colors`}>
//                     {product.name}
//                   </h3>
//                 </Link>
                
//                 <p className="text-gray-600 text-sm mt-1 line-clamp-2">
//                   {product.description}
//                 </p>
                
//                 <div className="flex items-center mt-2 space-x-4">
//                   <div className="flex items-center">
//                     <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
//                     <span className="font-medium">{product.rating || 0}</span>
//                     <span className="text-gray-500 text-sm ml-1">
//                       ({product.reviewCount || 0})
//                     </span>
//                   </div>
                  
//                   {product.preparationTime && (
//                     <div className="flex items-center text-gray-500 text-sm">
//                       <ClockIcon className="w-4 h-4 mr-1" />
//                       {product.preparationTime} min
//                     </div>
//                   )}
                  
//                   {product.stock !== undefined && !isOutOfStock && (
//                     <div className="flex items-center text-green-600 text-sm">
//                       <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
//                       {product.stock} in stock
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="text-right pl-4">
//                 <div className={`text-2xl font-bold ${isOutOfStock ? 'text-gray-400' : 'text-pepe-dark'}`}>
//                   ₦{product.price.toLocaleString()}
//                 </div>
                
//                 {showAddToCart && (
//                   <div className="flex items-center space-x-2 mt-4">
//                     <div className={`flex items-center border ${isOutOfStock ? 'border-gray-300' : 'border-gray-300'} rounded-lg`}>
//                       <button
//                         onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
//                         className={`px-3 py-1 ${isOutOfStock ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
//                         disabled={isOutOfStock}
//                       >
//                         -
//                       </button>
//                       <span className={`px-3 py-1 ${isOutOfStock ? 'text-gray-400' : ''}`}>{quantity}</span>
//                       <button
//                         onClick={() => setQuantity(prev => prev + 1)}
//                         className={`px-3 py-1 ${isOutOfStock ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
//                         disabled={isOutOfStock}
//                       >
//                         +
//                       </button>
//                     </div>
                    
//                     <button
//                       onClick={handleAddToCart}
//                       disabled={isOutOfStock}
//                       className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
//                         isOutOfStock 
//                           ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
//                           : 'bg-pepe-primary text-white hover:bg-pink-500'
//                       }`}
//                     >
//                       <PlusIcon className="w-4 h-4 mr-1" />
//                       {isOutOfStock ? 'Out of Stock' : 'Add'}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Grid View
//   return (
//     <div className={`bg-white rounded-xl shadow-sm border ${isOutOfStock ? 'border-gray-300 opacity-75' : 'border-gray-200'} overflow-hidden hover:shadow-md transition-shadow group`}>
//       {/* Image */}
//       <div className="relative h-48 overflow-hidden bg-gradient-to-br from-pepe-secondary to-pepe-light">
//         {product.image ? (
//           <img 
//             src={product.image} 
//             alt={product.name}
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//           />
//         ) : (
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="text-center">
//               <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-pepe-primary/20 rounded-full flex items-center justify-center mb-2">
//                 <span className="text-3xl md:text-4xl">🍽️</span>
//               </div>
//               <p className="text-sm text-pepe-dark font-medium">Food Image</p>
//             </div>
//           </div>
//         )}
        
//         {/* Popular Badge */}
//         {product.isPopular && (
//           <div className="absolute top-3 left-3 bg-pepe-primary text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
//             <FireIcon className="w-3 h-3 mr-1" />
//             Popular
//           </div>
//         )}
        
//         {/* Rating Badge */}
//         <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
//           <StarIcon className="w-3 h-3 text-yellow-500 mr-1" />
//           <span className="font-medium">{product.rating || 0}</span>
//         </div>
        
//         {/* Stock Status */}
//         {isOutOfStock ? (
//           <div className="absolute bottom-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
//             Out of Stock
//           </div>
//         ) : (
//           product.stock !== undefined && (
//             <div className="absolute bottom-3 left-3 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
//               {product.stock} in stock
//             </div>
//           )
//         )}
        
//         {showAddToCart && !isOutOfStock && (
//           <button
//             onClick={handleAddToCart}
//             className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-lg hover:bg-pepe-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100"
//             aria-label="Add to cart"
//           >
//             <ShoppingBagIcon className="w-5 h-5" />
//           </button>
//         )}
//       </div>

//       {/* Content */}
//       <div className="p-4">
//         <div className="flex items-center space-x-2 mb-2">
//           <span className="text-xs font-medium text-pepe-primary bg-pepe-secondary px-2 py-1 rounded">
//             {product.category}
//           </span>
//           {product.isVegetarian && (
//             <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
//               Veg
//             </span>
//           )}
//         </div>
        
//         <Link href={`/products/${product.id}`}>
//           <h3 className={`font-bold ${isOutOfStock ? 'text-gray-400' : 'text-pepe-dark hover:text-pepe-primary'} transition-colors line-clamp-1`}>
//             {product.name}
//           </h3>
//         </Link>
        
//         <p className="text-gray-600 text-sm mt-1 line-clamp-2">
//           {product.description}
//         </p>
        
//         <div className="flex items-center justify-between mt-4">
//           <div className={`text-xl font-bold ${isOutOfStock ? 'text-gray-400' : 'text-pepe-dark'}`}>
//             ₦{product.price.toLocaleString()}
//           </div>
          
//           <div className="flex items-center space-x-2">
//             {product.preparationTime && (
//               <div className="flex items-center text-gray-500 text-sm">
//                 <ClockIcon className="w-4 h-4 mr-1" />
//                 {product.preparationTime}min
//               </div>
//             )}
            
//             {showAddToCart && (
//               <button
//                 onClick={handleAddToCart}
//                 disabled={isOutOfStock}
//                 className={`flex items-center px-3 py-2 rounded-lg transition-colors text-sm ${
//                   isOutOfStock 
//                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
//                     : 'bg-pepe-primary text-white hover:bg-pink-500'
//                 }`}
//               >
//                 <PlusIcon className="w-4 h-4 mr-1" />
//                 {isOutOfStock ? 'Out of Stock' : 'Add'}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


































// // Desktop/pepefinal/frontend/components/products/ProductCard.tsx
// 'use client'

// import { useState } from 'react'
// import Link from 'next/link'
// import { StarIcon, FireIcon, ClockIcon, PlusIcon } from '@heroicons/react/24/solid'
// import { ShoppingBagIcon } from '@heroicons/react/24/outline'
// import { useCart } from '../../lib/hooks/useCart'
// import { useToast } from '../providers/ToastProvider'

// interface Product {
//   id: number
//   name: string
//   description: string
//   price: number
//   image: string
//   category: string
//   rating: number
//   reviewCount: number
//   isPopular?: boolean
//   isVegetarian?: boolean
//   isVegan?: boolean
//   preparationTime?: number
// }

// interface ProductCardProps {
//   product: Product
//   viewMode: 'grid' | 'list'
//   showAddToCart?: boolean
// }

// export default function ProductCard({ product, viewMode, showAddToCart = true }: ProductCardProps) {
//   const [quantity, setQuantity] = useState(1)
//   const { addToCart } = useCart()
//   const { showToast } = useToast()

//   const handleAddToCart = () => {
//     addToCart({
//       id: product.id.toString(),
//       name: product.name,
//       price: product.price,
//       image: product.image,
//     })
    
//     // Show toast notification instead of opening cart
//     showToast(`${product.name} added to cart!`)
//   }

//   if (viewMode === 'list') {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
//         <div className="flex">
//           {/* Image */}
//           <div className="w-32 h-32 md:w-48 md:h-48 relative flex-shrink-0">
//             <div className="absolute inset-0 bg-gradient-to-br from-pepe-secondary to-pepe-light flex items-center justify-center">
//               <div className="text-center">
//                 <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-pepe-primary/20 rounded-full flex items-center justify-center mb-2">
//                   <span className="text-3xl md:text-4xl">🍽️</span>
//                 </div>
//                 <p className="text-sm text-pepe-dark font-medium">Food Image</p>
//               </div>
//             </div>
            
//             {product.isPopular && (
//               <div className="absolute top-2 left-2 bg-pepe-primary text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
//                 <FireIcon className="w-3 h-3 mr-1" />
//                 Popular
//               </div>
//             )}
//           </div>

//           {/* Content */}
//           <div className="flex-1 p-4 md:p-6">
//             <div className="flex justify-between items-start">
//               <div className="flex-1">
//                 <div className="flex items-center space-x-2 mb-1">
//                   <span className="text-xs font-medium text-pepe-primary bg-pepe-secondary px-2 py-1 rounded">
//                     {product.category}
//                   </span>
//                   {product.isVegetarian && (
//                     <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
//                       Vegetarian
//                     </span>
//                   )}
//                   {product.isVegan && (
//                     <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
//                       Vegan
//                     </span>
//                   )}
//                 </div>
                
//                 <Link href={`/products/${product.id}`}>
//                   <h3 className="text-lg md:text-xl font-bold text-pepe-dark hover:text-pepe-primary transition-colors">
//                     {product.name}
//                   </h3>
//                 </Link>
                
//                 <p className="text-gray-600 text-sm mt-1 line-clamp-2">
//                   {product.description}
//                 </p>
                
//                 <div className="flex items-center mt-2 space-x-4">
//                   <div className="flex items-center">
//                     <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
//                     <span className="font-medium">{product.rating}</span>
//                     <span className="text-gray-500 text-sm ml-1">
//                       ({product.reviewCount})
//                     </span>
//                   </div>
                  
//                   {product.preparationTime && (
//                     <div className="flex items-center text-gray-500 text-sm">
//                       <ClockIcon className="w-4 h-4 mr-1" />
//                       {product.preparationTime} min
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="text-right pl-4">
//                 <div className="text-2xl font-bold text-pepe-dark">
//                   ₦{product.price.toLocaleString()}
//                 </div>
                
//                 {showAddToCart && (
//                   <div className="flex items-center space-x-2 mt-4">
//                     <div className="flex items-center border border-gray-300 rounded-lg">
//                       <button
//                         onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
//                         className="px-3 py-1 text-gray-600 hover:bg-gray-100"
//                       >
//                         -
//                       </button>
//                       <span className="px-3 py-1">{quantity}</span>
//                       <button
//                         onClick={() => setQuantity(prev => prev + 1)}
//                         className="px-3 py-1 text-gray-600 hover:bg-gray-100"
//                       >
//                         +
//                       </button>
//                     </div>
                    
//                     <button
//                       onClick={handleAddToCart}
//                       className="flex items-center bg-pepe-primary text-white px-4 py-2 rounded-lg hover:bg-pink-500 transition-colors"
//                     >
//                       <PlusIcon className="w-4 h-4 mr-1" />
//                       Add
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Grid View
//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
//       {/* Image */}
//       <div className="relative h-48 overflow-hidden bg-gradient-to-br from-pepe-secondary to-pepe-light">
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="text-center">
//             <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-pepe-primary/20 rounded-full flex items-center justify-center mb-2">
//               <span className="text-3xl md:text-4xl">🍽️</span>
//             </div>
//             <p className="text-sm text-pepe-dark font-medium">Food Image</p>
//           </div>
//         </div>
        
//         {product.isPopular && (
//           <div className="absolute top-3 left-3 bg-pepe-primary text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
//             <FireIcon className="w-3 h-3 mr-1" />
//             Popular
//           </div>
//         )}
        
//         <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
//           <div className="flex items-center">
//             <StarIcon className="w-3 h-3 text-yellow-500 mr-1" />
//             <span className="font-medium">{product.rating}</span>
//           </div>
//         </div>
        
//         {showAddToCart && (
//           <button
//             onClick={handleAddToCart}
//             className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-lg hover:bg-pepe-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100"
//             aria-label="Add to cart"
//           >
//             <ShoppingBagIcon className="w-5 h-5" />
//           </button>
//         )}
//       </div>

//       {/* Content */}
//       <div className="p-4">
//         <div className="flex items-center space-x-2 mb-2">
//           <span className="text-xs font-medium text-pepe-primary bg-pepe-secondary px-2 py-1 rounded">
//             {product.category}
//           </span>
//           {product.isVegetarian && (
//             <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
//               Veg
//             </span>
//           )}
//         </div>
        
//         <Link href={`/products/${product.id}`}>
//           <h3 className="font-bold text-pepe-dark hover:text-pepe-primary transition-colors line-clamp-1">
//             {product.name}
//           </h3>
//         </Link>
        
//         <p className="text-gray-600 text-sm mt-1 line-clamp-2">
//           {product.description}
//         </p>
        
//         <div className="flex items-center justify-between mt-4">
//           <div className="text-xl font-bold text-pepe-dark">
//             ₦{product.price.toLocaleString()}
//           </div>
          
//           <div className="flex items-center space-x-2">
//             {product.preparationTime && (
//               <div className="flex items-center text-gray-500 text-sm">
//                 <ClockIcon className="w-4 h-4 mr-1" />
//                 {product.preparationTime}min
//               </div>
//             )}
            
//             {showAddToCart && (
//               <button
//                 onClick={handleAddToCart}
//                 className="flex items-center bg-pepe-primary text-white px-3 py-2 rounded-lg hover:bg-pink-500 transition-colors text-sm"
//               >
//                 <PlusIcon className="w-4 h-4 mr-1" />
//                 Add
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


