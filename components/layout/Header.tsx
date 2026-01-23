'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Bars3Icon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline'
import { useCart } from '../../lib/hooks/useCart'
import { useAuth } from '@/lib/context/authContext'
import UserMenu from '@/components/layout/UserMenu'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { itemCount, setIsCartOpen } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100' 
        : 'bg-gradient-to-b from-pepe-primary/90 to-pepe-primary/70 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center transition-transform hover:scale-105"
          >
            <div className="relative w-12 h-12">
              <Image
                src="/logo.png"
                alt="Pepe's Brunch and Cafe Logo"
                fill
                className="object-contain"
                sizes="48px"
                priority
              />
            </div>
            {/* @@@@@@@@@@@@@@@@@@@@@ LOGO TEXT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */}
            {/* <span className={`ml-2 font-display font-bold text-xl transition-colors duration-300 ${
              isScrolled ? 'text-pepe-dark' : 'text-white'
            }`}>
              Pepe&apos;s
            </span> */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`transition-colors font-medium group ${
              isScrolled ? 'text-pepe-dark hover:text-pepe-primary' : 'text-white/90 hover:text-white'
            }`}>
              Home
              <span className={`block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 ${
                isScrolled ? 'bg-pepe-primary' : 'bg-white'
              }`}></span>
            </Link>
            <Link href="/products" className={`transition-colors font-medium group ${
              isScrolled ? 'text-pepe-dark hover:text-pepe-primary' : 'text-white/90 hover:text-white'
            }`}>
              Menu
              <span className={`block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 ${
                isScrolled ? 'bg-pepe-primary' : 'bg-white'
              }`}></span>
            </Link>
            <Link href="/about" className={`transition-colors font-medium group ${
              isScrolled ? 'text-pepe-dark hover:text-pepe-primary' : 'text-white/90 hover:text-white'
            }`}>
              About
              <span className={`block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 ${
                isScrolled ? 'bg-pepe-primary' : 'bg-white'
              }`}></span>
            </Link>
            <Link href="/contact" className={`transition-colors font-medium group ${
              isScrolled ? 'text-pepe-dark hover:text-pepe-primary' : 'text-white/90 hover:text-white'
            }`}>
              Contact
              <span className={`block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 ${
                isScrolled ? 'bg-pepe-primary' : 'bg-white'
              }`}></span>
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="relative p-2 group"
            >
              <div className="relative">
                <ShoppingCartIcon className={`w-6 h-6 transition-colors ${
                  isScrolled 
                    ? 'text-pepe-dark group-hover:text-pepe-primary' 
                    : 'text-white/90 group-hover:text-white'
                }`} />
                {itemCount > 0 && (
                  <span className={`absolute -top-2 -right-2 text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg transition-colors ${
                    isScrolled
                      ? 'bg-gradient-to-r from-pepe-primary to-pink-500 text-white'
                      : 'bg-white text-pepe-primary'
                  }`}>
                    {itemCount}
                  </span>
                )}
              </div>
            </button>
            
            {/* Auth Button / User Menu */}
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={`hidden md:flex items-center space-x-2 px-5 py-2 rounded-xl hover:shadow-lg transition-all hover:scale-105 ${
                    isScrolled
                      ? 'bg-gradient-to-r from-pepe-primary to-pink-500 text-white'
                      : 'bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30'
                  }`}
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Sign In</span>
                </Link>
                
                <Link 
                  href="/register" 
                  className={`hidden md:flex items-center space-x-2 px-5 py-2 rounded-xl hover:bg-pepe-primary hover:text-white transition-colors ${
                    isScrolled
                      ? 'border-2 border-pepe-primary text-pepe-primary'
                      : 'border-2 border-white/50 text-white hover:border-white'
                  }`}
                >
                  <span>Sign Up</span>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Bars3Icon className={`w-6 h-6 ${
                isScrolled ? 'text-pepe-dark' : 'text-white'
              }`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className={`md:hidden border-t mt-2 pt-4 pb-4 animate-fadeIn ${
            isScrolled 
              ? 'border-gray-200' 
              : 'border-white/20'
          }`}>
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className={`transition-colors py-2 ${
                  isScrolled ? 'text-pepe-dark hover:text-pepe-primary' : 'text-white/90 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className={`transition-colors py-2 ${
                  isScrolled ? 'text-pepe-dark hover:text-pepe-primary' : 'text-white/90 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Menu
              </Link>
              <Link 
                href="/about" 
                className={`transition-colors py-2 ${
                  isScrolled ? 'text-pepe-dark hover:text-pepe-primary' : 'text-white/90 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className={`transition-colors py-2 ${
                  isScrolled ? 'text-pepe-dark hover:text-pepe-primary' : 'text-white/90 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              <div className={`pt-4 ${
                isScrolled ? 'border-t border-gray-200' : 'border-t border-white/20'
              }`}>
                {user ? (
                  <>
                    <Link 
                      href="/dashboard/user" 
                      className={`block transition-colors py-2 ${
                        isScrolled ? 'text-pepe-dark hover:text-pepe-primary' : 'text-white/90 hover:text-white'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link 
                      href="/dashboard/user/orders" 
                      className={`block transition-colors py-2 ${
                        isScrolled ? 'text-pepe-dark hover:text-pepe-primary' : 'text-white/90 hover:text-white'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        // Handle logout
                        setIsMenuOpen(false)
                      }}
                      className={`block w-full text-left py-2 ${
                        isScrolled ? 'text-red-600 hover:text-red-700' : 'text-red-300 hover:text-red-200'
                      }`}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className={`block mb-3 px-4 py-2 rounded-lg text-center transition-colors ${
                        isScrolled
                          ? 'bg-pepe-primary text-white'
                          : 'bg-white/20 backdrop-blur-sm text-white border border-white/30'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/register" 
                      className={`block px-4 py-2 rounded-lg text-center transition-colors ${
                        isScrolled
                          ? 'border-2 border-pepe-primary text-pepe-primary'
                          : 'border-2 border-white/50 text-white'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}






































// // components/layout/Header.tsx
// 'use client'

// import Link from 'next/link'
// import { useState } from 'react'
// import { Bars3Icon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline'
// import { useCart } from '../../lib/hooks/useCart'
// import { useAuth } from '@/lib/context/authContext'
// import UserMenu from '@/components/layout/UserMenu'
// import Image from 'next/image'

// export default function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const { itemCount, setIsCartOpen } = useCart()
//   const { user } = useAuth()

//   return (
//     <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link 
//             href="/" 
//             className="flex items-center transition-transform hover:scale-105"
//           >
//             <div className="relative w-12 h-12">
//               <Image
//                 src="/logo.png"
//                 alt="Pepe's Brunch and Cafe Logo"
//                 fill
//                 className="object-contain"
//                 sizes="48px"
//                 priority
//               />
//             </div>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-8">
//             <Link href="/" className="text-pepe-dark hover:text-pepe-primary transition-colors font-medium group">
//               Home
//               <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-pepe-primary"></span>
//             </Link>
//             <Link href="/products" className="text-pepe-dark hover:text-pepe-primary transition-colors font-medium group">
//               Menu
//               <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-pepe-primary"></span>
//             </Link>
//             <Link href="/about" className="text-pepe-dark hover:text-pepe-primary transition-colors font-medium group">
//               About
//               <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-pepe-primary"></span>
//             </Link>
//             <Link href="/contact" className="text-pepe-dark hover:text-pepe-primary transition-colors font-medium group">
//               Contact
//               <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-pepe-primary"></span>
//             </Link>
//           </nav>

//           {/* Right side icons */}
//           <div className="flex items-center space-x-4">
//             {/* Cart Button */}
//             <button 
//               onClick={() => setIsCartOpen(true)} 
//               className="relative p-2 group"
//             >
//               <div className="relative">
//                 <ShoppingCartIcon className="w-6 h-6 text-pepe-dark group-hover:text-pepe-primary transition-colors" />
//                 {itemCount > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pepe-primary to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
//                     {itemCount}
//                   </span>
//                 )}
//               </div>
//             </button>
            
//             {/* Auth Button / User Menu */}
//             {user ? (
//               <UserMenu />
//             ) : (
//               <>
//                 <Link 
//                   href="/login" 
//                   className="hidden md:flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-pepe-primary to-pink-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
//                 >
//                   <UserIcon className="w-5 h-5" />
//                   <span>Sign In</span>
//                 </Link>
                
//                 <Link 
//                   href="/register" 
//                   className="hidden md:flex items-center space-x-2 px-5 py-2 border-2 border-pepe-primary text-pepe-primary rounded-xl hover:bg-pepe-primary hover:text-white transition-colors"
//                 >
//                   <span>Sign Up</span>
//                 </Link>
//               </>
//             )}

//             {/* Mobile menu button */}
//             <button
//               className="md:hidden p-2"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//               <Bars3Icon className="w-6 h-6 text-pepe-dark" />
//             </button>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         {isMenuOpen && (
//           <div className="md:hidden border-t mt-2 pt-4 pb-4 animate-fadeIn">
//             <div className="flex flex-col space-y-4">
//               <Link 
//                 href="/" 
//                 className="text-pepe-dark hover:text-pepe-primary transition-colors py-2"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Home
//               </Link>
//               <Link 
//                 href="/products" 
//                 className="text-pepe-dark hover:text-pepe-primary transition-colors py-2"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Menu
//               </Link>
//               <Link 
//                 href="/about" 
//                 className="text-pepe-dark hover:text-pepe-primary transition-colors py-2"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 About
//               </Link>
//               <Link 
//                 href="/contact" 
//                 className="text-pepe-dark hover:text-pepe-primary transition-colors py-2"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Contact
//               </Link>
              
//               <div className="pt-4 border-t">
//                 {user ? (
//                   <>
//                     <Link 
//                       href="/dashboard/user" 
//                       className="block text-pepe-dark hover:text-pepe-primary transition-colors py-2"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       My Profile
//                     </Link>
//                     <Link 
//                       href="/dashboard/user/orders" 
//                       className="block text-pepe-dark hover:text-pepe-primary transition-colors py-2"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       My Orders
//                     </Link>
//                     <button
//                       onClick={() => {
//                         // Handle logout
//                         setIsMenuOpen(false)
//                       }}
//                       className="block w-full text-left text-red-600 hover:text-red-700 py-2"
//                     >
//                       Sign Out
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <Link 
//                       href="/login" 
//                       className="block mb-3 px-4 py-2 bg-pepe-primary text-white rounded-lg text-center"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       Sign In
//                     </Link>
//                     <Link 
//                       href="/register" 
//                       className="block px-4 py-2 border-2 border-pepe-primary text-pepe-primary rounded-lg text-center"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       Sign Up
//                     </Link>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   )
// }
















































// // components/layout/Header.tsx
// 'use client'

// import Link from 'next/link'
// import { useState } from 'react'
// import { Bars3Icon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline'
// import { useCart } from '../../lib/hooks/useCart'
// import { useAuth } from '@/lib/context/authContext'
// import UserMenu from '@/components/layout/UserMenu'

// export default function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const { itemCount, setIsCartOpen } = useCart()
//   const { user } = useAuth()

//   return (
//     <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link 
//             href="/" 
//             className="flex items-center space-x-2 transition-transform hover:scale-105"
//           >
//             <div className="w-10 h-10 bg-gradient-to-br from-pepe-primary to-pink-500 rounded-full flex items-center justify-center shadow-lg">
//               <span className="text-white font-display font-bold text-xl">P</span>
//             </div>
//             <div className="hidden sm:block">
//               <span className="font-display font-bold text-2xl text-pepe-dark">
//                 Pepe&apos;s <span className="bg-gradient-to-r from-pepe-primary to-pink-500 bg-clip-text text-transparent">Brunch and Cafe</span>
//               </span>
//             </div>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center space-x-8">
//             <Link href="/" className="text-pepe-dark hover:text-pepe-primary transition-colors font-medium group">
//               Home
//               <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-pepe-primary"></span>
//             </Link>
//             <Link href="/products" className="text-pepe-dark hover:text-pepe-primary transition-colors font-medium group">
//               Menu
//               <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-pepe-primary"></span>
//             </Link>
//             <Link href="/about" className="text-pepe-dark hover:text-pepe-primary transition-colors font-medium group">
//               About
//               <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-pepe-primary"></span>
//             </Link>
//             <Link href="/contact" className="text-pepe-dark hover:text-pepe-primary transition-colors font-medium group">
//               Contact
//               <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-pepe-primary"></span>
//             </Link>
//           </nav>

//           {/* Right side icons */}
//           <div className="flex items-center space-x-4">
//             {/* Cart Button */}
//             <button 
//               onClick={() => setIsCartOpen(true)} 
//               className="relative p-2 group"
//             >
//               <div className="relative">
//                 <ShoppingCartIcon className="w-6 h-6 text-pepe-dark group-hover:text-pepe-primary transition-colors" />
//                 {itemCount > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pepe-primary to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
//                     {itemCount}
//                   </span>
//                 )}
//               </div>
//             </button>
            
//             {/* Auth Button / User Menu */}
//             {user ? (
//               <UserMenu />
//             ) : (
//               <>
//                 <Link 
//                   href="/login" 
//                   className="hidden md:flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-pepe-primary to-pink-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
//                 >
//                   <UserIcon className="w-5 h-5" />
//                   <span>Sign In</span>
//                 </Link>
                
//                 <Link 
//                   href="/register" 
//                   className="hidden md:flex items-center space-x-2 px-5 py-2 border-2 border-pepe-primary text-pepe-primary rounded-xl hover:bg-pepe-primary hover:text-white transition-colors"
//                 >
//                   <span>Sign Up</span>
//                 </Link>
//               </>
//             )}

//             {/* Mobile menu button */}
//             <button
//               className="md:hidden p-2"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//               <Bars3Icon className="w-6 h-6 text-pepe-dark" />
//             </button>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         {isMenuOpen && (
//           <div className="md:hidden border-t mt-2 pt-4 pb-4 animate-fadeIn">
//             <div className="flex flex-col space-y-4">
//               <Link 
//                 href="/" 
//                 className="text-pepe-dark hover:text-pepe-primary transition-colors py-2"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Home
//               </Link>
//               <Link 
//                 href="/products" 
//                 className="text-pepe-dark hover:text-pepe-primary transition-colors py-2"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Menu
//               </Link>
//               <Link 
//                 href="/about" 
//                 className="text-pepe-dark hover:text-pepe-primary transition-colors py-2"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 About
//               </Link>
//               <Link 
//                 href="/contact" 
//                 className="text-pepe-dark hover:text-pepe-primary transition-colors py-2"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Contact
//               </Link>
              
//               <div className="pt-4 border-t">
//                 {user ? (
//                   <>
//                     <Link 
//                       href="/dashboard/user" 
//                       className="block text-pepe-dark hover:text-pepe-primary transition-colors py-2"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       My Profile
//                     </Link>
//                     <Link 
//                       href="/dashboard/user/orders" 
//                       className="block text-pepe-dark hover:text-pepe-primary transition-colors py-2"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       My Orders
//                     </Link>
//                     <button
//                       onClick={() => {
//                         // Handle logout
//                         setIsMenuOpen(false)
//                       }}
//                       className="block w-full text-left text-red-600 hover:text-red-700 py-2"
//                     >
//                       Sign Out
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <Link 
//                       href="/login" 
//                       className="block mb-3 px-4 py-2 bg-pepe-primary text-white rounded-lg text-center"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       Sign In
//                     </Link>
//                     <Link 
//                       href="/register" 
//                       className="block px-4 py-2 border-2 border-pepe-primary text-pepe-primary rounded-lg text-center"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       Sign Up
//                     </Link>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   )
// }