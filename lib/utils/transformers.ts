// lib/utils/transformers.ts
export interface BackendProduct {
  _id: string
  name: string
  description: string
  price: number
  oldPrice?: number
  retailPrice?: number
  wholesalePrice?: number
  stock: number
  rating: number
  brand: string
  discount: number
  images: { url: string; public_id: string }[]
  category: { _id: string; name: string }
  subCategory?: { _id: string; name: string }
  thirdCategory?: { _id: string; name: string }
  featured: boolean
  status: 'Active' | 'Inactive' | 'Draft' | 'Out of Stock'
  tags: string[]
  specifications?: Map<string, string>
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  moq: number
  pricingTier: 'Basic' | 'Standard' | 'Premium' | 'Enterprise'
  createdAt: string
  updatedAt: string
  sku: string
}

export interface TransformedProduct {
  id: string
  name: string
  description: string
  price: number
  oldPrice?: number
  retailPrice?: number
  wholesalePrice?: number
  image: string
  images: { url: string; public_id: string }[]
  category: string
  originalCategory?: { _id: string; name: string }
  subCategory?: { _id: string; name: string }
  thirdCategory?: { _id: string; name: string }
  rating: number
  reviewCount: number
  isPopular: boolean
  isFeatured: boolean
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
  isDairyFree: boolean
  preparationTime?: number
  stock: number
  moq: number
  status: string
  discount: number
  brand: string
  sku: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  specifications?: Map<string, string>
  tags: string[]
  pricingTier: string
  createdBy?: any
}

export function transformProduct(product: BackendProduct): TransformedProduct {
  // Check tags for dietary preferences
  const tags = product.tags || []
  const isVegetarian = tags.includes('vegetarian') || tags.includes('Vegetarian')
  const isVegan = tags.includes('vegan') || tags.includes('Vegan')
  const isGlutenFree = tags.includes('gluten-free') || tags.includes('Gluten Free')
  const isDairyFree = tags.includes('dairy-free') || tags.includes('Dairy Free')
  
  // Get preparation time from specifications
  const preparationTime = product.specifications?.get('preparationTime') || 
                         product.specifications?.get('cookingTime') || 
                         15 // Default

  return {
    id: product._id,
    name: product.name,
    description: product.description || 'No description available',
    price: product.price,
    oldPrice: product.oldPrice,
    retailPrice: product.retailPrice,
    wholesalePrice: product.wholesalePrice,
    image: product.images?.[0]?.url || '/images/placeholder-food.jpg',
    images: product.images || [],
    category: product.category?.name || 'Uncategorized',
    originalCategory: product.category,
    subCategory: product.subCategory,
    thirdCategory: product.thirdCategory,
    rating: product.rating || 0,
    reviewCount: 0, // You might want to add reviews to your model
    isPopular: product.featured || false,
    isFeatured: product.featured || false,
    isVegetarian,
    isVegan,
    isGlutenFree,
    isDairyFree,
    preparationTime: Number(preparationTime),
    stock: product.stock || 0,
    moq: product.moq || 1,
    status: product.status || 'Active',
    discount: product.discount || 0,
    brand: product.brand || '',
    sku: product.sku || '',
    weight: product.weight,
    dimensions: product.dimensions,
    specifications: product.specifications,
    tags: product.tags || [],
    pricingTier: product.pricingTier || 'Standard',
    createdBy: product.createdBy
  }
}