// app/products/[id]/page.tsx
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductDetails from '@/components/products/ProductDetails'
import ProductDetailsLoading from '@/components/products/ProductDetailsLoading'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  
  try {
    // Fetch actual product data for metadata
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    const response = await fetch(`${baseUrl}/products/${id}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })
    
    if (!response.ok) {
      return {
        title: 'Product Not Found | Pepe\'s Brunch and Cafe',
        description: 'Product not found',
      }
    }
    
    const data = await response.json()
    
    if (!data.success || !data.data) {
      return {
        title: 'Product Not Found | Pepe\'s Brunch and Cafe',
        description: 'Product not found',
      }
    }
    
    const product = data.data
    
    return {
      title: `${product.name} | Pepe's Brunch and Cafe`,
      description: product.description?.substring(0, 160) || 'Delicious food from Pepe\'s Brunch and Cafe',
      openGraph: {
        title: `${product.name} | Pepe's Brunch and Cafe`,
        description: product.description?.substring(0, 160) || 'Delicious food from Pepe\'s Brunch and Cafe',
        images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
      },
    }
  } catch (error) {
    console.error('Error fetching product metadata:', error)
    return {
      title: 'Product | Pepe\'s Brunch and Cafe',
      description: 'Delicious food from Pepe\'s Brunch and Cafe',
    }
  }
}

// Helper function to transform product data
function transformProductData(product: any) {
  return {
    _id: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    oldPrice: product.oldPrice,
    retailPrice: product.retailPrice,
    wholesalePrice: product.wholesalePrice,
    moq: product.moq || 1,
    pricingTier: product.pricingTier || 'Standard',
    stock: product.stock || 0,
    rating: product.rating || 0,
    brand: product.brand,
    discount: product.discount || 0,
    size: product.size,
    images: product.images || [],
    banners: product.banners || [],
    bannerTitle: product.bannerTitle,
    category: product.category || { _id: '', name: '' },
    subCategory: product.subCategory,
    thirdCategory: product.thirdCategory,
    featured: product.featured || false,
    wholesaleEnabled: product.wholesaleEnabled || false,
    status: product.status || 'Active',
    sku: product.sku,
    tags: product.tags || [],
    specifications: product.specifications || {},
    weight: product.weight,
    dimensions: product.dimensions,
    createdBy: product.createdBy,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }
}

