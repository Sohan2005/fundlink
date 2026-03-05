'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { User, Building2, Settings, LogOut, Plus, ChevronDown } from 'lucide-react'

export function RoleSwitcher() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<any>(null)
  const [hasCompanyProfile, setHasCompanyProfile] = useState(false)
  const [currentRole, setCurrentRole] = useState<'applicant' | 'company'>('applicant')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  async function loadUserData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      setUser(user)

      // Get user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setCurrentRole(profileData.user_role === 'company' ? 'company' : 'applicant')
      }

      // Check if user has company profile
      const { data: companyData } = await supabase
        .from('company_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      setHasCompanyProfile(!!companyData)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function switchRole(newRole: 'applicant' | 'company') {
    if (!user) return

    try {
      // Update user role in profiles table
      await supabase
        .from('profiles')
        .update({ user_role: newRole })
        .eq('id', user.id)

      setCurrentRole(newRole)
      setIsOpen(false)

      // Redirect to appropriate dashboard
      if (newRole === 'company') {
        router.push('/company/dashboard')
      } else {
        router.push('/dashboard')
      }
      router.refresh()
    } catch (error) {
      console.error('Error switching role:', error)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading || !user) return null

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
          {user.email?.[0].toUpperCase()}
        </div>
        <span className="hidden sm:inline text-sm font-medium text-gray-700">
          {user.email?.split('@')[0]}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-900">{user.email}</p>
              <p className="text-xs text-gray-500 mt-1">
                Current: {currentRole === 'company' ? 'Company View' : 'Applicant View'}
              </p>
            </div>

            {/* Role Switcher */}
            <div className="py-2">
              {/* Switch to Applicant */}
              {hasCompanyProfile && currentRole !== 'applicant' && (
                <button
                  onClick={() => switchRole('applicant')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-3"
                >
                  <User className="w-4 h-4" />
                  <span>Switch to Applicant View</span>
                </button>
              )}

              {/* Switch to Company */}
              {hasCompanyProfile && currentRole !== 'company' && (
                <button
                  onClick={() => switchRole('company')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-3"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Switch to Company View</span>
                </button>
              )}

              {/* Add Company Profile */}
              {!hasCompanyProfile && (
                <button
                  onClick={() => {
                    setIsOpen(false)
                    router.push('/company/auth/signup')
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-3 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Company Profile</span>
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Settings & Sign Out */}
            <button
              onClick={() => {
                setIsOpen(false)
                router.push('/settings')
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
