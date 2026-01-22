// app/(auth)/forgot-password/page.tsx 
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pepe-secondary to-pepe-light p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-pepe-primary rounded-full flex items-center justify-center">
              <span className="text-white font-display font-bold text-2xl">P</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-display font-bold text-pepe-dark">
            Forgot Password
          </h2>
          <p className="mt-2 text-gray-600">
            Enter your email to reset your password
          </p>
        </div>
        
        <ForgotPasswordForm />
        
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Remember your password?{' '}
            <Link href="/login" className="text-pepe-primary hover:text-pink-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}