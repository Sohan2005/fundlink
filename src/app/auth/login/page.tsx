'use client'

import { Suspense } from 'react'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface FormData {
  email: string
  password: string
}

interface FormState {
  isLoading: boolean
  error: string | null
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn } = useAuth()
  const redirectTo = searchParams.get('redirect') || '/dashboard'

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })

  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    error: null
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (formState.error) {
      setFormState(prev => ({ ...prev, error: null }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState({ isLoading: true, error: null })

    try {
      if (!formData.email.trim() || !formData.password) {
        throw new Error('Please fill in all fields')
      }

      const { error } = await signIn(formData.email, formData.password)

      if (error) {
        throw new Error(error.message)
      }

      router.push(redirectTo)
    } catch (error) {
      setFormState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-6">
              FundLink
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600">Sign in to your account to continue your funding journey</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {formState.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{formState.error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email" id="email" name="email" value={formData.email}
                onChange={handleInputChange} required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out hover:border-gray-400 text-gray-900 placeholder-gray-500"
                placeholder="Enter your email" disabled={formState.isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password" id="password" name="password" value={formData.password}
                onChange={handleInputChange} required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out hover:border-gray-400 text-gray-900 placeholder-gray-500"
                placeholder="Enter your password" disabled={formState.isLoading}
              />
            </div>

            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit" disabled={formState.isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {formState.isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors duration-200">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}