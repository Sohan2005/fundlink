'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Navigation from '@/components/Navigation'
import Link from 'next/link'

interface Application {
  id: number
  company_name: string | null
  amount_needed: number | null
  status: string | null
  created_at: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      setApplications(data || [])
      setLoading(false)
    }
    fetchApplications()
  }, [user])

  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name
    return user?.email?.split('@')[0] || 'there'
  }

  const totalApps = applications.length
  const approved = applications.filter(a => a.status === 'approved').length
  const underReview = applications.filter(a => a.status === 'under_review' || a.status === 'Under Review').length

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatAmount = (amount: number | null) => {
    if (!amount) return 'N/A'
    return `$${amount.toLocaleString()}`
  }

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-700'
      case 'under_review': case 'under review': return 'bg-yellow-100 text-yellow-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-blue-100 text-blue-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {getDisplayName()} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here's an overview of your funding journey on FundLink.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">Total Applications</p>
            <p className="text-4xl font-bold text-gray-900">{loading ? '—' : totalApps}</p>
            <p className="text-sm text-gray-400 mt-1">All funding requests you've submitted.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-2">Approved</p>
            <p className="text-4xl font-bold text-gray-900">{loading ? '—' : approved}</p>
            <p className="text-sm text-gray-400 mt-1">Applications approved for funding.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-2">Under Review</p>
            <p className="text-4xl font-bold text-gray-900">{loading ? '—' : underReview}</p>
            <p className="text-sm text-gray-400 mt-1">Currently being evaluated by companies.</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { href: '/companies', label: 'Browse Companies', icon: '🏢' },
            { href: '/apply', label: 'New Application', icon: '📝' },
            { href: '/dashboard/matches', label: 'Smart Matches', icon: '⚡' },
            { href: '/dashboard/profile/edit', label: 'Edit Profile', icon: '👤' },
          ].map(action => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center hover:shadow-md hover:border-blue-200 transition-all duration-150 group"
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{action.label}</p>
            </Link>
          ))}
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
            <Link href="/dashboard/applications" className="text-sm text-blue-600 hover:underline font-medium">
              View all
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-lg mb-4">No applications yet</p>
              <Link
                href="/companies"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                Browse Companies →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-medium">Company</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applications.map(app => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 text-sm font-medium text-gray-900">{app.company_name || 'Unknown'}</td>
                      <td className="py-3 text-sm text-gray-600">{formatAmount(app.amount_needed)}</td>
                      <td className="py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getStatusColor(app.status)}`}>
                          {app.status || 'Submitted'}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-gray-400">{formatDate(app.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Profile Completion Nudge */}
        <div className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold text-lg">Complete your profile</h3>
            <p className="text-blue-100 text-sm mt-1">A complete profile gets 3x more matches from companies.</p>
          </div>
          <Link
            href="/dashboard/profile/edit"
            className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            Complete Profile →
          </Link>
        </div>
      </div>
    </div>
  )
}