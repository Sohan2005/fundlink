'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'

export default function CompanySignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyId: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      // STEP 1: Check if user is already logged in
      const { data: { user: existingUser } } = await supabase.auth.getUser()

      let userId: string

      if (existingUser) {
        // USER IS LOGGED IN - Add company profile to existing account
        console.log('User already logged in, adding company profile...')
        userId = existingUser.id
        
        // Check if they already have a company profile
        const { data: existingCompany } = await supabase
          .from('company_profiles')
          .select('id')
          .eq('user_id', userId)
          .single()

        if (existingCompany) {
          setError('You already have a company profile. Go to settings to update it.')
          setLoading(false)
          return
        }

      } else {
        // USER NOT LOGGED IN - Create new account
        console.log('Creating new user account...')
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.companyName,
              user_type: 'company_admin'
            }
          }
        })

        if (authError) throw authError
        if (!authData.user) throw new Error('Failed to create user account')

        userId = authData.user.id

        // Wait for the auth user to be fully created
        await new Promise(resolve => setTimeout(resolve, 1500))
      }

      // STEP 2: Create company profile using the secure function
      const { data: companyProfile, error: profileError } = await supabase
        .rpc('create_or_update_company_profile', {
          p_user_id: userId,
          p_company_id: formData.companyId.toLowerCase().replace(/\s+/g, '-'),
          p_company_name: formData.companyName,
          p_company_email: formData.email,
          p_company_phone: null
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        throw new Error(`Failed to create company profile: ${profileError.message}`)
      }

      console.log('Company profile created successfully!')

      // STEP 3: Redirect to company dashboard
      router.push('/company/dashboard')
      router.refresh()

    } catch (err: any) {
      console.error('Signup error:', err)
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Company Signup
            </h1>
            <p className="text-gray-600">
              Create your company account to start receiving applications
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                placeholder="TechStart Ventures"
              />
            </div>

            {/* Company ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company ID *
              </label>
              <input
                type="text"
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                placeholder="techstart-ventures"
              />
              <p className="text-xs text-gray-500 mt-1">
                Unique identifier for your company (lowercase, no spaces)
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                placeholder="contact@techstart.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                placeholder="Min. 6 characters"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                placeholder="Confirm your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Creating Account...' : 'Create Company Account'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/company/auth/login" className="text-blue-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Looking for funding?{' '}
              <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
                Create applicant account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
