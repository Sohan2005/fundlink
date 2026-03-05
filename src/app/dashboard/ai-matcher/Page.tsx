'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { sampleCompanies, Company } from '@/lib/companiesData'
import {
  getTopMatches,
  type UserProfile,
  type CompanyMatch,
} from '@/lib/matchingAlgorithm-3'

interface ProfileRow {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  location: string | null
  current_role: string | null
  company: string | null
  years_of_experience: string | null
  linkedin_url: string | null
  website_url: string | null
  funding_stage: string[] | null
  industries: string[] | null
  funding_amount_min: number | null
  funding_amount_max: number | null
  skills: string[] | null
  bio: string | null
  profile_completion: number | null
  is_complete: boolean | null
}

export default function AiMatcherPage() {
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [matches, setMatches] = useState<CompanyMatch[]>([])

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const loadData = async () => {
      setLoading(true)
      setError(null)

      try {
        // 1) Load profile from Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select(
            'id, full_name, email, phone, location, current_role, company, years_of_experience, linkedin_url, website_url, funding_stage, industries, funding_amount_min, funding_amount_max, skills, bio, profile_completion, is_complete'
          )
          .eq('id', user.id)
          .single()

        if (error) throw error
        const row = data as ProfileRow

        const userProfile: UserProfile = {
          id: row.id,
          full_name: row.full_name,
          email: row.email,
          phone: row.phone,
          location: row.location,
          current_role: row.current_role,
          company: row.company,
          years_of_experience: row.years_of_experience,
          linkedin_url: row.linkedin_url,
          website_url: row.website_url,
          funding_stage: row.funding_stage,
          industries: row.industries,
          funding_amount_min: row.funding_amount_min,
          funding_amount_max: row.funding_amount_max,
          skills: row.skills,
          bio: row.bio,
          profile_completion: row.profile_completion ?? 0,
          is_complete: row.is_complete ?? false,
        }

        setProfile(userProfile)

        // 2) Compute matches using your existing algorithm
        const topMatches = getTopMatches(userProfile, sampleCompanies, 6)
        setMatches(topMatches)
      } catch (e: any) {
        console.error(e)
        setError('There was a problem running the AI matcher.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-10">
          <p className="text-gray-700">
            Please sign in to use the AI matcher.
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              AI Company Finder
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              We analyze your profile and funding needs to suggest the best
              companies on FundLink, plus ideas for external outreach.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 text-sm">
                Analyzing your profile and finding matches…
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Profile summary */}
            {profile && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                  Profile signal used by AI
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="text-gray-900">
                      {profile.location || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Funding stage</p>
                    <p className="text-gray-900">
                      {profile.funding_stage && profile.funding_stage.length > 0
                        ? profile.funding_stage.join(', ')
                        : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Preferred industries</p>
                    <p className="text-gray-900">
                      {profile.industries && profile.industries.length > 0
                        ? profile.industries.join(', ')
                        : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Funding range</p>
                    <p className="text-gray-900">
                      {profile.funding_amount_min !== null &&
                      profile.funding_amount_max !== null
                        ? `$${profile.funding_amount_min.toLocaleString()} - $${profile.funding_amount_max.toLocaleString()}`
                        : 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* In-platform matches */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900">
                  Top matches on FundLink
                </h2>
                <p className="text-xs text-gray-500">
                  Ranked using your industries, funding range, and stage
                  preferences.
                </p>
              </div>

              {matches.length === 0 ? (
                <p className="text-sm text-gray-500">
                  We couldn’t find strong matches yet. Try completing more of
                  your profile or adjusting your funding range.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matches.map(match => (
                    <CompanyMatchCard key={match.company.id} match={match} />
                  ))}
                </div>
              )}
            </div>

            {/* External suggestions (conceptual AI section) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">
                Additional suggestions outside FundLink
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Based on your profile, here are examples of external funding
                partners and how to reach out. In a future version, this
                assistant will search live data and surface verified contacts.
              </p>

              <ul className="space-y-3 text-sm text-gray-800">
                <li>
                  • Look for sector‑specific funds matching your industries
                  (e.g. “{profile?.industries?.[0] || 'Climate/AI'} focused
                  seed funds”) and target roles like{' '}
                  <span className="font-medium">
                    Partner, Principal, Investment Manager
                  </span>
                  .
                </li>
                <li>
                  • Use each fund’s website “Apply” or “Portfolio / Contact”
                  page. Prefer generic inboxes like{' '}
                  <span className="font-medium">investments@</span> or{' '}
                  <span className="font-medium">pitch@</span> over personal
                  emails for a first touch.
                </li>
                <li>
                  • On LinkedIn, search for investors whose titles include your
                  stage (for example, “Seed investor”, “Pre‑seed partner”) and
                  mention your funding range and sector in the first two lines
                  of your message.
                </li>
              </ul>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function CompanyMatchCard({ match }: { match: CompanyMatch }) {
  const { company, matchPercentage, matchStrength, matchReasons } = match

  const badgeColor =
    matchStrength === 'Perfect Match'
      ? 'bg-green-50 text-green-700'
      : matchStrength === 'Great Match'
      ? 'bg-blue-50 text-blue-700'
      : matchStrength === 'Good Match'
      ? 'bg-amber-50 text-amber-700'
      : 'bg-gray-100 text-gray-700'

  return (
    <div className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow bg-white">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-2xl">{company.logo}</p>
          <h3 className="mt-1 text-sm font-semibold text-gray-900">
            {company.name}
          </h3>
          <p className="text-xs text-gray-500">
            {company.industry} • {company.location}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold text-gray-900">
            {matchPercentage}%
          </p>
          <span
            className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${badgeColor}`}
          >
            {matchStrength}
          </span>
        </div>
      </div>

      <ul className="mt-3 space-y-1.5 text-xs text-gray-700">
        {matchReasons.map(reason => (
          <li key={reason}>• {reason}</li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-[11px] text-gray-500">
          Typical cheque:{' '}
          <span className="font-medium">
            ${company.fundingRangeMin.toLocaleString()} – $
            {company.fundingRangeMax.toLocaleString()}
          </span>
        </p>
        <Link
          href={`/companies/${company.id}`}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          View & apply →
        </Link>
      </div>
    </div>
  )
}
