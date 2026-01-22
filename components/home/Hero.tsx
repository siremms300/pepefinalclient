  

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [fade, setFade] = useState(true)

  const slides = [
    {
      image: '/image1.jpg',
      title: 'Fresh Breakfast Platters',
      description: 'Start your day with our signature breakfast combos'
    },
    {
      image: '/image2.jpg',
      title: 'Gourmet Pastries',
      description: 'Handcrafted pastries baked fresh daily'
    },
    {
      image: '/image3.jpg',
      title: 'Premium Coffee Blends',
      description: 'Artisan coffee paired with delightful treats'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setFade(false)
      
      // Change slide after fade out
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        setFade(true) // Fade in new slide
      }, 500) // Match this with CSS transition duration
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setFade(false)
    setTimeout(() => {
      setCurrentSlide(index)
      setFade(true)
    }, 300)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pepe-secondary to-pepe-light">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-pepe-dark mb-6 leading-tight">
              Delicious <span className="text-pepe-primary">Brunch</span> 
              <br />
              Delivered to Your Door
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Experience the finest selection of brunch items, pastries, and beverages 
              from Pepe&apos;s Brunch and Cafe. Freshly made and delivered hot to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/products" 
                className="px-8 py-3 bg-gradient-to-r from-pepe-primary to-pink-500 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 text-center flex items-center justify-center gap-2 group"
              >
                Order Now
                <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>
              </Link>
              <Link 
                href="/about" 
                className="px-8 py-3 border-2 border-pepe-primary text-pepe-primary font-semibold rounded-xl hover:bg-pepe-primary hover:text-white transition-all duration-300 text-center"
              >
                Explore Menu
              </Link>
            </div>
            
            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-pepe-primary">100+</div>
                <div className="text-sm text-gray-600">Menu Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pepe-primary">4.9⭐</div>
                <div className="text-sm text-gray-600">Customer Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pepe-primary">30min</div>
                <div className="text-sm text-gray-600">Avg Delivery</div>
              </div>
            </div>
          </div>

          {/* Right Side - Image Slider */}
          <div className="relative">
            {/* Main Image Container with Gradient Overlay */}
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
              {/* Background Images (for smooth transition) */}
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    currentSlide === index ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {/* Fallback background color */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 to-gray-900/10" />
                  
                  {/* Actual Image */}
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className={`object-cover transition-transform duration-700 ease-in-out ${
                      fade ? 'scale-100' : 'scale-105'
                    } group-hover:scale-110`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-8 left-8 right-8 text-white transform transition-transform duration-700 ease-in-out translate-y-0 group-hover:translate-y-2">
                    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
                      <p className="text-gray-200">{slide.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Dots */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? 'bg-pepe-primary w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-pepe-primary/10 rounded-3xl -z-10 animate-pulse-slow" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-pepe-secondary/20 rounded-2xl -z-10 animate-pulse-slow delay-1000" />
          </div>
        </div>
      </div>
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-pepe-primary/10 rounded-full -translate-y-32 translate-x-32 animate-float-slow"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pepe-secondary/20 rounded-full translate-y-48 -translate-x-48 animate-float-slow delay-1000"></div>

      {/* Floating Icons */}
      <div className="absolute top-20 left-10 text-4xl animate-float">🥐</div>
      <div className="absolute bottom-40 right-20 text-5xl animate-float delay-500">☕</div>
      <div className="absolute top-40 right-10 text-6xl animate-float delay-1000">🥞</div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .delay-500 {
          animation-delay: 500ms;
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
        
        @media (max-width: 768px) {
          .animate-float {
            display: none;
          }
        }
      `}</style>
    </section>
  )
}




















































// import Link from 'next/link'
// import Image from 'next/image'

// export default function Hero() {
//   return (
//     <section className="relative overflow-hidden bg-gradient-to-br from-pepe-secondary to-pepe-light">
//       <div className="container mx-auto px-4 py-16 md:py-24">
//         <div className="grid md:grid-cols-2 gap-12 items-center">
//           <div>
//             <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-pepe-dark mb-6">
//               Delicious <span className="text-pepe-primary">Brunch</span> Delivered to Your Door
//             </h1>
//             <p className="text-lg text-gray-600 mb-8">
//               Experience the finest selection of brunch items, pastries, and beverages from Pepe&apos;s Brunch and Cafe. Freshly made and delivered hot.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4">
//               <Link 
//                 href="/products" 
//                 className="px-8 py-3 bg-pepe-primary text-white font-semibold rounded-lg hover:bg-pink-500 transition-colors text-center"
//               >
//                 Order Now
//               </Link>
//               <Link 
//                 href="/products" 
//                 className="px-8 py-3 border-2 border-pepe-primary text-pepe-primary font-semibold rounded-lg hover:bg-pepe-primary hover:text-white transition-colors text-center"
//               >
//                 Learn More
//               </Link>
//             </div>
//           </div>
//           <div className="relative">
//             <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
//               {/* Placeholder for hero image */}
//               <div className="absolute inset-0 bg-gradient-to-r from-pepe-primary/20 to-pepe-secondary/20 flex items-center justify-center">
//                 <div className="text-center">
//                   <div className="w-32 h-32 md:w-48 md:h-48 mx-auto bg-pepe-primary/30 rounded-full flex items-center justify-center mb-4">
//                     <span className="text-6xl md:text-8xl">🥞</span>
//                   </div>
//                   <p className="text-pepe-dark font-display text-xl">Food Image Here</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Decorative elements */}
//       <div className="absolute top-0 right-0 w-64 h-64 bg-pepe-primary/10 rounded-full -translate-y-32 translate-x-32"></div>
//       <div className="absolute bottom-0 left-0 w-96 h-96 bg-pepe-secondary/20 rounded-full translate-y-48 -translate-x-48"></div>
//     </section>
//   )
// }


