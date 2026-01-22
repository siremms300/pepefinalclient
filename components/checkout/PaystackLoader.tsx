// components/checkout/PaystackLoader.tsx
'use client'

import { useEffect, useState } from 'react'

export default function PaystackLoader() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if already loaded
    if ((window as any).PaystackPop) {
      setIsLoaded(true)
      return
    }

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src*="paystack"]')
    if (existingScript) {
      // Listen for load event on existing script
      existingScript.addEventListener('load', () => {
        setIsLoaded(true)
        setError(null)
      })
      existingScript.addEventListener('error', () => {
        setError('Failed to load Paystack script')
      })
      return
    }

    // Create new script element
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    
    // Add event listeners
    script.onload = () => {
      setIsLoaded(true)
      setError(null)
      console.log('✅ Paystack script loaded successfully')
    }
    
    script.onerror = () => {
      setError('Failed to load Paystack script')
      console.error('❌ Paystack script failed to load')
    }

    // Append to head (more reliable than body)
    document.head.appendChild(script)

    // Fallback: Check after timeout
    const timeout = setTimeout(() => {
      if (!(window as any).PaystackPop) {
        setError('Paystack script loading timeout')
        console.error('⚠️ Paystack script loading timeout')
      }
    }, 10000) // 10 second timeout

    return () => {
      clearTimeout(timeout)
      // Don't remove script - keep it cached
    }
  }, [])

  // Debug info in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Paystack Loader Status:', { isLoaded, error, exists: !!(window as any).PaystackPop })
  }

  // Optional: Show debug info in development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
        <div className={`
          text-xs px-2 py-1 rounded shadow font-mono
          ${isLoaded ? 'bg-green-100 text-green-800' : 
            error ? 'bg-red-100 text-red-800' : 
            'bg-yellow-100 text-yellow-800'}
        `}>
          Paystack: {isLoaded ? '✅' : error ? '❌' : '⏳'}
        </div>
      </div>
    )
  }

  return null
}



