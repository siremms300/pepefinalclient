// Desktop/pepefinal/frontend/app/page.tsx
import Header from '../components/layout/Header'
import Hero from '../components/home/Hero'
import ProductListing from '../components/products/ProductListing'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        {/* Featured Products Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular This Week</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our customers' favorite dishes, freshly prepared every day
              </p>
            </div>
            
            {/* Product Listing - Limited to 6 items for homepage */}
            <ProductListing limit={6} />
            
            {/* See More Button */}
            <div className="text-center mt-12">
              <Link
                href="/products"
                className="inline-flex items-center px-8 py-3 bg-pepe-primary text-white rounded-xl font-bold text-lg hover:bg-pepe-dark transition-colors shadow-lg hover:shadow-xl"
              >
                View Full Menu
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Pepe's</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-pepe-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🔥</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Fresh & Hot</h3>
                <p className="text-gray-600">Made-to-order meals prepared with fresh ingredients daily</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-pepe-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🚚</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Delivery</h3>
                <p className="text-gray-600">Quick delivery within 30-45 minutes to your doorstep</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-pepe-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-3xl">⭐</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Guaranteed</h3>
                <p className="text-gray-600">Consistently high ratings from our happy customers</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6">
                  "The best jollof rice in Lagos! Always fresh and delivered hot. Pepe's never disappoints!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Adebayo S.</h4>
                    <p className="text-sm text-gray-500">Regular Customer</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6">
                  "Their salads are always fresh and the portions are generous. Perfect for healthy eating!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Chioma A.</h4>
                    <p className="text-sm text-gray-500">Health Enthusiast</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6">
                  "Fast delivery and amazing customer service. The pancakes are my weekend treat!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-bold text-gray-900">Emeka O.</h4>
                    <p className="text-sm text-gray-500">Foodie</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-pepe-primary to-pepe-dark">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Order?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Order now and enjoy delicious meals delivered to your door or ready for pickup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="px-8 py-3 bg-white text-pepe-primary rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
              >
                Order Now
              </Link>
              <Link
                href="/products"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-colors"
              >
                View Menu
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}



