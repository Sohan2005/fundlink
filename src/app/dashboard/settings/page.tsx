'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const [notifications, setNotifications] = useState({
    newMatches: true,
    applicationUpdates: true,
    weeklyDigest: false,
    marketingEmails: false,
  })

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showFundingAmount: false,
  })

  const [saved, setSaved] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const toggle = (
    group: 'notifications' | 'privacy',
    key: string
  ) => {
    if (group === 'notifications') {
      setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }))
    } else {
      setPrivacy(prev => ({ ...prev, [key]: !prev[key as keyof typeof privacy] }))
    }
  }

  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${on ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${on ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account preferences and notifications.</p>
        </div>

        {/* Account Info */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Account</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user?.user_metadata?.full_name
                ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
                : user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.user_metadata?.full_name || 'No name set'}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="/dashboard/profile/edit"
              className="text-center px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Edit Profile
            </a>
            <button
              onClick={handleSignOut}
              className="text-center px-4 py-2.5 border border-red-200 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Notifications</h2>
          <p className="text-sm text-gray-400 mb-5">Choose what updates you want to receive.</p>
          <div className="space-y-4">
            {[
              { key: 'newMatches', label: 'New Smart Matches', desc: 'When FundLink finds companies that match your profile' },
              { key: 'applicationUpdates', label: 'Application Updates', desc: 'Status changes on your funding applications' },
              { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'A weekly summary of new opportunities' },
              { key: 'marketingEmails', label: 'Product Updates & Tips', desc: 'News about FundLink features and funding tips' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <Toggle
                  on={notifications[item.key as keyof typeof notifications]}
                  onClick={() => toggle('notifications', item.key)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Privacy */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Privacy</h2>
          <p className="text-sm text-gray-400 mb-5">Control who can see your information.</p>
          <div className="space-y-4">
            {[
              { key: 'profileVisible', label: 'Public Profile', desc: 'Allow companies to discover and view your profile' },
              { key: 'showFundingAmount', label: 'Show Funding Amount', desc: 'Display your target funding amount on your profile' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <Toggle
                  on={privacy[item.key as keyof typeof privacy]}
                  onClick={() => toggle('privacy', item.key)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Save */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Save Preferences
          </button>
          {saved && (
            <span className="text-green-600 text-sm font-medium animate-pulse">✓ Saved successfully!</span>
          )}
        </div>

        {/* Danger Zone */}
        <section className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-red-600 mb-1">Danger Zone</h2>
          <p className="text-sm text-gray-400 mb-4">These actions are permanent and cannot be undone.</p>
          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="px-4 py-2.5 border border-red-300 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors"
            >
              Delete Account
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-700 font-medium mb-3">
                Are you sure? This will permanently delete your account, profile, and all applications.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors">
                  Yes, Delete My Account
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
