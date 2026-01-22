// lib/utils/debug.ts
export const debugAPI = {
  logRequest: (url: string, method: string, data?: any) => {
    console.log(`🟡 API Request: ${method} ${url}`, data || '')
  },
  
  logResponse: (url: string, response: any) => {
    console.log(`🟢 API Response from ${url}:`, response)
  },
  
  logError: (url: string, error: any) => {
    console.error(`🔴 API Error from ${url}:`, error)
  }
}

