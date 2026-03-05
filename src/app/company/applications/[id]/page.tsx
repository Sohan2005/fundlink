'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

interface Application {
  id: string
  full_name: string
  email: string
  phone: string
  location: string
  project_name: string
  project_description: string
  industry: string
  stage: string
  funding_amount: number
  funding_purpose: string
  timeline: string
  website: string | null
  linkedin_url: string | null
  pitch_deck_url: string | null
  additional_info: string | null
  status: string
  submitted_at: string
  reviewed_by: string | null
  reviewed_at: string | null
  review_notes: string | null
}

export default function ApplicationReviewPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const applicationId = params.id as string

  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/company/auth/login')
      return
    }

    loadApplication()
  }, [user, applicationId, router])

  async function loadApplication() {
    try {
      setLoading(true)
      setError(null)

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('id', user?.id)
        .single()

      if (profileError) throw profileError

      if (profile.user_role !== 'company_admin') {
        router.push('/dashboard')
        return
      }

      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single()

      if (appError) throw appError

      setApplication(appData)
      setReviewNotes(appData.review_notes || '')
      setLoading(false)

    } catch (err: any) {
      console.error('Error loading application:', err)
      setError(err.message || 'Failed to load application')
      setLoading(false)
    }
  }

  async function handleUpdateStatus(newStatus: string) {
    if (!application) return

    try {
      setUpdating(true)
      setError(null)

      const { error: updateError } = await supabase
        .from('applications')
        .update({
          status: newStatus,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes || null
        })
        .eq('id', applicationId)

      if (updateError) throw updateError

      await loadApplication()
      setUpdating(false)
      alert(`Application ${newStatus.replace('_', ' ')}!`)

    } catch (err: any) {
      console.error('Error updating status:', err)
      setError(err.message || 'Failed to update status')
      setUpdating(false)
    }
  }

  function formatAmount(amount: number | null): string {
    if (!amount) return '$0'
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount.toLocaleString()}`
  }

  function formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !application) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-600">Application not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/company/dashboard"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Application Review
              </h1>
              <p className="text-gray-600">
                Submitted {formatDate(application.submitted_at)}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(application.status)}`}>
              {application.status.replace('_', ' ').toUpperCase()}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Applicant Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="text-gray-900 font-medium">{application.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-gray-900 font-medium">{application.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="text-gray-900 font-medium">{application.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="text-gray-900 font-medium">{application.location}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Project Details
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Project Name</p>
                  <p className="text-gray-900 font-medium text-lg">{application.project_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-gray-900">{application.project_description}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Funding Request
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Amount</p>
                  <p className="text-gray-900 font-bold text-2xl text-green-600">
                    {formatAmount(application.funding_amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Purpose</p>
                  <p className="text-gray-900">{application.funding_purpose}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Review Notes
              </h3>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Add notes..."
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleUpdateStatus('under_review')}
                  disabled={updating}
                  className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 font-medium"
                >
                  Under Review
                </button>
                <button
                  onClick={() => handleUpdateStatus('approved')}
                  disabled={updating}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus('rejected')}
                  disabled={updating}
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 font-medium"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
