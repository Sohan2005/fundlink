'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { sampleCompanies } from '@/lib/companiesData'
import { getTopMatches, CompanyMatch, UserProfile } from '@/lib/matchingAlgorithm'

export default function SmartMatchesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [matches, setMatches] = useState<CompanyMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/dashboard/matches')
      return
    }

    loadProfileAndMatches()
  }, [user, router])

  async function loadProfileAndMatches() {
    try {
      setLoading(true)
      setError(null)

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (profileError) throw profileError

      if (!profileData) {
        setError('Profile not found. Please complete your profile first.')
        setLoading(false)
        return
      }

      setProfile(profileData)

      // Calculate matches using the algorithm
      const calculatedMatches = getTopMatches(profileData, sampleCompanies, 12)
      setMatches(calculatedMatches)

      setLoading(false)
    } catch (err: any) {
      console.error('Error loading matches:', err)
      setError(err.message || 'Failed to load smart matches')
      setLoading(false)
    }
  }

  function formatFundingRange(min: number, max: number): string {
    const formatNum = (num: number) => {
      if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`
      if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`
      return `$${num}`
    }
    return `${formatNum(min)} - ${formatNum(max)}`
  }

  function getMatchColor(percentage: number): string {
    if (percentage >= 85) return 'text-green-600 bg-green-50 border-green-200'
    if (percentage >= 70) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (percentage >= 50) return 'text-purple-600 bg-purple-50 border-purple-200'
    return 'text-gray-600 bg-gray-50 border-gray-200'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-gray-600">Finding your perfect matches...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-black mb-2">Smart Matches</h1>
          <p className="text-gray-600">
            Companies perfectly matched to your profile and funding needs
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <Link 
              href="/dashboard/profile/edit"
              className="mt-2 inline-block text-red-600 hover:text-red-800 font-medium"
            >
              Complete your profile →
            </Link>
          </div>
        )}

        {!error && matches.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-semibold text-black mb-2">
              No matches yet
            </h2>
            <p className="text-gray-600 mb-6">
              Complete your profile to get personalized company recommendations
            </p>
            <Link
              href="/dashboard/profile/edit"
              className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Complete Profile
            </Link>
          </div>
        )}

        {/* Matches Grid */}
        {matches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div
                key={match.company.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
              >
                {/* Match Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{match.company.logo}</div>
                  <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getMatchColor(match.matchPercentage)}`}>
                    {match.matchPercentage}% Match
                  </div>
                </div>

                {/* Company Info */}
                <h3 className="text-xl font-semibold text-black mb-2">
                  {match.company.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {match.company.description}
                </p>

                {/* Match Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Industry:</span>
                    <span>{match.company.industry}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Funding:</span>
                    <span>{formatFundingRange(match.company.fundingRangeMin, match.company.fundingRangeMax)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Response:</span>
                    <span>{match.company.responseTime}</span>
                  </div>
                </div>

                {/* Match Reasons */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 mb-2">Why this matches you:</p>
                  <ul className="space-y-1">
                    {match.matchReasons.map((reason, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Match Strength */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">{match.matchStrength}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-xs">
                      <span className="text-gray-500">Industry:</span>
                      <span className="ml-1 font-medium">{match.breakdown.industryMatch}%</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-500">Funding:</span>
                      <span className="ml-1 font-medium">{match.breakdown.fundingMatch}%</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-500">Experience:</span>
                      <span className="ml-1 font-medium">{match.breakdown.experienceMatch}%</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-500">Stage:</span>
                      <span className="ml-1 font-medium">{match.breakdown.stageMatch}%</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/companies/${match.company.id}`}
                    className="flex-1 px-4 py-2 bg-black text-white text-center rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/apply?company=${match.company.id}`}
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 text-black text-center rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
