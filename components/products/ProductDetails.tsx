// components/products/ProductDetails.tsx
'use client'

import { useState } from 'react'
import { 
  StarIcon, 
  ClockIcon, 
  HeartIcon, 
  ShoppingCartIcon,
  ArrowLeftIcon,
  ShareIcon,
  TagIcon,
  CheckCircleIcon,
  CubeIcon,
  ScaleIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  ShieldCheckIcon,
  BuildingStorefrontIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { useCart } from '@/lib/hooks/useCart'
import { useToast } from '@/components/providers/ToastProvider'
import RelatedProducts from './RelatedProducts'

// Simplified interface for product data
interface ProductDetailsProps {
  product: {
    _id: string
    name: string
    description: string
    price: number
    oldPrice?: number
    retailPrice?: number
    wholesalePrice?: number
    moq: number
    pricingTier: string
    stock: number
    rating: number
    brand: string
    discount?: number
    size?: string
    images: Array<{ url: string; public_id: string }>
    banners?: Array<{ url: string; title?: string }>
    bannerTitle?: string
    category: { _id: string; name: string }
    subCategory?: { _id: string; name: string }
    thirdCategory?: { _id: string; name: string }
    featured: boolean
    wholesaleEnabled: boolean
    status: string
    sku?: string
    tags?: string[]
    specifications?: Record<string, string>
    weight?: number
    dimensions?: {
      length: number
      width: number
      height: number
    }
    createdAt?: string
    updatedAt?: string
  }
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(product.moq || 1)
  const [isFavorite, setIsFavorite] = useState(false)
  const { addToCart } = useCart()
  const { showToast } = useToast()

  // Helper function to safely access properties
  const getSafeValue = <T,>(value: T | undefined | null, defaultValue: T): T => {
    return value !== undefined && value !== null ? value : defaultValue
  }

  // Calculate discount percentage
  const hasDiscount = product.oldPrice && product.oldPrice > product.price
  const discountPercentage = hasDiscount 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : (product.discount || 0)

  // Get product images for gallery
  const productImages = getSafeValue(product.images, []).map(img => img.url)
  const allImages = productImages.length > 0 ? productImages : ['/images/placeholder-food.jpg']

  const handleAddToCart = () => {
    // Check if product is in stock
    if (product.stock === 0) {
      showToast(`${product.name} is out of stock!`, 'error')
      return
    }
    
    // Check if quantity meets MOQ
    if (quantity < (product.moq || 1)) {
      showToast(`Minimum order quantity is ${product.moq || 1}`, 'error')
      return
    }
    
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: allImages[0],
      quantity: quantity
    })
    
    showToast(`${product.name} added to cart!`, 'success')
  }

  const handleBuyNow = () => {
    handleAddToCart()
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      showToast('Link copied to clipboard!', 'success')
    }
  }

  // Check if product is vegetarian/vegan based on tags
  const isVegetarian = product.tags?.includes('vegetarian') || false
  const isVegan = product.tags?.includes('vegan') || false
  const isGlutenFree = product.tags?.includes('gluten-free') || false
  const isDairyFree = product.tags?.includes('dairy-free') || false

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-gray-600 hover:text-pepe-primary mb-8 transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back to Menu
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-6">
          {/* Main Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
            <img
              src={allImages[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder-food.jpg'
              }}
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.featured && (
                <div className="bg-gradient-to-r from-pepe-primary to-pink-500 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center shadow-lg">
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  Popular
                </div>
              )}
              
              {product.stock === 0 ? (
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                  Out of Stock
                </div>
              ) : (
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                  In Stock ({product.stock})
                </div>
              )}
              
              {discountPercentage > 0 && (
                <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                  {discountPercentage}% OFF
                </div>
              )}
              
              {product.wholesaleEnabled && (
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg flex items-center">
                  <BuildingStorefrontIcon className="w-4 h-4 mr-2" />
                  Wholesale Available
                </div>
              )}
            </div>
            
            {/* Favorite Button */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg hover:scale-110"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? (
                <HeartSolid className="w-6 h-6 fill-red-500 text-red-500" />
              ) : (
                <HeartIcon className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Thumbnail Images */}
          {allImages.length > 1 && (
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? 'border-pepe-primary ring-2 ring-pepe-primary/20 ring-offset-2 scale-105'
                      : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - view ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder-food.jpg'
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Banners if available */}
          {product.banners && product.banners.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                {product.bannerTitle || 'Special Offers'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.banners.map((banner, index) => (
                  <div key={index} className="relative rounded-xl overflow-hidden h-32">
                    <img
                      src={banner.url}
                      alt={banner.title || 'Special Offer'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-food.jpg'
                      }}
                    />
                    {banner.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="text-white font-medium">{banner.title}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          {/* Category Hierarchy */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>{product.category?.name || 'Uncategorized'}</span>
            {product.subCategory && (
              <>
                <span>/</span>
                <span>{product.subCategory.name}</span>
              </>
            )}
            {product.thirdCategory && (
              <>
                <span>/</span>
                <span>{product.thirdCategory.name}</span>
              </>
            )}
          </div>

          {/* Product Name */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>

          {/* Brand & Rating & SKU */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 0)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-3 text-gray-700 font-semibold">
                {(product.rating || 0).toFixed(1)}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <ShieldCheckIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">{product.brand || 'Unknown Brand'}</span>
            </div>
            
            {product.sku && (
              <div className="flex items-center text-gray-500 text-sm">
                <TagIcon className="w-4 h-4 mr-2" />
                SKU: {product.sku}
              </div>
            )}
          </div>

          {/* Dietary Badges */}
          <div className="flex flex-wrap items-center gap-3">
            {isVegetarian && (
              <span className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-100 text-green-800 border border-green-200 rounded-full text-sm font-medium flex items-center">
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Vegetarian
              </span>
            )}
            {isVegan && (
              <span className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-100 text-emerald-800 border border-emerald-200 rounded-full text-sm font-medium flex items-center">
                🌱 Vegan
              </span>
            )}
            {isGlutenFree && (
              <span className="px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-100 text-amber-800 border border-amber-200 rounded-full text-sm font-medium flex items-center">
                🌾 Gluten Free
              </span>
            )}
            {isDairyFree && (
              <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-100 text-blue-800 border border-blue-200 rounded-full text-sm font-medium flex items-center">
                🥛 Dairy Free
              </span>
            )}
            {product.tags && product.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>

          {/* Size */}
          {product.size && (
            <div className="flex items-center text-gray-600">
              <span className="font-medium mr-2">Size:</span>
              <span>{product.size}</span>
            </div>
          )}

          {/* Price Section */}
          <div className="space-y-3">
            <div className="flex items-center flex-wrap gap-4">
              <div className="text-5xl font-bold text-pepe-primary">
                ₦{product.price.toLocaleString()}
              </div>
              
              {hasDiscount && product.oldPrice && (
                <>
                  <div className="text-2xl font-bold text-gray-400 line-through">
                    ₦{product.oldPrice.toLocaleString()}
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full font-bold text-lg">
                    Save {discountPercentage}%
                  </div>
                </>
              )}
            </div>
            
            {/* Retail & Wholesale Prices */}
            {(product.retailPrice || product.wholesalePrice) && (
              <div className="space-y-2">
                {product.retailPrice && product.retailPrice !== product.price && (
                  <div className="text-sm text-gray-600">
                    <CurrencyDollarIcon className="w-4 h-4 inline mr-2" />
                    Retail: ₦{product.retailPrice.toLocaleString()}
                  </div>
                )}
                
                {product.wholesaleEnabled && product.wholesalePrice && (
                  <div className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                    <BuildingStorefrontIcon className="w-4 h-4 inline mr-2" />
                    Wholesale Price: ₦{product.wholesalePrice.toLocaleString()}
                    <span className="text-xs text-gray-500 ml-2">(Contact for bulk orders)</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Pricing Tier */}
            {product.pricingTier && product.pricingTier !== 'Standard' && (
              <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                <ChartBarIcon className="w-4 h-4 inline mr-2" />
                Pricing Tier: {product.pricingTier}
              </div>
            )}
            
            {/* MOQ Notice */}
            {product.moq > 1 && (
              <div className="text-sm text-gray-600 bg-yellow-50 px-4 py-2 rounded-lg">
                <CurrencyDollarIcon className="w-4 h-4 inline mr-2" />
                Minimum order quantity: {product.moq} items
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className={`px-4 py-3 rounded-lg ${
            product.stock === 0 
              ? 'bg-red-50 text-red-800 border border-red-200' 
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {product.stock === 0 
                  ? 'Out of Stock' 
                  : `${product.stock} units available`
                }
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                product.stock === 0 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {product.status || 'Active'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700 capitalize">{key}:</span>
                    <span className="ml-2 text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weight & Dimensions */}
          {(product.weight || product.dimensions) && (
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Physical Details</h3>
              <div className="flex flex-wrap gap-6">
                {product.weight && (
                  <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                    <ScaleIcon className="w-5 h-5 mr-3 text-pepe-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-semibold text-gray-900">{product.weight} kg</p>
                    </div>
                  </div>
                )}
                
                {product.dimensions && (
                  <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                    <CubeIcon className="w-5 h-5 mr-3 text-pepe-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Dimensions</p>
                      <p className="font-semibold text-gray-900">
                        {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Quantity</h3>
              {product.moq > 1 && (
                <span className="text-sm text-gray-500">Min: {product.moq}</span>
              )}
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(prev => Math.max(product.moq || 1, prev - 1))}
                  className="px-5 py-4 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={quantity <= (product.moq || 1)}
                >
                  -
                </button>
                <span className="px-6 py-4 text-xl font-bold min-w-[80px] text-center bg-gray-50">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-5 py-4 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <div className="text-xl font-bold text-gray-900">
                Total: ₦{(product.price * quantity).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-gray-200 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex items-center justify-center py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                  product.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-white border-2 border-pepe-primary text-pepe-primary hover:bg-pepe-primary hover:text-white hover:shadow-lg'
                }`}
              >
                <ShoppingCartIcon className="w-6 h-6 mr-3" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className={`py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                  product.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pepe-primary to-pink-500 text-white hover:shadow-xl hover:scale-[1.02]'
                }`}
              >
                Order Now
              </button>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center justify-center w-full py-4 text-gray-600 hover:text-pepe-primary transition-colors border border-gray-200 rounded-xl hover:border-pepe-primary/20 hover:bg-pepe-primary/5"
            >
              <ShareIcon className="w-5 h-5 mr-2" />
              Share this product
            </button>
          </div>

          {/* Product Meta */}
          <div className="pt-6 border-t border-gray-200 text-sm text-gray-500">
            <div className="flex flex-wrap items-center gap-4">
              <span>Product ID: {product._id}</span>
              {product.createdAt && (
                <span>Added: {new Date(product.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}</span>
              )}
              {product.updatedAt && (
                <span>Updated: {new Date(product.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {product.category?._id && (
        <div className="mt-20 pt-12 border-t border-gray-200">
          <RelatedProducts 
            categoryId={product.category._id}
            currentProductId={product._id}
          />
        </div>
      )}
    </div>
  )
}






















// // components/products/ProductDetails.tsx
// 'use client'

// import { useState } from 'react'
// import { 
//   StarIcon, 
//   ClockIcon, 
//   HeartIcon, 
//   ShoppingCartIcon,
//   ArrowLeftIcon,
//   ShareIcon,
//   TagIcon,
//   CheckCircleIcon,
//   CubeIcon,
//   ScaleIcon,
//   CurrencyDollarIcon,
//   SparklesIcon,
//   ShieldCheckIcon,
//   BuildingStorefrontIcon,
//   ChartBarIcon
// } from '@heroicons/react/24/outline'
// import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid'
// import { useCart } from '@/lib/hooks/useCart'
// import { useToast } from '@/components/providers/ToastProvider'
// import RelatedProducts from './RelatedProducts'

// interface BackendProduct {
//   _id: string
//   name: string
//   description: string
//   price: number
//   oldPrice?: number
//   retailPrice?: number
//   wholesalePrice?: number
//   moq: number
//   pricingTier: string
//   stock: number
//   rating: number
//   brand: string
//   discount?: number
//   size?: string
//   images: { url: string; public_id: string }[]
//   banners?: { url: string; title?: string }[]
//   bannerTitle?: string
//   category: { _id: string; name: string }
//   subCategory?: { _id: string; name: string }
//   thirdCategory?: { _id: string; name: string }
//   featured: boolean
//   wholesaleEnabled: boolean
//   status: string
//   sku?: string
//   tags?: string[]
//   specifications?: Record<string, string>
//   weight?: number
//   dimensions?: {
//     length: number
//     width: number
//     height: number
//   }
//   createdBy?: string
//   createdAt: string
//   updatedAt: string
// }

// interface ProductDetailsProps {
//   product: BackendProduct
// }

// export default function ProductDetails({ product }: ProductDetailsProps) {
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0)
//   const [quantity, setQuantity] = useState(product.moq || 1)
//   const [isFavorite, setIsFavorite] = useState(false)
//   const { addToCart } = useCart()
//   const { showToast } = useToast()

//   // Transform product data
//   const transformProduct = (product: BackendProduct) => ({
//     id: product._id,
//     name: product.name,
//     description: product.description,
//     price: product.price,
//     oldPrice: product.oldPrice,
//     retailPrice: product.retailPrice,
//     wholesalePrice: product.wholesalePrice,
//     moq: product.moq || 1,
//     pricingTier: product.pricingTier || 'Standard',
//     stock: product.stock || 0,
//     rating: product.rating || 0,
//     brand: product.brand,
//     discount: product.discount || 0,
//     size: product.size,
//     image: product.images?.[0]?.url || '/images/placeholder-food.jpg',
//     images: product.images || [],
//     banners: product.banners || [],
//     bannerTitle: product.bannerTitle,
//     category: product.category?.name || 'Uncategorized',
//     categoryId: product.category?._id,
//     subCategory: product.subCategory?.name,
//     thirdCategory: product.thirdCategory?.name,
//     isPopular: product.featured,
//     isFeatured: product.featured,
//     isVegetarian: product.tags?.includes('vegetarian') || false,
//     isVegan: product.tags?.includes('vegan') || false,
//     isGlutenFree: product.tags?.includes('gluten-free') || false,
//     isDairyFree: product.tags?.includes('dairy-free') || false,
//     preparationTime: 15, // Default value
//     status: product.status || 'Active',
//     sku: product.sku,
//     tags: product.tags || [],
//     specifications: product.specifications || {},
//     weight: product.weight,
//     dimensions: product.dimensions,
//     wholesaleEnabled: product.wholesaleEnabled || false,
//   })

//   const transformedProduct = transformProduct(product)

//   const handleAddToCart = () => {
//     // Check if product is in stock
//     if (transformedProduct.stock === 0) {
//       showToast(`${transformedProduct.name} is out of stock!`, 'error')
//       return
//     }
    
//     // Check if quantity meets MOQ
//     if (quantity < transformedProduct.moq) {
//       showToast(`Minimum order quantity is ${transformedProduct.moq}`, 'error')
//       return
//     }
    
//     addToCart({
//       id: transformedProduct.id,
//       name: transformedProduct.name,
//       price: transformedProduct.price,
//       image: transformedProduct.image,
//       quantity: quantity
//     })
    
//     showToast(`${transformedProduct.name} added to cart!`, 'success')
//   }

//   const handleBuyNow = () => {
//     handleAddToCart()
//   }

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: product.name,
//         text: product.description,
//         url: window.location.href,
//       })
//     } else {
//       navigator.clipboard.writeText(window.location.href)
//       showToast('Link copied to clipboard!', 'success')
//     }
//   }

//   // Calculate discount percentage
//   const hasDiscount = transformedProduct.oldPrice && transformedProduct.oldPrice > transformedProduct.price
//   const discountPercentage = hasDiscount 
//     ? Math.round(((transformedProduct.oldPrice! - transformedProduct.price) / transformedProduct.oldPrice!) * 100)
//     : (transformedProduct.discount || 0)

//   // Get product images for gallery
//   const productImages = transformedProduct.images.map(img => img.url)
//   const allImages = productImages.length > 0 ? productImages : [transformedProduct.image]

//   return (
//     <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//       {/* Back Button */}
//       <button
//         onClick={() => window.history.back()}
//         className="flex items-center text-gray-600 hover:text-pepe-primary mb-8 transition-colors"
//       >
//         <ArrowLeftIcon className="w-5 h-5 mr-2" />
//         Back to Menu
//       </button>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//         {/* Product Images */}
//         <div className="space-y-6">
//           {/* Main Image */}
//           <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
//             <img
//               src={allImages[selectedImageIndex]}
//               alt={transformedProduct.name}
//               className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
//               onError={(e) => {
//                 e.currentTarget.src = '/images/placeholder-food.jpg'
//               }}
//             />
            
//             {/* Badges */}
//             <div className="absolute top-4 left-4 flex flex-col gap-2">
//               {transformedProduct.isPopular && (
//                 <div className="bg-gradient-to-r from-pepe-primary to-pink-500 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center shadow-lg">
//                   <SparklesIcon className="w-4 h-4 mr-2" />
//                   Popular
//                 </div>
//               )}
              
//               {transformedProduct.stock === 0 ? (
//                 <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
//                   Out of Stock
//                 </div>
//               ) : (
//                 <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
//                   In Stock ({transformedProduct.stock})
//                 </div>
//               )}
              
//               {discountPercentage > 0 && (
//                 <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
//                   {discountPercentage}% OFF
//                 </div>
//               )}
              
//               {transformedProduct.isFeatured && (
//                 <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg flex items-center">
//                   <StarSolid className="w-4 h-4 mr-2" />
//                   Featured
//                 </div>
//               )}
              
//               {transformedProduct.wholesaleEnabled && (
//                 <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg flex items-center">
//                   <BuildingStorefrontIcon className="w-4 h-4 mr-2" />
//                   Wholesale Available
//                 </div>
//               )}
//             </div>
            
//             {/* Favorite Button */}
//             <button
//               onClick={() => setIsFavorite(!isFavorite)}
//               className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg hover:scale-110"
//               aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
//             >
//               {isFavorite ? (
//                 <HeartSolid className="w-6 h-6 fill-red-500 text-red-500" />
//               ) : (
//                 <HeartIcon className="w-6 h-6 text-gray-700" />
//               )}
//             </button>
//           </div>

//           {/* Thumbnail Images */}
//           {allImages.length > 1 && (
//             <div className="flex space-x-4 overflow-x-auto pb-4">
//               {allImages.map((image, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedImageIndex(index)}
//                   className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
//                     selectedImageIndex === index
//                       ? 'border-pepe-primary ring-2 ring-pepe-primary/20 ring-offset-2 scale-105'
//                       : 'border-gray-200 hover:border-gray-300 hover:scale-105'
//                   }`}
//                 >
//                   <img
//                     src={image}
//                     alt={`${transformedProduct.name} - view ${index + 1}`}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.currentTarget.src = '/images/placeholder-food.jpg'
//                     }}
//                   />
//                 </button>
//               ))}
//             </div>
//           )}

//           {/* Banners if available */}
//           {transformedProduct.banners && transformedProduct.banners.length > 0 && (
//             <div className="mt-8">
//               <h3 className="text-lg font-semibold mb-4 text-gray-900">
//                 {transformedProduct.bannerTitle || 'Special Offers'}
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {transformedProduct.banners.map((banner, index) => (
//                   <div key={index} className="relative rounded-xl overflow-hidden h-32">
//                     <img
//                       src={banner.url}
//                       alt={banner.title || 'Special Offer'}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.currentTarget.src = '/images/placeholder-food.jpg'
//                       }}
//                     />
//                     {banner.title && (
//                       <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
//                         <p className="text-white font-medium">{banner.title}</p>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Product Info */}
//         <div className="space-y-8">
//           {/* Category Hierarchy */}
//           <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
//             <span>{transformedProduct.category}</span>
//             {transformedProduct.subCategory && (
//               <>
//                 <span>/</span>
//                 <span>{transformedProduct.subCategory}</span>
//               </>
//             )}
//             {transformedProduct.thirdCategory && (
//               <>
//                 <span>/</span>
//                 <span>{transformedProduct.thirdCategory}</span>
//               </>
//             )}
//           </div>

//           {/* Product Name */}
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
//             {transformedProduct.name}
//           </h1>

//           {/* Brand & Rating & SKU */}
//           <div className="flex flex-wrap items-center gap-6">
//             <div className="flex items-center">
//               <div className="flex">
//                 {[...Array(5)].map((_, i) => (
//                   <StarIcon
//                     key={i}
//                     className={`w-5 h-5 ${
//                       i < Math.floor(transformedProduct.rating)
//                         ? 'text-yellow-400 fill-yellow-400'
//                         : 'text-gray-300'
//                     }`}
//                   />
//                 ))}
//               </div>
//               <span className="ml-3 text-gray-700 font-semibold">{transformedProduct.rating.toFixed(1)}</span>
//             </div>
            
//             <div className="flex items-center text-gray-600">
//               <ShieldCheckIcon className="w-5 h-5 mr-2" />
//               <span className="font-medium">{transformedProduct.brand}</span>
//             </div>
            
//             {transformedProduct.sku && (
//               <div className="flex items-center text-gray-500 text-sm">
//                 <TagIcon className="w-4 h-4 mr-2" />
//                 SKU: {transformedProduct.sku}
//               </div>
//             )}
//           </div>

//           {/* Dietary Badges */}
//           <div className="flex flex-wrap items-center gap-3">
//             {transformedProduct.isVegetarian && (
//               <span className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-100 text-green-800 border border-green-200 rounded-full text-sm font-medium flex items-center">
//                 <CheckCircleIcon className="w-4 h-4 mr-2" />
//                 Vegetarian
//               </span>
//             )}
//             {transformedProduct.isVegan && (
//               <span className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-100 text-emerald-800 border border-emerald-200 rounded-full text-sm font-medium flex items-center">
//                 🌱 Vegan
//               </span>
//             )}
//             {transformedProduct.isGlutenFree && (
//               <span className="px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-100 text-amber-800 border border-amber-200 rounded-full text-sm font-medium flex items-center">
//                 🌾 Gluten Free
//               </span>
//             )}
//             {transformedProduct.isDairyFree && (
//               <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-100 text-blue-800 border border-blue-200 rounded-full text-sm font-medium flex items-center">
//                 🥛 Dairy Free
//               </span>
//             )}
//             {transformedProduct.tags && transformedProduct.tags.map((tag: string) => (
//               <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
//                 {tag}
//               </span>
//             ))}
//           </div>

//           {/* Size */}
//           {transformedProduct.size && (
//             <div className="flex items-center text-gray-600">
//               <span className="font-medium mr-2">Size:</span>
//               <span>{transformedProduct.size}</span>
//             </div>
//           )}

//           {/* Price Section */}
//           <div className="space-y-3">
//             <div className="flex items-center flex-wrap gap-4">
//               <div className="text-5xl font-bold text-pepe-primary">
//                 ₦{transformedProduct.price.toLocaleString()}
//               </div>
              
//               {hasDiscount && transformedProduct.oldPrice && (
//                 <>
//                   <div className="text-2xl font-bold text-gray-400 line-through">
//                     ₦{transformedProduct.oldPrice.toLocaleString()}
//                   </div>
//                   <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full font-bold text-lg">
//                     Save {discountPercentage}%
//                   </div>
//                 </>
//               )}
//             </div>
            
//             {/* Retail & Wholesale Prices */}
//             {(transformedProduct.retailPrice || transformedProduct.wholesalePrice) && (
//               <div className="space-y-2">
//                 {transformedProduct.retailPrice && transformedProduct.retailPrice !== transformedProduct.price && (
//                   <div className="text-sm text-gray-600">
//                     <CurrencyDollarIcon className="w-4 h-4 inline mr-2" />
//                     Retail: ₦{transformedProduct.retailPrice.toLocaleString()}
//                   </div>
//                 )}
                
//                 {transformedProduct.wholesaleEnabled && transformedProduct.wholesalePrice && (
//                   <div className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">
//                     <BuildingStorefrontIcon className="w-4 h-4 inline mr-2" />
//                     Wholesale Price: ₦{transformedProduct.wholesalePrice.toLocaleString()}
//                     <span className="text-xs text-gray-500 ml-2">(Contact for bulk orders)</span>
//                   </div>
//                 )}
//               </div>
//             )}
            
//             {/* Pricing Tier */}
//             {transformedProduct.pricingTier && transformedProduct.pricingTier !== 'Standard' && (
//               <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
//                 <ChartBarIcon className="w-4 h-4 inline mr-2" />
//                 Pricing Tier: {transformedProduct.pricingTier}
//               </div>
//             )}
            
//             {/* MOQ Notice */}
//             {transformedProduct.moq > 1 && (
//               <div className="text-sm text-gray-600 bg-yellow-50 px-4 py-2 rounded-lg">
//                 <CurrencyDollarIcon className="w-4 h-4 inline mr-2" />
//                 Minimum order quantity: {transformedProduct.moq} items
//               </div>
//             )}
//           </div>

//           {/* Stock Status */}
//           <div className={`px-4 py-3 rounded-lg ${
//             transformedProduct.stock === 0 
//               ? 'bg-red-50 text-red-800 border border-red-200' 
//               : 'bg-green-50 text-green-800 border border-green-200'
//           }`}>
//             <div className="flex items-center justify-between">
//               <span className="font-medium">
//                 {transformedProduct.stock === 0 
//                   ? 'Out of Stock' 
//                   : `${transformedProduct.stock} units available`
//                 }
//               </span>
//               <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                 transformedProduct.stock === 0 
//                   ? 'bg-red-100 text-red-700' 
//                   : 'bg-green-100 text-green-700'
//               }`}>
//                 {transformedProduct.status}
//               </span>
//             </div>
//           </div>

//           {/* Description */}
//           <div className="pt-6 border-t border-gray-200">
//             <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
//             <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
//               {transformedProduct.description}
//             </p>
//           </div>

//           {/* Specifications */}
//           {transformedProduct.specifications && Object.keys(transformedProduct.specifications).length > 0 && (
//             <div className="pt-6 border-t border-gray-200">
//               <h3 className="text-xl font-bold text-gray-900 mb-4">Specifications</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {Object.entries(transformedProduct.specifications).map(([key, value]) => (
//                   <div key={key} className="flex items-center p-3 bg-gray-50 rounded-lg">
//                     <span className="font-medium text-gray-700 capitalize">{key}:</span>
//                     <span className="ml-2 text-gray-600">{value}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Weight & Dimensions */}
//           {(transformedProduct.weight || transformedProduct.dimensions) && (
//             <div className="pt-6 border-t border-gray-200">
//               <h3 className="text-xl font-bold text-gray-900 mb-4">Physical Details</h3>
//               <div className="flex flex-wrap gap-6">
//                 {transformedProduct.weight && (
//                   <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
//                     <ScaleIcon className="w-5 h-5 mr-3 text-pepe-primary" />
//                     <div>
//                       <p className="text-sm text-gray-500">Weight</p>
//                       <p className="font-semibold text-gray-900">{transformedProduct.weight} kg</p>
//                     </div>
//                   </div>
//                 )}
                
//                 {transformedProduct.dimensions && (
//                   <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
//                     <CubeIcon className="w-5 h-5 mr-3 text-pepe-primary" />
//                     <div>
//                       <p className="text-sm text-gray-500">Dimensions</p>
//                       <p className="font-semibold text-gray-900">
//                         {transformedProduct.dimensions.length} × {transformedProduct.dimensions.width} × {transformedProduct.dimensions.height} cm
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Quantity Selector */}
//           <div className="pt-6 border-t border-gray-200">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-xl font-bold text-gray-900">Quantity</h3>
//               {transformedProduct.moq > 1 && (
//                 <span className="text-sm text-gray-500">Min: {transformedProduct.moq}</span>
//               )}
//             </div>
//             <div className="flex items-center space-x-6">
//               <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
//                 <button
//                   onClick={() => setQuantity(prev => Math.max(transformedProduct.moq, prev - 1))}
//                   className="px-5 py-4 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={quantity <= transformedProduct.moq}
//                 >
//                   -
//                 </button>
//                 <span className="px-6 py-4 text-xl font-bold min-w-[80px] text-center bg-gray-50">
//                   {quantity}
//                 </span>
//                 <button
//                   onClick={() => setQuantity(prev => prev + 1)}
//                   className="px-5 py-4 text-gray-600 hover:bg-gray-100"
//                 >
//                   +
//                 </button>
//               </div>
//               <div className="text-xl font-bold text-gray-900">
//                 Total: ₦{(transformedProduct.price * quantity).toLocaleString()}
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="pt-6 border-t border-gray-200 space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <button
//                 onClick={handleAddToCart}
//                 disabled={transformedProduct.stock === 0}
//                 className={`flex items-center justify-center py-4 px-6 rounded-xl font-bold text-lg transition-all ${
//                   transformedProduct.stock === 0
//                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                     : 'bg-white border-2 border-pepe-primary text-pepe-primary hover:bg-pepe-primary hover:text-white hover:shadow-lg'
//                 }`}
//               >
//                 <ShoppingCartIcon className="w-6 h-6 mr-3" />
//                 {transformedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
//               </button>
              
//               <button
//                 onClick={handleBuyNow}
//                 disabled={transformedProduct.stock === 0}
//                 className={`py-4 px-6 rounded-xl font-bold text-lg transition-all ${
//                   transformedProduct.stock === 0
//                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                     : 'bg-gradient-to-r from-pepe-primary to-pink-500 text-white hover:shadow-xl hover:scale-[1.02]'
//                 }`}
//               >
//                 Order Now
//               </button>
//             </div>

//             {/* Share Button */}
//             <button
//               onClick={handleShare}
//               className="flex items-center justify-center w-full py-4 text-gray-600 hover:text-pepe-primary transition-colors border border-gray-200 rounded-xl hover:border-pepe-primary/20 hover:bg-pepe-primary/5"
//             >
//               <ShareIcon className="w-5 h-5 mr-2" />
//               Share this product
//             </button>
//           </div>

//           {/* Product Meta */}
//           <div className="pt-6 border-t border-gray-200 text-sm text-gray-500">
//             <div className="flex flex-wrap items-center gap-4">
//               <span>Product ID: {transformedProduct.id}</span>
//               {product.createdAt && (
//                 <span>Added: {new Date(product.createdAt).toLocaleDateString()}</span>
//               )}
//               {product.updatedAt && (
//                 <span>Updated: {new Date(product.updatedAt).toLocaleDateString()}</span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Related Products */}
//       {transformedProduct.categoryId && (
//         <div className="mt-20 pt-12 border-t border-gray-200">
//           <RelatedProducts 
//             categoryId={transformedProduct.categoryId}
//             currentProductId={transformedProduct.id}
//           />
//         </div>
//       )}
//     </div>
//   )
// }
































// // // components/products/ProductDetails.tsx
// // 'use client'

// // import { useState } from 'react'
// // import { 
// //   StarIcon, 
// //   ClockIcon, 
// //   HeartIcon, 
// //   ShoppingCartIcon,
// //   ArrowLeftIcon,
// //   ShareIcon,
// //   TagIcon,
// //   CheckCircleIcon,
// //   CubeIcon,
// //   ScaleIcon,
// //   CurrencyDollarIcon,
// //   SparklesIcon,
// //   ShieldCheckIcon,
// //   BuildingStorefrontIcon,
// //   ChartBarIcon
// // } from '@heroicons/react/24/outline'
// // import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid'
// // import { useCart } from '@/lib/hooks/useCart'
// // import { useToast } from '@/components/providers/ToastProvider'
// // import RelatedProducts from './RelatedProducts'

// // interface BackendProduct {
// //   _id: string
// //   name: string
// //   description: string
// //   price: number
// //   oldPrice?: number
// //   retailPrice?: number
// //   wholesalePrice?: number
// //   moq: number
// //   pricingTier: string
// //   stock: number
// //   rating: number
// //   brand: string
// //   discount?: number
// //   size?: string
// //   images: { url: string; public_id: string }[]
// //   banners?: { url: string; title?: string }[]
// //   bannerTitle?: string
// //   category: { _id: string; name: string }
// //   subCategory?: { _id: string; name: string }
// //   thirdCategory?: { _id: string; name: string }
// //   featured: boolean
// //   wholesaleEnabled: boolean
// //   status: string
// //   sku?: string
// //   tags?: string[]
// //   specifications?: Record<string, string>
// //   weight?: number
// //   dimensions?: {
// //     length: number
// //     width: number
// //     height: number
// //   }
// //   createdBy?: string
// //   createdAt: string
// //   updatedAt: string
// // }

// // interface ProductDetailsProps {
// //   product: BackendProduct
// // }

// // export default function ProductDetails({ product }: ProductDetailsProps) {
// //   const [selectedImageIndex, setSelectedImageIndex] = useState(0)
// //   const [quantity, setQuantity] = useState(product.moq || 1)
// //   const [isFavorite, setIsFavorite] = useState(false)
// //   const { addToCart } = useCart()
// //   const { showToast } = useToast()

// //   // Transform product data
// //   const transformProduct = (product: BackendProduct) => ({
// //     id: product._id,
// //     name: product.name,
// //     description: product.description,
// //     price: product.price,
// //     oldPrice: product.oldPrice,
// //     retailPrice: product.retailPrice,
// //     wholesalePrice: product.wholesalePrice,
// //     moq: product.moq || 1,
// //     pricingTier: product.pricingTier || 'Standard',
// //     stock: product.stock || 0,
// //     rating: product.rating || 0,
// //     brand: product.brand,
// //     discount: product.discount || 0,
// //     size: product.size,
// //     image: product.images?.[0]?.url || '/images/placeholder-food.jpg',
// //     images: product.images || [],
// //     banners: product.banners || [],
// //     bannerTitle: product.bannerTitle,
// //     category: product.category?.name || 'Uncategorized',
// //     categoryId: product.category?._id,
// //     subCategory: product.subCategory?.name,
// //     thirdCategory: product.thirdCategory?.name,
// //     isPopular: product.featured,
// //     isFeatured: product.featured,
// //     isVegetarian: product.tags?.includes('vegetarian') || false,
// //     isVegan: product.tags?.includes('vegan') || false,
// //     isGlutenFree: product.tags?.includes('gluten-free') || false,
// //     isDairyFree: product.tags?.includes('dairy-free') || false,
// //     preparationTime: 15, // Default value, you might want to add this to your model
// //     status: product.status || 'Active',
// //     sku: product.sku,
// //     tags: product.tags || [],
// //     specifications: product.specifications || {},
// //     weight: product.weight,
// //     dimensions: product.dimensions,
// //     wholesaleEnabled: product.wholesaleEnabled || false,
// //   })

// //   const transformedProduct = transformProduct(product)

// //   const handleAddToCart = () => {
// //     // Check if product is in stock
// //     if (transformedProduct.stock === 0) {
// //       showToast(`${transformedProduct.name} is out of stock!`, 'error')
// //       return
// //     }
    
// //     // Check if quantity meets MOQ
// //     if (quantity < transformedProduct.moq) {
// //       showToast(`Minimum order quantity is ${transformedProduct.moq}`, 'error')
// //       return
// //     }
    
// //     addToCart({
// //       id: transformedProduct.id,
// //       name: transformedProduct.name,
// //       price: transformedProduct.price,
// //       image: transformedProduct.image,
// //       quantity: quantity
// //     })
    
// //     showToast(`${transformedProduct.name} added to cart!`, 'success')
// //   }

// //   const handleBuyNow = () => {
// //     handleAddToCart()
// //     // Navigate to checkout - implement this if needed
// //     // router.push('/checkout')
// //   }

// //   const handleShare = () => {
// //     if (navigator.share) {
// //       navigator.share({
// //         title: product.name,
// //         text: product.description,
// //         url: window.location.href,
// //       })
// //     } else {
// //       navigator.clipboard.writeText(window.location.href)
// //       showToast('Link copied to clipboard!', 'success')
// //     }
// //   }

// //   // Calculate discount percentage
// //   const hasDiscount = transformedProduct.oldPrice && transformedProduct.oldPrice > transformedProduct.price
// //   const discountPercentage = hasDiscount 
// //     ? Math.round(((transformedProduct.oldPrice! - transformedProduct.price) / transformedProduct.oldPrice!) * 100)
// //     : transformedProduct.discount

// //   // Get product images for gallery
// //   const productImages = transformedProduct.images.map(img => img.url)
// //   const allImages = productImages.length > 0 ? productImages : [transformedProduct.image]

// //   return (
// //     <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
// //       {/* Back Button */}
// //       <button
// //         onClick={() => window.history.back()}
// //         className="flex items-center text-gray-600 hover:text-pepe-primary mb-8 transition-colors"
// //       >
// //         <ArrowLeftIcon className="w-5 h-5 mr-2" />
// //         Back to Menu
// //       </button>

// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
// //         {/* Product Images */}
// //         <div className="space-y-6">
// //           {/* Main Image */}
// //           <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
// //             <img
// //               src={allImages[selectedImageIndex]}
// //               alt={transformedProduct.name}
// //               className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
// //               onError={(e) => {
// //                 e.currentTarget.src = '/images/placeholder-food.jpg'
// //               }}
// //             />
            
// //             {/* Badges */}
// //             <div className="absolute top-4 left-4 flex flex-col gap-2">
// //               {transformedProduct.isPopular && (
// //                 <div className="bg-gradient-to-r from-pepe-primary to-pink-500 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center shadow-lg">
// //                   <SparklesIcon className="w-4 h-4 mr-2" />
// //                   Popular
// //                 </div>
// //               )}
              
// //               {transformedProduct.stock === 0 ? (
// //                 <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
// //                   Out of Stock
// //                 </div>
// //               ) : (
// //                 <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
// //                   In Stock ({transformedProduct.stock})
// //                 </div>
// //               )}
              
// //               {discountPercentage > 0 && (
// //                 <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
// //                   {discountPercentage}% OFF
// //                 </div>
// //               )}
              
// //               {transformedProduct.isFeatured && (
// //                 <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg flex items-center">
// //                   <StarSolid className="w-4 h-4 mr-2" />
// //                   Featured
// //                 </div>
// //               )}
              
// //               {transformedProduct.wholesaleEnabled && (
// //                 <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg flex items-center">
// //                   <BuildingStorefrontIcon className="w-4 h-4 mr-2" />
// //                   Wholesale Available
// //                 </div>
// //               )}
// //             </div>
            
// //             {/* Favorite Button */}
// //             <button
// //               onClick={() => setIsFavorite(!isFavorite)}
// //               className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg hover:scale-110"
// //               aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
// //             >
// //               {isFavorite ? (
// //                 <HeartSolid className="w-6 h-6 fill-red-500 text-red-500" />
// //               ) : (
// //                 <HeartIcon className="w-6 h-6 text-gray-700" />
// //               )}
// //             </button>
// //           </div>

// //           {/* Thumbnail Images */}
// //           {allImages.length > 1 && (
// //             <div className="flex space-x-4 overflow-x-auto pb-4">
// //               {allImages.map((image, index) => (
// //                 <button
// //                   key={index}
// //                   onClick={() => setSelectedImageIndex(index)}
// //                   className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
// //                     selectedImageIndex === index
// //                       ? 'border-pepe-primary ring-2 ring-pepe-primary/20 ring-offset-2 scale-105'
// //                       : 'border-gray-200 hover:border-gray-300 hover:scale-105'
// //                   }`}
// //                 >
// //                   <img
// //                     src={image}
// //                     alt={`${transformedProduct.name} - view ${index + 1}`}
// //                     className="w-full h-full object-cover"
// //                     onError={(e) => {
// //                       e.currentTarget.src = '/images/placeholder-food.jpg'
// //                     }}
// //                   />
// //                 </button>
// //               ))}
// //             </div>
// //           )}

// //           {/* Banners if available */}
// //           {transformedProduct.banners && transformedProduct.banners.length > 0 && (
// //             <div className="mt-8">
// //               <h3 className="text-lg font-semibold mb-4 text-gray-900">
// //                 {transformedProduct.bannerTitle || 'Special Offers'}
// //               </h3>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 {transformedProduct.banners.map((banner, index) => (
// //                   <div key={index} className="relative rounded-xl overflow-hidden h-32">
// //                     <img
// //                       src={banner.url}
// //                       alt={banner.title || 'Special Offer'}
// //                       className="w-full h-full object-cover"
// //                     />
// //                     {banner.title && (
// //                       <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
// //                         <p className="text-white font-medium">{banner.title}</p>
// //                       </div>
// //                     )}
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         {/* Product Info */}
// //         <div className="space-y-8">
// //           {/* Category Hierarchy */}
// //           <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
// //             <span>{transformedProduct.category}</span>
// //             {transformedProduct.subCategory && (
// //               <>
// //                 <span>/</span>
// //                 <span>{transformedProduct.subCategory}</span>
// //               </>
// //             )}
// //             {transformedProduct.thirdCategory && (
// //               <>
// //                 <span>/</span>
// //                 <span>{transformedProduct.thirdCategory}</span>
// //               </>
// //             )}
// //           </div>

// //           {/* Product Name */}
// //           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
// //             {transformedProduct.name}
// //           </h1>

// //           {/* Brand & Rating & SKU */}
// //           <div className="flex flex-wrap items-center gap-6">
// //             <div className="flex items-center">
// //               <div className="flex">
// //                 {[...Array(5)].map((_, i) => (
// //                   <StarIcon
// //                     key={i}
// //                     className={`w-5 h-5 ${
// //                       i < Math.floor(transformedProduct.rating)
// //                         ? 'text-yellow-400 fill-yellow-400'
// //                         : 'text-gray-300'
// //                     }`}
// //                   />
// //                 ))}
// //               </div>
// //               <span className="ml-3 text-gray-700 font-semibold">{transformedProduct.rating.toFixed(1)}</span>
// //             </div>
            
// //             <div className="flex items-center text-gray-600">
// //               <ShieldCheckIcon className="w-5 h-5 mr-2" />
// //               <span className="font-medium">{transformedProduct.brand}</span>
// //             </div>
            
// //             {transformedProduct.sku && (
// //               <div className="flex items-center text-gray-500 text-sm">
// //                 <TagIcon className="w-4 h-4 mr-2" />
// //                 SKU: {transformedProduct.sku}
// //               </div>
// //             )}
// //           </div>

// //           {/* Dietary Badges */}
// //           <div className="flex flex-wrap items-center gap-3">
// //             {transformedProduct.isVegetarian && (
// //               <span className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-100 text-green-800 border border-green-200 rounded-full text-sm font-medium flex items-center">
// //                 <CheckCircleIcon className="w-4 h-4 mr-2" />
// //                 Vegetarian
// //               </span>
// //             )}
// //             {transformedProduct.isVegan && (
// //               <span className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-100 text-emerald-800 border border-emerald-200 rounded-full text-sm font-medium flex items-center">
// //                 🌱 Vegan
// //               </span>
// //             )}
// //             {transformedProduct.isGlutenFree && (
// //               <span className="px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-100 text-amber-800 border border-amber-200 rounded-full text-sm font-medium flex items-center">
// //                 🌾 Gluten Free
// //               </span>
// //             )}
// //             {transformedProduct.isDairyFree && (
// //               <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-100 text-blue-800 border border-blue-200 rounded-full text-sm font-medium flex items-center">
// //                 🥛 Dairy Free
// //               </span>
// //             )}
// //             {transformedProduct.tags && transformedProduct.tags.map((tag: string) => (
// //               <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
// //                 {tag}
// //               </span>
// //             ))}
// //           </div>

// //           {/* Size */}
// //           {transformedProduct.size && (
// //             <div className="flex items-center text-gray-600">
// //               <span className="font-medium mr-2">Size:</span>
// //               <span>{transformedProduct.size}</span>
// //             </div>
// //           )}

// //           {/* Price Section */}
// //           <div className="space-y-3">
// //             <div className="flex items-center flex-wrap gap-4">
// //               <div className="text-5xl font-bold text-pepe-primary">
// //                 ₦{transformedProduct.price.toLocaleString()}
// //               </div>
              
// //               {hasDiscount && transformedProduct.oldPrice && (
// //                 <>
// //                   <div className="text-2xl font-bold text-gray-400 line-through">
// //                     ₦{transformedProduct.oldPrice.toLocaleString()}
// //                   </div>
// //                   <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full font-bold text-lg">
// //                     Save {discountPercentage}%
// //                   </div>
// //                 </>
// //               )}
// //             </div>
            
// //             {/* Retail & Wholesale Prices */}
// //             {(transformedProduct.retailPrice || transformedProduct.wholesalePrice) && (
// //               <div className="space-y-2">
// //                 {transformedProduct.retailPrice && transformedProduct.retailPrice !== transformedProduct.price && (
// //                   <div className="text-sm text-gray-600">
// //                     <CurrencyDollarIcon className="w-4 h-4 inline mr-2" />
// //                     Retail: ₦{transformedProduct.retailPrice.toLocaleString()}
// //                   </div>
// //                 )}
                
// //                 {transformedProduct.wholesaleEnabled && transformedProduct.wholesalePrice && (
// //                   <div className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">
// //                     <BuildingStorefrontIcon className="w-4 h-4 inline mr-2" />
// //                     Wholesale Price: ₦{transformedProduct.wholesalePrice.toLocaleString()}
// //                     <span className="text-xs text-gray-500 ml-2">(Contact for bulk orders)</span>
// //                   </div>
// //                 )}
// //               </div>
// //             )}
            
// //             {/* Pricing Tier */}
// //             {transformedProduct.pricingTier && transformedProduct.pricingTier !== 'Standard' && (
// //               <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
// //                 <ChartBarIcon className="w-4 h-4 inline mr-2" />
// //                 Pricing Tier: {transformedProduct.pricingTier}
// //               </div>
// //             )}
            
// //             {/* MOQ Notice */}
// //             {transformedProduct.moq > 1 && (
// //               <div className="text-sm text-gray-600 bg-yellow-50 px-4 py-2 rounded-lg">
// //                 <CurrencyDollarIcon className="w-4 h-4 inline mr-2" />
// //                 Minimum order quantity: {transformedProduct.moq} items
// //               </div>
// //             )}
// //           </div>

// //           {/* Stock Status */}
// //           <div className={`px-4 py-3 rounded-lg ${
// //             transformedProduct.stock === 0 
// //               ? 'bg-red-50 text-red-800 border border-red-200' 
// //               : 'bg-green-50 text-green-800 border border-green-200'
// //           }`}>
// //             <div className="flex items-center justify-between">
// //               <span className="font-medium">
// //                 {transformedProduct.stock === 0 
// //                   ? 'Out of Stock' 
// //                   : `${transformedProduct.stock} units available`
// //                 }
// //               </span>
// //               <span className={`px-2 py-1 rounded-full text-xs font-medium ${
// //                 transformedProduct.stock === 0 
// //                   ? 'bg-red-100 text-red-700' 
// //                   : 'bg-green-100 text-green-700'
// //               }`}>
// //                 {transformedProduct.status}
// //               </span>
// //             </div>
// //           </div>

// //           {/* Description */}
// //           <div className="pt-6 border-t border-gray-200">
// //             <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
// //             <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
// //               {transformedProduct.description}
// //             </p>
// //           </div>

// //           {/* Specifications */}
// //           {transformedProduct.specifications && Object.keys(transformedProduct.specifications).length > 0 && (
// //             <div className="pt-6 border-t border-gray-200">
// //               <h3 className="text-xl font-bold text-gray-900 mb-4">Specifications</h3>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 {Object.entries(transformedProduct.specifications).map(([key, value]) => (
// //                   <div key={key} className="flex items-center p-3 bg-gray-50 rounded-lg">
// //                     <span className="font-medium text-gray-700 capitalize">{key}:</span>
// //                     <span className="ml-2 text-gray-600">{value}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}

// //           {/* Weight & Dimensions */}
// //           {(transformedProduct.weight || transformedProduct.dimensions) && (
// //             <div className="pt-6 border-t border-gray-200">
// //               <h3 className="text-xl font-bold text-gray-900 mb-4">Physical Details</h3>
// //               <div className="flex flex-wrap gap-6">
// //                 {transformedProduct.weight && (
// //                   <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
// //                     <ScaleIcon className="w-5 h-5 mr-3 text-pepe-primary" />
// //                     <div>
// //                       <p className="text-sm text-gray-500">Weight</p>
// //                       <p className="font-semibold text-gray-900">{transformedProduct.weight} kg</p>
// //                     </div>
// //                   </div>
// //                 )}
                
// //                 {transformedProduct.dimensions && (
// //                   <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
// //                     <CubeIcon className="w-5 h-5 mr-3 text-pepe-primary" />
// //                     <div>
// //                       <p className="text-sm text-gray-500">Dimensions</p>
// //                       <p className="font-semibold text-gray-900">
// //                         {transformedProduct.dimensions.length} × {transformedProduct.dimensions.width} × {transformedProduct.dimensions.height} cm
// //                       </p>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {/* Quantity Selector */}
// //           <div className="pt-6 border-t border-gray-200">
// //             <div className="flex items-center justify-between mb-6">
// //               <h3 className="text-xl font-bold text-gray-900">Quantity</h3>
// //               {transformedProduct.moq > 1 && (
// //                 <span className="text-sm text-gray-500">Min: {transformedProduct.moq}</span>
// //               )}
// //             </div>
// //             <div className="flex items-center space-x-6">
// //               <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
// //                 <button
// //                   onClick={() => setQuantity(prev => Math.max(transformedProduct.moq, prev - 1))}
// //                   className="px-5 py-4 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
// //                   disabled={quantity <= transformedProduct.moq}
// //                 >
// //                   -
// //                 </button>
// //                 <span className="px-6 py-4 text-xl font-bold min-w-[80px] text-center bg-gray-50">
// //                   {quantity}
// //                 </span>
// //                 <button
// //                   onClick={() => setQuantity(prev => prev + 1)}
// //                   className="px-5 py-4 text-gray-600 hover:bg-gray-100"
// //                 >
// //                   +
// //                 </button>
// //               </div>
// //               <div className="text-xl font-bold text-gray-900">
// //                 Total: ₦{(transformedProduct.price * quantity).toLocaleString()}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Action Buttons */}
// //           <div className="pt-6 border-t border-gray-200 space-y-6">
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <button
// //                 onClick={handleAddToCart}
// //                 disabled={transformedProduct.stock === 0}
// //                 className={`flex items-center justify-center py-4 px-6 rounded-xl font-bold text-lg transition-all ${
// //                   transformedProduct.stock === 0
// //                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
// //                     : 'bg-white border-2 border-pepe-primary text-pepe-primary hover:bg-pepe-primary hover:text-white hover:shadow-lg'
// //                 }`}
// //               >
// //                 <ShoppingCartIcon className="w-6 h-6 mr-3" />
// //                 {transformedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
// //               </button>
              
// //               <button
// //                 onClick={handleBuyNow}
// //                 disabled={transformedProduct.stock === 0}
// //                 className={`py-4 px-6 rounded-xl font-bold text-lg transition-all ${
// //                   transformedProduct.stock === 0
// //                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
// //                     : 'bg-gradient-to-r from-pepe-primary to-pink-500 text-white hover:shadow-xl hover:scale-[1.02]'
// //                 }`}
// //               >
// //                 Order Now
// //               </button>
// //             </div>

// //             {/* Share Button */}
// //             <button
// //               onClick={handleShare}
// //               className="flex items-center justify-center w-full py-4 text-gray-600 hover:text-pepe-primary transition-colors border border-gray-200 rounded-xl hover:border-pepe-primary/20 hover:bg-pepe-primary/5"
// //             >
// //               <ShareIcon className="w-5 h-5 mr-2" />
// //               Share this product
// //             </button>
// //           </div>

// //           {/* Product Meta */}
// //           <div className="pt-6 border-t border-gray-200 text-sm text-gray-500">
// //             <div className="flex flex-wrap items-center gap-4">
// //               <span>Product ID: {transformedProduct.id}</span>
// //               {product.createdAt && (
// //                 <span>Added: {new Date(product.createdAt).toLocaleDateString()}</span>
// //               )}
// //               {product.updatedAt && (
// //                 <span>Updated: {new Date(product.updatedAt).toLocaleDateString()}</span>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Related Products */}
// //       {transformedProduct.categoryId && (
// //         <div className="mt-20 pt-12 border-t border-gray-200">
// //           <RelatedProducts 
// //             categoryId={transformedProduct.categoryId}
// //             currentProductId={transformedProduct.id}
// //           />
// //         </div>
// //       )}
// //     </div>
// //   )
// // }



















































// // // components/products/ProductDetails.tsx
// // 'use client'

// // import { useState, useEffect } from 'react'
// // import { 
// //   StarIcon, 
// //   ClockIcon, 
// //   HeartIcon, 
// //   ShoppingCartIcon,
// //   ArrowLeftIcon,
// //   ShareIcon,
// //   TagIcon,
// //   CheckCircleIcon,
// //   CubeIcon,
// //   ScaleIcon,
// //   CurrencyDollarIcon,
// //   SparklesIcon,
// //   ShieldCheckIcon
// // } from '@heroicons/react/24/outline'
// // import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid'
// // import { useCart } from '@/lib/context/CartContext'
// // import { productService } from '@/lib/services/api'
// // import { transformProduct, type BackendProduct } from '@/lib/utils/transformers'
// // import toast from 'react-hot-toast'
// // import RelatedProducts from './RelatedProducts'

// // interface ProductDetailsProps {
// //   productId: string
// // }

// // export default function ProductDetails({ productId }: ProductDetailsProps) {
// //   const [selectedImage, setSelectedImage] = useState(0)
// //   const [quantity, setQuantity] = useState(1)
// //   const [isFavorite, setIsFavorite] = useState(false)
// //   const [product, setProduct] = useState<BackendProduct | null>(null)
// //   const [loading, setLoading] = useState(true)
// //   const { addToCart } = useCart()

// //   useEffect(() => {
// //     loadProduct()
// //   }, [productId])

// //   const loadProduct = async () => {
// //     try {
// //       setLoading(true)
// //       const response = await productService.getProduct(productId)
      
// //       if (response.success) {
// //         setProduct(response.data)
// //       } else {
// //         toast.error(response.message || 'Failed to load product')
// //       }
// //     } catch (error) {
// //       console.error('Failed to load product:', error)
// //       toast.error('Failed to load product details')
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const handleAddToCart = () => {
// //     if (!product) return
    
// //     const transformedProduct = transformProduct(product)
    
// //     // Check if product is in stock
// //     if (transformedProduct.stock === 0) {
// //       toast.error('This product is out of stock!')
// //       return
// //     }
    
// //     // Check if quantity meets MOQ
// //     if (quantity < transformedProduct.moq) {
// //       toast.error(`Minimum order quantity is ${transformedProduct.moq}`)
// //       return
// //     }
    
// //     addToCart({
// //       id: transformedProduct.id,
// //       name: transformedProduct.name,
// //       price: transformedProduct.price,
// //       image: transformedProduct.image,
// //     })
    
// //     toast.success(`${transformedProduct.name} added to cart!`)
// //   }

// //   const handleBuyNow = () => {
// //     handleAddToCart()
// //     // Navigate to checkout
// //     // router.push('/checkout')
// //   }

// //   const handleShare = () => {
// //     if (navigator.share) {
// //       navigator.share({
// //         title: product?.name,
// //         text: product?.description,
// //         url: window.location.href,
// //       })
// //     } else {
// //       navigator.clipboard.writeText(window.location.href)
// //       toast.success('Link copied to clipboard!')
// //     }
// //   }

// //   if (loading) {
// //     return (
// //       <div className="max-w-6xl mx-auto py-12">
// //         <div className="animate-pulse space-y-12">
// //           <div className="h-4 w-24 bg-gray-200 rounded"></div>
// //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
// //             <div className="space-y-4">
// //               <div className="aspect-square bg-gray-200 rounded-2xl"></div>
// //               <div className="flex space-x-4">
// //                 {[...Array(4)].map((_, i) => (
// //                   <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
// //                 ))}
// //               </div>
// //             </div>
// //             <div className="space-y-6">
// //               <div className="h-4 w-32 bg-gray-200 rounded"></div>
// //               <div className="h-8 w-64 bg-gray-200 rounded"></div>
// //               <div className="h-4 w-48 bg-gray-200 rounded"></div>
// //               <div className="h-6 w-32 bg-gray-200 rounded"></div>
// //               <div className="space-y-4">
// //                 <div className="h-4 bg-gray-200 rounded"></div>
// //                 <div className="h-4 bg-gray-200 rounded"></div>
// //                 <div className="h-4 bg-gray-200 rounded w-3/4"></div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     )
// //   }

// //   if (!product) {
// //     return (
// //       <div className="max-w-6xl mx-auto py-24 text-center">
// //         <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
// //           <span className="text-4xl">❓</span>
// //         </div>
// //         <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
// //         <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
// //         <button
// //           onClick={() => window.history.back()}
// //           className="inline-flex items-center px-6 py-3 bg-pepe-primary text-white rounded-xl font-medium hover:bg-pink-500"
// //         >
// //           <ArrowLeftIcon className="w-5 h-5 mr-2" />
// //           Back to Menu
// //         </button>
// //       </div>
// //     )
// //   }

// //   const transformedProduct = transformProduct(product)

// //   // Calculate if product is on discount
// //   const hasDiscount = transformedProduct.oldPrice && transformedProduct.oldPrice > transformedProduct.price
// //   const discountPercentage = hasDiscount 
// //     ? Math.round(((transformedProduct.oldPrice! - transformedProduct.price) / transformedProduct.oldPrice!) * 100)
// //     : transformedProduct.discount

// //   return (
// //     <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
// //       {/* Back Button */}
// //       <button
// //         onClick={() => window.history.back()}
// //         className="flex items-center text-gray-600 hover:text-pepe-primary mb-8 transition-colors"
// //       >
// //         <ArrowLeftIcon className="w-5 h-5 mr-2" />
// //         Back to Menu
// //       </button>

// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
// //         {/* Product Images */}
// //         <div className="space-y-6">
// //           {/* Main Image */}
// //           <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
// //             <img
// //               src={transformedProduct.image}
// //               alt={transformedProduct.name}
// //               className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
// //               onError={(e) => {
// //                 e.currentTarget.src = '/images/placeholder-food.jpg'
// //               }}
// //             />
            
// //             {/* Badges */}
// //             <div className="absolute top-4 left-4 flex flex-col gap-2">
// //               {transformedProduct.isPopular && (
// //                 <div className="bg-gradient-to-r from-pepe-primary to-pink-500 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center shadow-lg">
// //                   <SparklesIcon className="w-4 h-4 mr-2" />
// //                   Popular
// //                 </div>
// //               )}
              
// //               {transformedProduct.stock === 0 ? (
// //                 <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
// //                   Out of Stock
// //                 </div>
// //               ) : (
// //                 <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
// //                   In Stock ({transformedProduct.stock})
// //                 </div>
// //               )}
              
// //               {discountPercentage > 0 && (
// //                 <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
// //                   {discountPercentage}% OFF
// //                 </div>
// //               )}
              
// //               {transformedProduct.featured && (
// //                 <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg flex items-center">
// //                   <StarSolid className="w-4 h-4 mr-2" />
// //                   Featured
// //                 </div>
// //               )}
// //             </div>
            
// //             {/* Favorite Button */}
// //             <button
// //               onClick={() => setIsFavorite(!isFavorite)}
// //               className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg hover:scale-110"
// //               aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
// //             >
// //               {isFavorite ? (
// //                 <HeartSolid className="w-6 h-6 fill-red-500 text-red-500" />
// //               ) : (
// //                 <HeartIcon className="w-6 h-6 text-gray-700" />
// //               )}
// //             </button>
// //           </div>

// //           {/* Thumbnail Images */}
// //           {transformedProduct.images.length > 1 && (
// //             <div className="flex space-x-4 overflow-x-auto pb-4">
// //               {transformedProduct.images.map((image, index) => (
// //                 <button
// //                   key={index}
// //                   onClick={() => setSelectedImage(index)}
// //                   className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
// //                     selectedImage === index
// //                       ? 'border-pepe-primary ring-2 ring-pepe-primary/20 ring-offset-2 scale-105'
// //                       : 'border-gray-200 hover:border-gray-300 hover:scale-105'
// //                   }`}
// //                 >
// //                   <img
// //                     src={image.url}
// //                     alt={`${transformedProduct.name} - view ${index + 1}`}
// //                     className="w-full h-full object-cover"
// //                   />
// //                 </button>
// //               ))}
// //             </div>
// //           )}
// //         </div>

// //         {/* Product Info */}
// //         <div className="space-y-8">
// //           {/* Breadcrumb & Category */}
// //           <div className="flex flex-wrap items-center gap-3">
// //             <span className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-full text-sm font-medium">
// //               {transformedProduct.category}
// //             </span>
            
// //             {/* Dietary Badges */}
// //             {transformedProduct.isVegetarian && (
// //               <span className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-100 text-green-800 border border-green-200 rounded-full text-sm font-medium flex items-center">
// //                 <CheckCircleIcon className="w-4 h-4 mr-2" />
// //                 Vegetarian
// //               </span>
// //             )}
// //             {transformedProduct.isVegan && (
// //               <span className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-100 text-emerald-800 border border-emerald-200 rounded-full text-sm font-medium flex items-center">
// //                 🌱 Vegan
// //               </span>
// //             )}
// //             {transformedProduct.isGlutenFree && (
// //               <span className="px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-100 text-amber-800 border border-amber-200 rounded-full text-sm font-medium flex items-center">
// //                 🌾 Gluten Free
// //               </span>
// //             )}
// //             {transformedProduct.isDairyFree && (
// //               <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-100 text-blue-800 border border-blue-200 rounded-full text-sm font-medium flex items-center">
// //                 🥛 Dairy Free
// //               </span>
// //             )}
// //           </div>

// //           {/* Product Name */}
// //           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
// //             {transformedProduct.name}
// //           </h1>

// //           {/* Brand & Rating */}
// //           <div className="flex flex-wrap items-center gap-6">
// //             <div className="flex items-center">
// //               <div className="flex">
// //                 {[...Array(5)].map((_, i) => (
// //                   <StarIcon
// //                     key={i}
// //                     className={`w-5 h-5 ${
// //                       i < Math.floor(transformedProduct.rating)
// //                         ? 'text-yellow-400 fill-yellow-400'
// //                         : 'text-gray-300'
// //                     }`}
// //                   />
// //                 ))}
// //               </div>
// //               <span className="ml-3 text-gray-700 font-semibold">{transformedProduct.rating}</span>
// //               <span className="ml-2 text-gray-500 text-sm">({transformedProduct.reviewCount} reviews)</span>
// //             </div>
            
// //             <div className="flex items-center text-gray-600">
// //               <ShieldCheckIcon className="w-5 h-5 mr-2" />
// //               <span className="font-medium">{transformedProduct.brand}</span>
// //             </div>
            
// //             {transformedProduct.sku && (
// //               <div className="flex items-center text-gray-500 text-sm">
// //                 <TagIcon className="w-4 h-4 mr-2" />
// //                 SKU: {transformedProduct.sku}
// //               </div>
// //             )}
// //           </div>

// //           {/* Preparation Time */}
// //           {transformedProduct.preparationTime && (
// //             <div className="flex items-center text-gray-600 bg-gray-50 px-4 py-3 rounded-xl">
// //               <ClockIcon className="w-5 h-5 mr-3 text-pepe-primary" />
// //               <span className="font-medium">Ready in {transformedProduct.preparationTime} minutes</span>
// //             </div>
// //           )}

// //           {/* Price Section */}
// //           <div className="space-y-3">
// //             <div className="flex items-center flex-wrap gap-4">
// //               <div className="text-5xl font-bold text-pepe-primary">
// //                 ₦{transformedProduct.price.toLocaleString()}
// //               </div>
              
// //               {hasDiscount && (
// //                 <>
// //                   <div className="text-2xl font-bold text-gray-400 line-through">
// //                     ₦{transformedProduct.oldPrice!.toLocaleString()}
// //                   </div>
// //                   <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full font-bold text-lg">
// //                     Save {discountPercentage}%
// //                   </div>
// //                 </>
// //               )}
// //             </div>
            
// //             {/* MOQ Notice */}
// //             {transformedProduct.moq > 1 && (
// //               <div className="text-sm text-gray-600 bg-yellow-50 px-4 py-2 rounded-lg">
// //                 <CurrencyDollarIcon className="w-4 h-4 inline mr-2" />
// //                 Minimum order quantity: {transformedProduct.moq} items
// //               </div>
// //             )}
// //           </div>

// //           {/* Description */}
// //           <div className="pt-6 border-t border-gray-200">
// //             <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
// //             <p className="text-gray-600 leading-relaxed text-lg">
// //               {transformedProduct.description}
// //             </p>
// //           </div>

// //           {/* Specifications */}
// //           {transformedProduct.specifications && transformedProduct.specifications.size > 0 && (
// //             <div className="pt-6 border-t border-gray-200">
// //               <h3 className="text-xl font-bold text-gray-900 mb-4">Specifications</h3>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 {Array.from(transformedProduct.specifications.entries()).map(([key, value]) => (
// //                   <div key={key} className="flex items-center p-3 bg-gray-50 rounded-lg">
// //                     <span className="font-medium text-gray-700 capitalize">{key}:</span>
// //                     <span className="ml-2 text-gray-600">{value}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}

// //           {/* Weight & Dimensions */}
// //           {(transformedProduct.weight || transformedProduct.dimensions) && (
// //             <div className="pt-6 border-t border-gray-200">
// //               <h3 className="text-xl font-bold text-gray-900 mb-4">Physical Details</h3>
// //               <div className="flex flex-wrap gap-6">
// //                 {transformedProduct.weight && (
// //                   <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
// //                     <ScaleIcon className="w-5 h-5 mr-3 text-pepe-primary" />
// //                     <div>
// //                       <p className="text-sm text-gray-500">Weight</p>
// //                       <p className="font-semibold text-gray-900">{transformedProduct.weight} kg</p>
// //                     </div>
// //                   </div>
// //                 )}
                
// //                 {transformedProduct.dimensions && (
// //                   <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
// //                     <CubeIcon className="w-5 h-5 mr-3 text-pepe-primary" />
// //                     <div>
// //                       <p className="text-sm text-gray-500">Dimensions</p>
// //                       <p className="font-semibold text-gray-900">
// //                         {transformedProduct.dimensions.length} × {transformedProduct.dimensions.width} × {transformedProduct.dimensions.height} cm
// //                       </p>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {/* Quantity Selector */}
// //           <div className="pt-6 border-t border-gray-200">
// //             <div className="flex items-center justify-between mb-6">
// //               <h3 className="text-xl font-bold text-gray-900">Quantity</h3>
// //               {transformedProduct.moq > 1 && (
// //                 <span className="text-sm text-gray-500">Min: {transformedProduct.moq}</span>
// //               )}
// //             </div>
// //             <div className="flex items-center space-x-6">
// //               <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">
// //                 <button
// //                   onClick={() => setQuantity(prev => Math.max(transformedProduct.moq, prev - 1))}
// //                   className="px-5 py-4 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
// //                   disabled={quantity <= transformedProduct.moq}
// //                 >
// //                   -
// //                 </button>
// //                 <span className="px-6 py-4 text-xl font-bold min-w-[80px] text-center bg-gray-50">
// //                   {quantity}
// //                 </span>
// //                 <button
// //                   onClick={() => setQuantity(prev => prev + 1)}
// //                   className="px-5 py-4 text-gray-600 hover:bg-gray-100"
// //                 >
// //                   +
// //                 </button>
// //               </div>
// //               <div className="text-xl font-bold text-gray-900">
// //                 Total: ₦{(transformedProduct.price * quantity).toLocaleString()}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Action Buttons */}
// //           <div className="pt-6 border-t border-gray-200 space-y-6">
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <button
// //                 onClick={handleAddToCart}
// //                 disabled={transformedProduct.stock === 0}
// //                 className={`flex items-center justify-center py-4 px-6 rounded-xl font-bold text-lg transition-all ${
// //                   transformedProduct.stock === 0
// //                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
// //                     : 'bg-white border-2 border-pepe-primary text-pepe-primary hover:bg-pepe-primary hover:text-white hover:shadow-lg'
// //                 }`}
// //               >
// //                 <ShoppingCartIcon className="w-6 h-6 mr-3" />
// //                 {transformedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
// //               </button>
              
// //               <button
// //                 onClick={handleBuyNow}
// //                 disabled={transformedProduct.stock === 0}
// //                 className={`py-4 px-6 rounded-xl font-bold text-lg transition-all ${
// //                   transformedProduct.stock === 0
// //                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
// //                     : 'bg-gradient-to-r from-pepe-primary to-pink-500 text-white hover:shadow-xl hover:scale-[1.02]'
// //                 }`}
// //               >
// //                 Order Now
// //               </button>
// //             </div>

// //             {/* Share Button */}
// //             <button
// //               onClick={handleShare}
// //               className="flex items-center justify-center w-full py-4 text-gray-600 hover:text-pepe-primary transition-colors border border-gray-200 rounded-xl hover:border-pepe-primary/20 hover:bg-pepe-primary/5"
// //             >
// //               <ShareIcon className="w-5 h-5 mr-2" />
// //               Share this product
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Related Products */}
// //       {product.category && (
// //         <div className="mt-20 pt-12 border-t border-gray-200">
// //           <RelatedProducts 
// //             categoryId={product.category._id}
// //             currentProductId={product._id}
// //           />
// //         </div>
// //       )}
// //     </div>
// //   )
// // }




























// // // // Desktop/pepefinal/frontend/components/products/ProductDetails.tsx
// // // 'use client'

// // // import { useState } from 'react'
// // // import { 
// // //   StarIcon, 
// // //   ClockIcon, 
// // //   HeartIcon, 
// // //   ShoppingCartIcon,
// // //   ArrowLeftIcon,
// // //   ShareIcon
// // // } from '@heroicons/react/24/outline'
// // // import { useCart } from '@/lib/context/CartContext'

// // // interface ProductDetailsProps {
// // //   product: {
// // //     id: number
// // //     name: string
// // //     description: string
// // //     price: number
// // //     images: string[]
// // //     category: string
// // //     rating: number
// // //     reviewCount: number
// // //     isPopular: boolean
// // //     isVegetarian: boolean
// // //     isVegan: boolean
// // //     isGlutenFree: boolean
// // //     preparationTime: number
// // //   }
// // // }

// // // export default function ProductDetails({ product }: ProductDetailsProps) {
// // //   const [selectedImage, setSelectedImage] = useState(0)
// // //   const [quantity, setQuantity] = useState(1)
// // //   const [isFavorite, setIsFavorite] = useState(false)
// // //   const { addToCart } = useCart()

// // //   const handleAddToCart = () => {
// // //     addToCart({
// // //       id: product.id.toString(),
// // //       name: product.name,
// // //       price: product.price,
// // //       image: product.images[0],
// // //     })
// // //   }

// // //   const handleBuyNow = () => {
// // //     handleAddToCart()
// // //     // In a real app, navigate to checkout
// // //   }

// // //   return (
// // //     <div className="max-w-6xl mx-auto">
// // //       {/* Back Button */}
// // //       <button
// // //         onClick={() => window.history.back()}
// // //         className="flex items-center text-gray-600 hover:text-pepe-primary mb-6"
// // //       >
// // //         <ArrowLeftIcon className="w-5 h-5 mr-2" />
// // //         Back to Menu
// // //       </button>

// // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
// // //         {/* Product Images */}
// // //         <div className="space-y-4">
// // //           {/* Main Image */}
// // //           <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
// // //             <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
// // //               <span className="text-gray-500 text-lg">Product Image</span>
// // //             </div>
            
// // //             {/* Popular Badge */}
// // //             {product.isPopular && (
// // //               <div className="absolute top-4 left-4 bg-pepe-primary text-white px-4 py-2 rounded-full font-medium">
// // //                 Most Popular
// // //               </div>
// // //             )}
            
// // //             {/* Favorite Button */}
// // //             <button
// // //               onClick={() => setIsFavorite(!isFavorite)}
// // //               className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
// // //               aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
// // //             >
// // //               <HeartIcon className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
// // //             </button>
// // //           </div>

// // //           {/* Thumbnail Images */}
// // //           <div className="flex space-x-4 overflow-x-auto pb-4">
// // //             {product.images.map((image, index) => (
// // //               <button
// // //                 key={index}
// // //                 onClick={() => setSelectedImage(index)}
// // //                 className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
// // //                   selectedImage === index
// // //                     ? 'ring-2 ring-pepe-primary ring-offset-2'
// // //                     : 'opacity-70 hover:opacity-100'
// // //                 }`}
// // //               >
// // //                 <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
// // //               </button>
// // //             ))}
// // //           </div>
// // //         </div>

// // //         {/* Product Info */}
// // //         <div className="space-y-6">
// // //           {/* Category */}
// // //           <div className="flex items-center space-x-3">
// // //             <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
// // //               {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
// // //             </span>
            
// // //             {/* Dietary Badges */}
// // //             {product.isVegetarian && (
// // //               <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
// // //                 🌱 Vegetarian
// // //               </span>
// // //             )}
// // //             {product.isVegan && (
// // //               <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
// // //                 🌿 Vegan
// // //               </span>
// // //             )}
// // //             {product.isGlutenFree && (
// // //               <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
// // //                 🌾 Gluten Free
// // //               </span>
// // //             )}
// // //           </div>

// // //           {/* Product Name */}
// // //           <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>

// // //           {/* Rating and Reviews */}
// // //           <div className="flex items-center space-x-4">
// // //             <div className="flex items-center">
// // //               {[...Array(5)].map((_, i) => (
// // //                 <StarIcon
// // //                   key={i}
// // //                   className={`w-5 h-5 ${
// // //                     i < Math.floor(product.rating)
// // //                       ? 'text-yellow-400 fill-yellow-400'
// // //                       : 'text-gray-300'
// // //                   }`}
// // //                 />
// // //               ))}
// // //               <span className="ml-2 text-gray-700 font-medium">{product.rating}</span>
// // //             </div>
// // //             <span className="text-gray-500">({product.reviewCount} reviews)</span>
// // //           </div>

// // //           {/* Preparation Time */}
// // //           <div className="flex items-center text-gray-600">
// // //             <ClockIcon className="w-5 h-5 mr-2" />
// // //             <span>Ready in {product.preparationTime} minutes</span>
// // //           </div>

// // //           {/* Price */}
// // //           <div className="text-5xl font-bold text-pepe-primary">
// // //             ₦{product.price.toLocaleString()}
// // //           </div>

// // //           {/* Description */}
// // //           <div className="pt-4 border-t border-gray-200">
// // //             <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
// // //             <p className="text-gray-600 leading-relaxed">
// // //               {product.description}
// // //             </p>
// // //           </div>

// // //           {/* Quantity Selector */}
// // //           <div className="pt-4 border-t border-gray-200">
// // //             <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
// // //             <div className="flex items-center space-x-4">
// // //               <div className="flex items-center border border-gray-300 rounded-xl">
// // //                 <button
// // //                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
// // //                   className="px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-l-xl"
// // //                 >
// // //                   -
// // //                 </button>
// // //                 <span className="px-6 py-3 text-lg font-medium min-w-[60px] text-center">
// // //                   {quantity}
// // //                 </span>
// // //                 <button
// // //                   onClick={() => setQuantity(quantity + 1)}
// // //                   className="px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-r-xl"
// // //                 >
// // //                   +
// // //                 </button>
// // //               </div>
// // //               <div className="text-lg font-medium text-gray-700">
// // //                 Total: ₦{(product.price * quantity).toLocaleString()}
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Action Buttons */}
// // //           <div className="pt-6 border-t border-gray-200 space-y-4">
// // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //               <button
// // //                 onClick={handleAddToCart}
// // //                 className="flex items-center justify-center py-4 px-6 bg-white border-2 border-pepe-primary text-pepe-primary rounded-xl font-bold text-lg hover:bg-pepe-primary hover:text-white transition-colors"
// // //               >
// // //                 <ShoppingCartIcon className="w-6 h-6 mr-3" />
// // //                 Add to Cart
// // //               </button>
              
// // //               <button
// // //                 onClick={handleBuyNow}
// // //                 className="py-4 px-6 bg-pepe-primary text-white rounded-xl font-bold text-lg hover:bg-pepe-dark transition-colors shadow-lg hover:shadow-xl"
// // //               >
// // //                 Order Now
// // //               </button>
// // //             </div>

// // //             {/* Share Button */}
// // //             <button
// // //               onClick={() => {
// // //                 navigator.share?.({
// // //                   title: product.name,
// // //                   text: product.description,
// // //                   url: window.location.href,
// // //                 }).catch(() => {
// // //                   navigator.clipboard.writeText(window.location.href)
// // //                   alert('Link copied to clipboard!')
// // //                 })
// // //               }}
// // //               className="flex items-center justify-center w-full py-3 text-gray-600 hover:text-pepe-primary transition-colors"
// // //             >
// // //               <ShareIcon className="w-5 h-5 mr-2" />
// // //               Share this item
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   )
// // // }


