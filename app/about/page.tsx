// app/about/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export default function AboutPage() {
  const [stats, setStats] = useState({
    customers: 0,
    orders: 0,
    rating: 0,
    years: 0
  })

  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set())
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Animate stats counters
    const timer = setTimeout(() => {
      setStats({
        customers: 10000,
        orders: 50000,
        rating: 4.9,
        years: 5
      })
    }, 500)

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'))
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set(prev).add(index))
          }
        })
      },
      { threshold: 0.1, rootMargin: '-50px' }
    )

    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.setAttribute('data-index', index.toString())
        observer.observe(ref)
      }
    })

    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [])

  const teamMembers = [
    {
      name: 'Chef Pepe',
      role: 'Founder & Head Chef',
      description: 'With 15+ years of culinary experience, Chef Pepe brings passion to every dish.',
      specialties: ['Italian Cuisine', 'Pastry Arts', 'Food Presentation']
    },
    {
      name: 'Maria Rodriguez',
      role: 'Pastry Chef',
      description: 'Award-winning pastry chef specializing in French desserts and custom cakes.',
      specialties: ['French Pastries', 'Wedding Cakes', 'Chocolate Art']
    },
    {
      name: 'David Chen',
      role: 'Operations Manager',
      description: 'Ensures smooth operations and exceptional customer experience.',
      specialties: ['Operations', 'Customer Service', 'Logistics']
    },
    {
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      description: 'Creates delicious marketing campaigns that match our food quality.',
      specialties: ['Brand Strategy', 'Social Media', 'Events']
    }
  ]

  const values = [
    {
      title: 'Passion',
      description: 'We pour our heart into every dish, ensuring each bite tells a story of dedication.',
      color: 'from-red-400 to-pink-500'
    },
    {
      title: 'Excellence',
      description: 'Only the finest ingredients meet our exacting standards for quality and taste.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      title: 'Innovation',
      description: 'Constantly pushing culinary boundaries while respecting traditional flavors.',
      color: 'from-blue-400 to-purple-500'
    }
  ]

  const timeline = [
    {
      year: '2019',
      title: 'The Beginning',
      description: 'A small café in Lagos serving authentic Italian pastries',
      icon: '🎂'
    },
    {
      year: '2020',
      title: 'First Expansion',
      description: 'Opened second location and introduced brunch menu',
      icon: '🔥'
    },
    {
      year: '2021',
      title: 'Award Winning',
      description: 'Received "Best Café in Lagos" award',
      icon: '🏆'
    },
    {
      year: '2022',
      title: 'Digital Presence',
      description: 'Launched online ordering and delivery service',
      icon: '🛒'
    },
    {
      year: '2023',
      title: 'National Recognition',
      description: 'Featured in National Food Magazine',
      icon: '⭐'
    }
  ]

  const testimonials = [
    {
      name: 'Adebayo Williams',
      role: 'Food Critic',
      quote: 'The perfect blend of authentic Italian flavors with local Nigerian ingredients.',
      rating: 5
    },
    {
      name: 'Chioma Okeke',
      role: 'Regular Customer',
      quote: 'Their pastries have become a Saturday morning tradition for my family.',
      rating: 5
    },
    {
      name: 'James Peterson',
      role: 'Travel Blogger',
      quote: 'Discovered this gem while visiting Lagos. Worth every calorie!',
      rating: 5
    }
  ]

  const StatCounter = ({ end, suffix, label }: { end: number; suffix: string; label: string }) => {
    const [count, setCount] = useState(0)
    
    useEffect(() => {
      let start = 0
      const duration = 2000
      const increment = end / (duration / 16) // 60fps
      
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)
      
      return () => clearInterval(timer)
    }, [end])
    
    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pepe-primary to-pepe-secondary rounded-2xl flex items-center justify-center shadow-lg">
          {label === 'Happy Customers' && '👥'}
          {label === 'Orders Delivered' && '📦'}
          {label === 'Customer Rating' && '⭐'}
          {label === 'Years Serving' && '⏳'}
        </div>
        <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {label === 'Customer Rating' ? `${count.toFixed(1)}` : count}
          <span className="text-pepe-primary">{suffix}</span>
        </div>
        <p className="text-gray-300">{label}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-pepe-primary/10 to-pepe-secondary/10" />
          <div className="absolute top-0 left-0 w-72 h-72 bg-pepe-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pepe-secondary/5 rounded-full translate-x-1/3 translate-y-1/3 animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div 
              className="inline-flex items-center px-4 py-2 bg-pepe-primary/10 text-pepe-primary rounded-full text-sm font-medium mb-6 animate-bounce"
              style={{ animationDelay: '0.2s' }}
            >
              ✨ Our Story Since 2019
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up">
              More Than Just{' '}
              <span className="bg-gradient-to-r from-pepe-primary to-pepe-secondary bg-clip-text text-transparent animate-gradient">
                Food
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-up delay-100">
              We&apos;re a family of food lovers dedicated to bringing authentic flavors, 
              warm hospitality, and unforgettable experiences to every table in Lagos.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 animate-slide-up delay-200">
              <Link
                href="/menu"
                className="px-8 py-4 bg-gradient-to-r from-pepe-primary to-pepe-secondary text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center group"
              >
                Explore Our Menu
                <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-xl font-bold text-lg hover:border-pepe-primary hover:shadow-xl transition-all duration-300"
              >
                Visit Our Café
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter end={10000} suffix="+" label="Happy Customers" />
            <StatCounter end={50000} suffix="+" label="Orders Delivered" />
            <StatCounter end={4.9} suffix="/5" label="Customer Rating" />
            <StatCounter end={5} suffix="+" label="Years Serving" />
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div 
              ref={el => sectionRefs.current[0] = el}
              className={`transition-all duration-700 transform ${visibleSections.has(0) ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
            >
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-pepe-primary/10 rounded-3xl" />
                <div className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-8xl animate-float">🍝</div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-pepe-secondary/10 rounded-3xl" />
              </div>
            </div>
            
            <div 
              ref={el => sectionRefs.current[1] = el}
              className={`transition-all duration-700 transform delay-300 ${visibleSections.has(1) ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                From Humble{' '}
                <span className="bg-gradient-to-r from-pepe-primary to-pepe-secondary bg-clip-text text-transparent">
                  Beginnings
                </span>
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                What started as a small passion project in 2019 has grown into Lagos&apos; 
                favorite destination for authentic Italian pastries and brunch experiences. 
                Our journey began with a simple goal: to share our love for quality food 
                with our community.
              </p>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Today, we&apos;re proud to serve thousands of customers, each dish prepared 
                with the same care and attention that marked our very first day. We believe 
                that good food brings people together, and we&apos;re honored to be part of 
                your special moments.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {['Fresh Ingredients', 'Handcrafted Daily', 'Local Sourcing', 'Sustainable Practices'].map((item, i) => (
                  <div key={item} className="flex items-center animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                    <span className="w-6 h-6 text-green-500 mr-3">✓</span>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="bg-gradient-to-r from-pepe-primary to-pepe-secondary bg-clip-text text-transparent">Core Values</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              These principles guide everything we do, from selecting ingredients to serving our customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={value.title}
                ref={el => sectionRefs.current[2 + index] = el}
                className={`transition-all duration-700 transform hover:-translate-y-2 ${visibleSections.has(2 + index) ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 h-full border border-gray-100">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                    {value.title === 'Passion' && '❤️'}
                    {value.title === 'Excellence' && '⭐'}
                    {value.title === 'Innovation' && '💡'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="bg-gradient-to-r from-pepe-primary to-pepe-secondary bg-clip-text text-transparent">Journey</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Milestones that mark our growth and commitment to excellence
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-pepe-primary to-pepe-secondary" />
            
            <div className="space-y-12">
              {timeline.map((item, index) => {
                const isLeft = index % 2 === 0
                
                return (
                  <div 
                    key={item.year}
                    ref={el => sectionRefs.current[5 + index] = el}
                    className={`relative flex items-center ${isLeft ? 'justify-start' : 'justify-end'} transition-all duration-700 ${visibleSections.has(5 + index) ? 'translate-x-0 opacity-100' : isLeft ? '-translate-x-10 opacity-0' : 'translate-x-10 opacity-0'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-pepe-primary z-10 animate-pulse" />
                    
                    <div className={`w-5/12 ${isLeft ? 'pr-12 text-right' : 'pl-12'}`}>
                      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-pepe-primary/10 flex items-center justify-center ${isLeft ? 'mr-4' : 'ml-4'}`}>
                            <span className="text-2xl">{item.icon}</span>
                          </div>
                          <div className={isLeft ? 'text-right' : ''}>
                            <div className="text-sm font-medium text-pepe-primary">{item.year}</div>
                            <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                          </div>
                        </div>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Meet Our <span className="bg-gradient-to-r from-pepe-primary to-pepe-secondary bg-clip-text text-transparent">Family</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The talented individuals who make every visit special
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={member.name}
                ref={el => sectionRefs.current[10 + index] = el}
                className={`transition-all duration-700 transform hover:-translate-y-2 ${visibleSections.has(10 + index) ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 h-full group">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden flex items-center justify-center">
                    <div className="text-8xl transition-transform duration-300 group-hover:scale-110">
                      {index === 0 && '👨‍🍳'}
                      {index === 1 && '👩‍🍳'}
                      {index === 2 && '👨‍💼'}
                      {index === 3 && '👩‍💼'}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                      <p className="text-pepe-light">{member.role}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{member.description}</p>
                    
                    <div className="space-y-2">
                      {member.specialties.map((specialty) => (
                        <div key={specialty} className="flex items-center text-sm">
                          <div className="w-2 h-2 rounded-full bg-pepe-primary mr-3" />
                          <span className="text-gray-700">{specialty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our <span className="bg-gradient-to-r from-pepe-primary to-pepe-secondary bg-clip-text text-transparent">Customers Say</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Don&apos;t just take our word for it - hear from our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.name}
                ref={el => sectionRefs.current[14 + index] = el}
                className={`transition-all duration-700 transform hover:-translate-y-1 ${visibleSections.has(14 + index) ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className="flex mb-6">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">⭐</span>
                    ))}
                  </div>
                  
                  <p className="text-gray-700 text-lg italic mb-8 leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pepe-primary to-pepe-secondary mr-4 flex items-center justify-center">
                      <span className="text-white font-bold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Us CTA */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="bg-gradient-to-r from-pepe-primary to-pepe-secondary bg-clip-text text-transparent">Experience</span> It Yourself?
            </h2>
            
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
              Visit our café or order online to taste the difference that passion and quality make.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: '📍', title: 'Visit Us', text: '123 Food Street, Lagos Island, Lagos' },
                { icon: '📞', title: 'Call Us', text: '+234 800 123 4567' },
                { icon: '✉️', title: 'Email Us', text: 'hello@pepescafe.com' }
              ].map((item, index) => (
                <div 
                  key={item.title}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-300">{item.text}</p>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/menu"
                className="px-8 py-4 bg-gradient-to-r from-pepe-primary to-pepe-secondary text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
              >
                Order Online Now
                <span className="ml-2 group-hover:translate-x-2 transition-transform inline-block">→</span>
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                Get Directions
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      <style jsx global>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        
        .animate-gradient {
          background-size: 200% auto;
          background-image: linear-gradient(45deg, #ff8dc1, #ff5e9c, #ff8dc1);
          animation: gradient 3s ease infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .delay-100 {
          animation-delay: 100ms;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  )
}