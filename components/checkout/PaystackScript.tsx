// Desktop/pepefinal/frontend/components/checkout/PaystackScript.tsx
'use client'

import { useEffect } from 'react'

export default function PaystackScript() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return null
}