'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function Navigation() {
  const { user, signOut, loading } = useAuth()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  // role state: seeker = looking for funding, provider = offering funding
  const [activeRole, setActiveRole] = useState<'seeker' | 'provider'>('seeker')
  const [roleLoading, setRoleLoading] = useState(false)

  // load role from profiles
  useEffect(() => {
    if (!user) {
      setRoleLoading(false)
      return
    }

    const loadRole = async () => {
      setRoleLoading(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('active_role')
          .eq('id', user.id)
          .single()

        if (!error && data?.active_role) {
          setActiveRole(data.active_role === 'provider' ? 'provider' : 'seeker')
        } else {
          setActiveRole('seeker')
        }
      } catch (e) {
        console.error('Error loading active role', e)
      } finally {
        setRoleLoading(false)
      }
    }

    loadRole()
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    setIsProfileMenuOpen(false)
    router.push('/')
  }

  // toggle active role in profiles
  const toggleRole = async () => {
    if (!user) return
    const newRole: 'seeker' | 'provider' =
      activeRole === 'seeker' ? 'provider' : 'seeker'

    try {
      setRoleLoading(true)
      const { error } = await supabase
        .from('profiles')
        .update({ active_role: newRole })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating active_role', error)
        return
      }

      setActiveRole(newRole)
      setIsProfileMenuOpen(false)

      // send them to a sensible dashboard depending on role
      if (newRole === 'provider') {
        router.push('/dashboard') // later you can change to /company/dashboard
      } else {
        router.push('/dashboard')
      }
      router.refresh()
    } catch (e) {
      console.error('Error toggling role', e)
    } finally {
      setRoleLoading(false)
    }
  }

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get user's first name or fallback to email
  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0]
    }
    return user?.email?.split('@')[0] || 'User'
  }

  // Get user's initials for avatar
  const getInitials = () => {
    if (user?.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ')
      return names.length >= 2
        ? `${names[0][0]}${names[1][0]}`
        : names[0][0]
    }
    return user?.email?.[0]?.toUpperCase() || 'U'
  }

  return (
    <nav className="px-6 py-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent"
        >
          FundLink
        </Link>

        {/* Navigation Links & Auth */}
        <div className="flex items-center space-x-6">
          {/* Main Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/companies"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Browse Companies
            </Link>
            <Link
              href="/opportunities"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Opportunities
            </Link>
            <Link
              href="/success-stories"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Success Stories
            </Link>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            </div>
          )}

          {/* Not Authenticated */}
          {!loading && !user && (
            <div className="flex items-center space-x-3">
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-all"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Authenticated */}
          {!loading && user && (
            <div className="flex items-center space-x-4">
              {/* Apply button (for seekers primarily) */}
              {activeRole === 'seeker' && (
                <Link
                  href="/apply"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-all"
                >
                  Apply for Funding
                </Link>
              )}

              {/* Profile Menu */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
                    {getInitials()}
                  </div>
                  {/* Name & Chevron */}
                  <div className="hidden sm:flex items-center space-x-1">
                    <span className="text-gray-700 font-medium">
                      {getDisplayName()}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform duration-150 ${
                        isProfileMenuOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      {!roleLoading && (
                        <p className="text-xs text-blue-600 mt-1 font-medium">
                          {activeRole === 'provider'
                            ? '🔵 Funding Provider view'
                            : '🟢 Funding Seeker view'}
                        </p>
                      )}
                    </div>

                    {/* Role switcher */}
                    {!roleLoading && (
                      <button
                        onClick={toggleRole}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0014-7V5"
                          />
                        </svg>
                        {activeRole === 'provider'
                          ? 'Switch to Funding Seeker view'
                          : 'Switch to Funding Provider view'}
                      </button>
                    )}

                    {/* Menu Items */}
                    <div className="py-1 border-t border-gray-100">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/dashboard/applications"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        My Applications
                      </Link>
                      <Link
                        href="/dashboard/matches"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Smart Matches
                      </Link>
                      <Link
                        href="/dashboard/messages"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Messages
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Settings
                      </Link>
                    </div>

                    {/* Sign Out */}
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
