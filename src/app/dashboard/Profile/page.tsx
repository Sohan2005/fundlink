'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  full_name: string
  bio: string
  location: string
  website: string
  linkedin_url: string
  github_url: string
  experience_level: string
  industry: string
  current_role: string
  company: string
  education: string
  funding_interests: string[]
  preferred_amount_min: number | null
  preferred_amount_max: number | null
  project_stage: string
  timeline_preference: string
  technical_skills: string[]
  industry_expertise: string[]
  languages: string[]
  portfolio_projects: any[]
  created_at: string
  updated_at: string
}

export default function ProfileViewPage() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadProfile()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [user, authLoading])

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error) {
        throw error
      }

      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const formatAmount = (amount: number | null) => {
    if (!amount) return null
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount.toLocaleString()}`
  }

  const getProfileCompleteness = () => {
    if (!profile) return 0
    
    const requiredFields = [
      profile.full_name,
      profile.bio,
      profile.experience_level,
      profile.industry,
      profile.project_stage,
      profile.funding_interests?.length > 0,
      profile.technical_skills?.length > 0
    ]
    
    const completed = requiredFields.filter(field => !!field).length
    return Math.round((completed / requiredFields.length) * 100)
  }

  const getInitials = () => {
    if (profile?.full_name) {
      const names = profile.full_name.split(' ')
      return names.length >= 2 
        ? `${names[0][0]}${names[1][0]}`
        : names[0][0]
    }
    return user?.email?.[0]?.toUpperCase() || 'U'
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navigation />
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-xl text-gray-600 mb-8">
            You need to be signed in to view your profile.
          </p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            It looks like you haven't created your profile yet.
          </p>
          <Link 
            href="/dashboard/profile/edit"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            Create Your Profile
          </Link>
        </div>
      </div>
    )
  }

  const completeness = getProfileCompleteness()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">Your professional funding profile</p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/dashboard/profile/edit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              Edit Profile
            </Link>
            <Link
              href="/apply"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
            >
              Apply for Funding
            </Link>
          </div>
        </div>

        {/* Profile Completion Alert */}
        {completeness < 100 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-amber-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Profile {completeness}% complete. Complete your profile to get better funding matches!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                  {getInitials()}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{profile.full_name}</h2>
                  {profile.current_role && (
                    <p className="text-xl text-gray-600 mb-1">
                      {profile.current_role}
                      {profile.company && ` at ${profile.company}`}
                    </p>
                  )}
                  {profile.location && (
                    <p className="text-gray-600 mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {profile.location}
                    </p>
                  )}
                  <p className="text-gray-700 leading-relaxed">{profile.bio}</p>

                  {/* Social Links */}
                  <div className="flex space-x-4 mt-4">
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        🌐 Website
                      </a>
                    )}
                    {profile.linkedin_url && (
                      <a
                        href={profile.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        💼 LinkedIn
                      </a>
                    )}
                    {profile.github_url && (
                      <a
                        href={profile.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        💻 GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Skills */}
            {profile.technical_skills && profile.technical_skills.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Technical Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {profile.technical_skills.map((skill, index) => (
                    <span key={index} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Industry Expertise & Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {profile.industry_expertise && profile.industry_expertise.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Industry Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.industry_expertise.map((expertise, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                        {expertise}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.languages && profile.languages.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((language, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Portfolio Projects */}
            {profile.portfolio_projects && profile.portfolio_projects.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Portfolio Projects</h3>
                <div className="space-y-6">
                  {profile.portfolio_projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-xl font-semibold text-gray-900">{project.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === 'completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {project.status.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech: string, techIndex: number) => (
                            <span key={techIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          View Project →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Completeness</span>
                    <span className="font-medium">{completeness}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full" 
                      style={{ width: `${completeness}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Experience Level</span>
                    <span className="font-medium text-gray-900">{profile.experience_level || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Industry</span>
                    <span className="font-medium text-gray-900">{profile.industry || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Project Stage</span>
                    <span className="font-medium text-gray-900">{profile.project_stage || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Funding Preferences */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Funding Preferences</h3>
              <div className="space-y-4">
                {(profile.preferred_amount_min || profile.preferred_amount_max) && (
                  <div>
                    <span className="text-sm text-gray-600">Preferred Range</span>
                    <div className="font-semibold text-green-600">
                      {formatAmount(profile.preferred_amount_min)} - {formatAmount(profile.preferred_amount_max)}
                    </div>
                  </div>
                )}
                
                {profile.timeline_preference && (
                  <div>
                    <span className="text-sm text-gray-600">Timeline</span>
                    <div className="font-medium text-gray-900">{profile.timeline_preference}</div>
                  </div>
                )}

                {profile.funding_interests && profile.funding_interests.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600 block mb-2">Interested In</span>
                    <div className="space-y-2">
                      {profile.funding_interests.map((interest, index) => (
                        <div key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                          {interest}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Education */}
            {profile.education && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{profile.education}</p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Ready to Apply?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Your profile is {completeness}% complete. Companies can view your full background when you apply.
              </p>
              <div className="space-y-3">
                <Link
                  href="/apply"
                  className="block w-full bg-white text-blue-700 text-center py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
                >
                  Apply for Funding
                </Link>
                <Link
                  href="/companies"
                  className="block w-full border border-white text-white text-center py-2 rounded-lg font-medium hover:bg-white hover:text-blue-700 transition-colors duration-200"
                >
                  Browse Companies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}