async function getProduct(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    const response = await fetch(`${baseUrl}/products/${id}`, {
      next: { revalidate: 60 }
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    
    if (!data.success || !data.data) {
      return null
    }
    
    return transformProductData(data.data)
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  
  const product = await getProduct(id)
  
  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <Suspense fallback={<ProductDetailsLoading />}>
          <div className="container mx-auto px-4 py-8">
            <ProductDetails product={product} />
          </div>
        </Suspense>
      </main>
      
      <Footer />
    </div>
  )
}


























































// // app/products/[id]/page.tsx
// import Header from '../../../components/layout/Header'
// import Footer from '../../../components/layout/Footer'
// import ProductDetails from '@/components/products/ProductDetails'
// import ProductDetailsLoading from '@/components/products/ProductDetailsLoading'
// import { notFound } from 'next/navigation'
// import { Suspense } from 'react'

// interface PageProps {
//   params: Promise<{ id: string }>
//   searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
// }

// export async function generateMetadata({ params }: PageProps) {
//   const { id } = await params
  
//   try {
//     // Fetch actual product data for metadata
//     const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
//     const response = await fetch(`${baseUrl}/products/${id}`, {
//       next: { revalidate: 60 } // Revalidate every 60 seconds
//     })
    
//     if (!response.ok) {
//       return {
//         title: 'Product Not Found | Pepe\'s Brunch and Cafe',
//         description: 'Product not found',
//       }
//     }
    
//     const data = await response.json()
    
//     if (!data.success || !data.data) {
//       return {
//         title: 'Product Not Found | Pepe\'s Brunch and Cafe',
//         description: 'Product not found',
//       }
//     }
    
//     const product = data.data
    
//     return {
//       title: `${product.name} | Pepe's Brunch and Cafe`,
//       description: product.description?.substring(0, 160) || 'Delicious food from Pepe\'s Brunch and Cafe',
//       openGraph: {
//         title: `${product.name} | Pepe's Brunch and Cafe`,
//         description: product.description?.substring(0, 160) || 'Delicious food from Pepe\'s Brunch and Cafe',
//         images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
//       },
//     }
//   } catch (error) {
//     console.error('Error fetching product metadata:', error)
//     return {
//       title: 'Product | Pepe\'s Brunch and Cafe',
//       description: 'Delicious food from Pepe\'s Brunch and Cafe',
//     }
//   }
// }

// // Helper function to transform product data
// function transformProductData(product: any) {
//   return {
//     _id: product._id,
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
//     images: product.images || [],
//     banners: product.banners || [],
//     bannerTitle: product.bannerTitle,
//     category: product.category || { _id: '', name: '' },
//     subCategory: product.subCategory,
//     thirdCategory: product.thirdCategory,
//     featured: product.featured || false,
//     wholesaleEnabled: product.wholesaleEnabled || false,
//     status: product.status || 'Active',
//     sku: product.sku,
//     tags: product.tags || [],
//     specifications: product.specifications || {},
//     weight: product.weight,
//     dimensions: product.dimensions,
//     createdBy: product.createdBy,
//     createdAt: product.createdAt,
//     updatedAt: product.updatedAt,
//   }
// }

// async function getProduct(id: string) {
//   try {
//     const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
//     const response = await fetch(`${baseUrl}/products/${id}`, {
//       next: { revalidate: 60 }
//     })
    
//     if (!response.ok) {
//       return null
//     }
    
//     const data = await response.json()
    
//     if (!data.success || !data.data) {
//       return null
//     }
    
//     return transformProductData(data.data)
//   } catch (error) {
//     console.error('Error fetching product:', error)
//     return null
//   }
// }

// export default async function ProductPage({ params }: PageProps) {
//   const { id } = await params
  
//   const product = await getProduct(id)
  
//   if (!product) {
//     notFound()
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Header />
      
//       <main className="flex-grow">
//         <Suspense fallback={<ProductDetailsLoading />}>
//           <div className="container mx-auto px-4 py-8">
//             <ProductDetails product={product} />
//           </div>
//         </Suspense>
//       </main>
      
//       <Footer />
//     </div>
//   )
// }































// // app/products/[id]/page.tsx
// import Header from '../../../components/layout/Header'
// import Footer from '../../../components/layout/Footer'
// import ProductDetails from '@/components/products/ProductDetails'
// import { notFound } from 'next/navigation'

// interface PageProps {
//   params: Promise<{ id: string }>
//   searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
// }

// export async function generateMetadata({ params }: PageProps) {
//   const { id } = await params
  
//   try {
//     // Fetch actual product data
//     const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
//     const response = await fetch(`${baseUrl}/products/${id}`, {
//       next: { revalidate: 60 } // Revalidate every 60 seconds
//     })
    
//     if (!response.ok) {
//       return {
//         title: 'Product Not Found | Pepe\'s Brunch and Cafe',
//         description: 'Product not found',
//       }
//     }
    
//     const data = await response.json()
    
//     if (!data.success || !data.data) {
//       return {
//         title: 'Product Not Found | Pepe\'s Brunch and Cafe',
//         description: 'Product not found',
//       }
//     }
    
//     const product = data.data
    
//     return {
//       title: `${product.name} | Pepe's Brunch and Cafe`,
//       description: product.description?.substring(0, 160) || 'Delicious food from Pepe\'s Brunch and Cafe',
//       openGraph: {
//         title: `${product.name} | Pepe's Brunch and Cafe`,
//         description: product.description?.substring(0, 160) || 'Delicious food from Pepe\'s Brunch and Cafe',
//         images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
//       },
//     }
//   } catch (error) {
//     console.error('Error fetching product metadata:', error)
//     return {
//       title: 'Product | Pepe\'s Brunch and Cafe',
//       description: 'Delicious food from Pepe\'s Brunch and Cafe',
//     }
//   }
// }

// export default async function ProductPage({ params }: PageProps) {
//   const { id } = await params
  
//   try {
//     // Fetch actual product data
//     const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
//     const response = await fetch(`${baseUrl}/products/${id}`, {
//       next: { revalidate: 60 } // Revalidate every 60 seconds
//     })
    
//     if (!response.ok) {
//       notFound()
//     }
    
//     const data = await response.json()
    
//     if (!data.success || !data.data) {
//       notFound()
//     }
    
//     const product = data.data
    
//     // Transform product data for the component
//     const transformedProduct = {
//       _id: product._id,
//       name: product.name,
//       description: product.description,
//       price: product.price,
//       oldPrice: product.oldPrice,
//       retailPrice: product.retailPrice,
//       wholesalePrice: product.wholesalePrice,
//       moq: product.moq || 1,
//       pricingTier: product.pricingTier || 'Standard',
//       stock: product.stock || 0,
//       rating: product.rating || 0,
//       brand: product.brand,
//       discount: product.discount || 0,
//       size: product.size,
//       images: product.images || [],
//       banners: product.banners || [],
//       bannerTitle: product.bannerTitle,
//       category: product.category || { _id: '', name: '' },
//       subCategory: product.subCategory,
//       thirdCategory: product.thirdCategory,
//       featured: product.featured || false,
//       wholesaleEnabled: product.wholesaleEnabled || false,
//       status: product.status || 'Active',
//       sku: product.sku,
//       tags: product.tags || [],
//       specifications: product.specifications || {},
//       weight: product.weight,
//       dimensions: product.dimensions,
//       createdBy: product.createdBy,
//       createdAt: product.createdAt,
//       updatedAt: product.updatedAt,
//     }
    
//     return (
//       <div className="min-h-screen flex flex-col bg-gray-50">
//         <Header />
        
//         <main className="flex-grow">
//           {/* Product Details */}
//           <div className="container mx-auto px-4 py-8">
//             <ProductDetails product={transformedProduct} />
//           </div>
//         </main>
        
//         <Footer />
//       </div>
//     )
//   } catch (error) {
//     console.error('Error fetching product:', error)
//     notFound()
//   }
// }






































// // // Desktop/pepefinal/frontend/app/products/[id]/page.tsx
// // import Header from '../../../components/layout/Header'
// // import Footer from '../../../components/layout/Footer'
// // import ProductDetails from '@/components/products/ProductDetails'
// // import RelatedProducts from '@/components/products/RelatedProducts'
// // import { notFound } from 'next/navigation'


// // interface PageProps {
// //   params: Promise<{ id: string }>
// // }

// // export async function generateMetadata({ params }: PageProps) {
// //   const { id } = await params
  
// //   // Mock product data
// //   const product = {
// //     name: 'Avocado Toast Deluxe',
// //     description: 'Sourdough bread with smashed avocado, cherry tomatoes, and poached eggs.',
// //   }
  
// //   return {
// //     title: `${product.name} | Pepe's Brunch and Cafe`,
// //     description: product.description,
// //   }
// // }

// // export default async function ProductPage({ params }: PageProps) {
// //   const { id } = await params
  
// //   // Mock product data
// //   const product = {
// //     id: parseInt(id),
// //     name: 'Avocado Toast Deluxe',
// //     description: 'Sourdough bread with smashed avocado, cherry tomatoes, and poached eggs. Served with a side of fresh greens. Perfect for a healthy breakfast or brunch.',
// //     price: 4500,
// //     images: [
// //       '/food/avocado-toast-1.jpg',
// //       '/food/avocado-toast-2.jpg',
// //       '/food/avocado-toast-3.jpg',
// //     ],
// //     category: 'breakfast',
// //     rating: 4.8,
// //     reviewCount: 124,
// //     isPopular: true,
// //     isVegetarian: true,
// //     isVegan: false,
// //     isGlutenFree: true,
// //     preparationTime: 15,
// //   }

// //   if (!product) {
// //     notFound()
// //   }

// //   return (
// //     <div className="min-h-screen flex flex-col bg-gray-50">
// //       <Header />
      
// //       <main className="flex-grow">
// //         {/* Product Details */}
// //         <div className="container mx-auto px-4 py-8">
// //           <ProductDetails product={product} />
// //         </div>

// //         {/* Related Products */}
// //         <div className="bg-white py-12">
// //           <div className="container mx-auto px-4">
// //             <RelatedProducts currentProductId={product.id} />
// //           </div>
// //         </div>
// //       </main>
      
// //       <Footer />
// //     </div>
// //   )
// // }



