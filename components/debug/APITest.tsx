// components/debug/APITest.tsx
'use client'

import { useEffect, useState } from 'react'
import { productService, categoryService } from '@/lib/services/api'

export default function APITest() {
  const [productsStatus, setProductsStatus] = useState('Testing...')
  const [categoriesStatus, setCategoriesStatus] = useState('Testing...')
  const [productsData, setProductsData] = useState<any>(null)
  const [categoriesData, setCategoriesData] = useState<any>(null)
  const [apiUrl, setApiUrl] = useState('')

  useEffect(() => {
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || 'Not set')
    
    // Test products endpoint
    productService.getProducts({ limit: 1 })
      .then(data => {
        setProductsStatus('✅ Connected')
        setProductsData(data)
      })
      .catch(error => {
        setProductsStatus(`❌ Error: ${error.message}`)
      })
    
    // Test categories endpoint
    categoryService.getCategories()
      .then(data => {
        setCategoriesStatus('✅ Connected')
        setCategoriesData(data)
      })
      .catch(error => {
        setCategoriesStatus(`❌ Error: ${error.message}`)
      })
  }, [])

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4">API Connection Test</h2>
      
      <div className="space-y-4">
        <div>
          <p className="font-semibold">API URL:</p>
          <code className="bg-gray-100 p-2 rounded block">{apiUrl}</code>
        </div>
        
        <div>
          <p className="font-semibold">Products Endpoint:</p>
          <div className="flex items-center gap-2">
            <span>{productsStatus}</span>
            {productsData && (
              <span className="text-sm text-gray-600">
                (Found: {productsData.data?.length || 0} products)
              </span>
            )}
          </div>
          {productsData && (
            <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto max-h-60">
              {JSON.stringify(productsData, null, 2)}
            </pre>
          )}
        </div>
        
        <div>
          <p className="font-semibold">Categories Endpoint:</p>
          <div className="flex items-center gap-2">
            <span>{categoriesStatus}</span>
            {categoriesData && (
              <span className="text-sm text-gray-600">
                (Found: {categoriesData.data?.length || 0} categories)
              </span>
            )}
          </div>
          {categoriesData && (
            <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto max-h-60">
              {JSON.stringify(categoriesData, null, 2)}
            </pre>
          )}
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="font-semibold mb-2">Troubleshooting Steps:</h3>
          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li>Check if backend is running on port 8080</li>
            <li>Verify CORS is enabled in backend (should allow all origins)</li>
            <li>Check browser console for CORS errors</li>
            <li>Verify database connection in backend logs</li>
            <li>Check if products exist in MongoDB database</li>
          </ol>
        </div>
      </div>
    </div>
  )
}