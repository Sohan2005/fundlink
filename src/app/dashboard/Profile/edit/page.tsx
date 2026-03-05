'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

interface ProfileData {
  // Basic Info
  full_name: string
  bio: string
  location: string
  website: string
  linkedin_url: string
  github_url: string
  
  // Professional Background
  experience_level: string
  industry: string
  current_role: string
  company: string
  education: string
  
  // Funding Preferences
  funding_interests: string[]
  preferred_amount_min: number | ''
  preferred_amount_max: number | ''
  project_stage: string
  timeline_preference: string
  
  // Skills & Expertise
  technical_skills: string[]
  industry_expertise: string[]
  languages: string[]
  
  // Portfolio Projects
  portfolio_projects: {
    title: string
    description: string
    technologies: string[]
    link: string
    status: string
  }[]
}

interface FormState {
  isLoading: boolean
  isSaving: boolean
  error: string | null
  success: boolean
}

export default function ProfileBuilderPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState(1)
  const totalSections = 5

  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    bio: '',
    location: '',
    website: '',
    linkedin_url: '',
    github_url: '',
    experience_level: '',
    industry: '',
    current_role: '',
    company: '',
    education: '',
    funding_interests: [],
    preferred_amount_min: '',
    preferred_amount_max: '',
    project_stage: '',
    timeline_preference: '',
    technical_skills: [],
    industry_expertise: [],
    languages: [],
    portfolio_projects: []
  })

  const [formState, setFormState] = useState<FormState>({
    isLoading: true,
    isSaving: false,
    error: null,
    success: false
  })

  // Load existing profile data
  useEffect(() => {
    if (user) {
      loadProfileData()
    } else if (!authLoading) {
      setFormState(prev => ({ ...prev, isLoading: false }))
    }
  }, [user, authLoading])

  const loadProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      if (data) {
        setProfileData({
          full_name: data.full_name || user?.user_metadata?.full_name || '',
          bio: data.bio || '',
          location: data.location || '',
          website: data.website || '',
          linkedin_url: data.linkedin_url || '',
          github_url: data.github_url || '',
          experience_level: data.experience_level || '',
          industry: data.industry || '',
          current_role: data.current_role || '',
          company: data.company || '',
          education: data.education || '',
          funding_interests: data.funding_interests || [],
          preferred_amount_min: data.preferred_amount_min || '',
          preferred_amount_max: data.preferred_amount_max || '',
          project_stage: data.project_stage || '',
          timeline_preference: data.timeline_preference || '',
          technical_skills: data.technical_skills || [],
          industry_expertise: data.industry_expertise || [],
          languages: data.languages || [],
          portfolio_projects: data.portfolio_projects || []
        })
      } else {
        // Pre-fill with user metadata if available
        setProfileData(prev => ({
          ...prev,
          full_name: user?.user_metadata?.full_name || ''
        }))
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      setFormState(prev => ({ 
        ...prev, 
        error: 'Failed to load profile data' 
      }))
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
    clearError()
  }

  const handleArrayChange = (field: keyof ProfileData, values: string[]) => {
    setProfileData(prev => ({ ...prev, [field]: values }))
    clearError()
  }

  const clearError = () => {
    if (formState.error) {
      setFormState(prev => ({ ...prev, error: null }))
    }
  }

  const validateSection = (section: number): boolean => {
    switch (section) {
      case 1: // Basic Info
        return !!(profileData.full_name.trim() && profileData.bio.trim())
      case 2: // Professional Background
        return !!(profileData.experience_level && profileData.industry)
      case 3: // Funding Preferences
        return !!(profileData.funding_interests.length > 0 && profileData.project_stage)
      case 4: // Skills
        return !!(profileData.technical_skills.length > 0)
      case 5: // Portfolio
        return true // Optional section
      default:
        return false
    }
  }

  const nextSection = () => {
    if (validateSection(currentSection)) {
      setCurrentSection(prev => Math.min(totalSections, prev + 1))
    } else {
      setFormState(prev => ({ 
        ...prev, 
        error: 'Please fill in the required fields before continuing' 
      }))
    }
  }

  const prevSection = () => {
    setCurrentSection(prev => Math.max(1, prev - 1))
    clearError()
  }

  const saveProfile = async () => {
    setFormState(prev => ({ ...prev, isSaving: true, error: null }))

    try {
      const profilePayload = {
        id: user?.id,
        full_name: profileData.full_name.trim(),
        bio: profileData.bio.trim(),
        location: profileData.location.trim(),
        website: profileData.website.trim(),
        linkedin_url: profileData.linkedin_url.trim(),
        github_url: profileData.github_url.trim(),
        experience_level: profileData.experience_level,
        industry: profileData.industry,
        current_role: profileData.current_role.trim(),
        company: profileData.company.trim(),
        education: profileData.education.trim(),
        funding_interests: profileData.funding_interests,
        preferred_amount_min: profileData.preferred_amount_min || null,
        preferred_amount_max: profileData.preferred_amount_max || null,
        project_stage: profileData.project_stage,
        timeline_preference: profileData.timeline_preference,
        technical_skills: profileData.technical_skills,
        industry_expertise: profileData.industry_expertise,
        languages: profileData.languages,
        portfolio_projects: profileData.portfolio_projects,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('profiles')
        .upsert([profilePayload], { onConflict: 'id' })

      if (error) {
        throw error
      }

      setFormState(prev => ({ 
        ...prev, 
        success: true, 
        isSaving: false 
      }))

      // Redirect to dashboard after success
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)

    } catch (error) {
      setFormState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to save profile',
        isSaving: false 
      }))
    }
  }

  const addSkill = (category: 'technical_skills' | 'industry_expertise' | 'languages', skill: string) => {
    if (skill.trim() && !profileData[category].includes(skill.trim())) {
      handleArrayChange(category, [...profileData[category], skill.trim()])
    }
  }

  const removeSkill = (category: 'technical_skills' | 'industry_expertise' | 'languages', skill: string) => {
    handleArrayChange(category, profileData[category].filter(s => s !== skill))
  }

  const addProject = () => {
    const newProject = {
      title: '',
      description: '',
      technologies: [],
      link: '',
      status: 'completed'
    }
    setProfileData(prev => ({
      ...prev,
      portfolio_projects: [...prev.portfolio_projects, newProject]
    }))
  }

  const updateProject = (index: number, field: string, value: any) => {
    const updatedProjects = [...profileData.portfolio_projects]
    updatedProjects[index] = { ...updatedProjects[index], [field]: value }
    setProfileData(prev => ({ ...prev, portfolio_projects: updatedProjects }))
  }

  const removeProject = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      portfolio_projects: prev.portfolio_projects.filter((_, i) => i !== index)
    }))
  }

  const getCompletionPercentage = () => {
    const weights = {
      section1: 25, // Basic Info
      section2: 25, // Professional Background  
      section3: 25, // Funding Preferences
      section4: 15, // Skills
      section5: 10  // Portfolio (bonus)
    }

    let completion = 0
    
    if (validateSection(1)) completion += weights.section1
    if (validateSection(2)) completion += weights.section2
    if (validateSection(3)) completion += weights.section3
    if (validateSection(4)) completion += weights.section4
    if (profileData.portfolio_projects.length > 0) completion += weights.section5

    return Math.min(100, completion)
  }

  if (authLoading || formState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
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
            You need to be signed in to build your profile.
          </p>
        </div>
      </div>
    )
  }

  if (formState.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navigation />
        <div className="max-w-2xl mx-auto px-6 sm:px-8 py-20 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Profile Updated Successfully!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your professional profile is now complete and ready to attract funding partners.
            </p>
            <p className="text-gray-600">Redirecting to your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  const industries = [
    'Technology', 'Healthcare', 'Education', 'Finance', 'E-commerce', 
    'Sustainability', 'Creative', 'Social Impact', 'AI/ML', 'Blockchain',
    'Gaming', 'Real Estate', 'Transportation', 'Food & Beverage', 'Other'
  ]

  const fundingInterestOptions = [
    'Seed Funding', 'Series A', 'Series B+', 'Angel Investment', 'Grant Funding',
    'Crowdfunding', 'Government Funding', 'Corporate Investment', 'Venture Capital'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Build Your Professional Profile
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Create a compelling profile that attracts the right funding partners
          </p>
          
          {/* Completion Progress */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Profile Completion</span>
              <span className="text-sm font-bold text-blue-600">{getCompletionPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Section Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {[1, 2, 3, 4, 5].map((section) => (
              <div key={section} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 ${
                  section <= currentSection 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {section}
                </div>
                {section < 5 && (
                  <div className={`w-12 h-1 mx-2 transition-all duration-200 ${
                    section < currentSection ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-gray-600">
              {currentSection === 1 ? 'Basic Information' :
               currentSection === 2 ? 'Professional Background' :
               currentSection === 3 ? 'Funding Preferences' :
               currentSection === 4 ? 'Skills & Expertise' :
               'Portfolio Projects'}
            </span>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <form className="p-8">
            {/* Error Message */}
            {formState.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-medium text-red-800">{formState.error}</p>
                </div>
              </div>
            )}

            {/* Section 1: Basic Information */}
            {currentSection === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={profileData.full_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                      placeholder="City, State/Country"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Professional Bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical text-gray-900 placeholder-gray-400"
                    placeholder="Tell companies about yourself, your background, and what drives you as an entrepreneur..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Website/Portfolio
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={profileData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      name="linkedin_url"
                      value={profileData.linkedin_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Professional Background */}
            {currentSection === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Background</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Experience Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="experience_level"
                      value={profileData.experience_level}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="">Select experience level</option>
                      <option value="First-time entrepreneur">First-time entrepreneur</option>
                      <option value="Some startup experience">Some startup experience</option>
                      <option value="Experienced entrepreneur">Experienced entrepreneur</option>
                      <option value="Serial entrepreneur">Serial entrepreneur</option>
                      <option value="Corporate background">Corporate background</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Primary Industry <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="industry"
                      value={profileData.industry}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="">Select industry</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Current Role
                    </label>
                    <input
                      type="text"
                      name="current_role"
                      value={profileData.current_role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                      placeholder="e.g., Founder & CEO, CTO, Product Manager"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Current Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={profileData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                      placeholder="Company name or 'Seeking funding'"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Education Background
                  </label>
                  <textarea
                    name="education"
                    value={profileData.education}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical text-gray-900 placeholder-gray-400"
                    placeholder="Degrees, certifications, relevant courses..."
                  />
                </div>
              </div>
            )}

            {/* Section 3: Funding Preferences */}
            {currentSection === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Funding Preferences</h2>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Types of Funding Interested In <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {fundingInterestOptions.map((option) => (
                      <label key={option} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profileData.funding_interests.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleArrayChange('funding_interests', [...profileData.funding_interests, option])
                            } else {
                              handleArrayChange('funding_interests', profileData.funding_interests.filter(item => item !== option))
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Preferred Funding Range (Min)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-lg">$</span>
                      </div>
                      <input
                        type="number"
                        name="preferred_amount_min"
                        value={profileData.preferred_amount_min}
                        onChange={handleInputChange}
                        min="0"
                        step="1000"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                        placeholder="10000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Preferred Funding Range (Max)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-lg">$</span>
                      </div>
                      <input
                        type="number"
                        name="preferred_amount_max"
                        value={profileData.preferred_amount_max}
                        onChange={handleInputChange}
                        min="0"
                        step="1000"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                        placeholder="100000"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Current Project Stage <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="project_stage"
                      value={profileData.project_stage}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="">Select project stage</option>
                      <option value="Idea Stage">Idea Stage</option>
                      <option value="MVP Development">MVP Development</option>
                      <option value="Beta Testing">Beta Testing</option>
                      <option value="Early Customers">Early Customers</option>
                      <option value="Market Ready">Market Ready</option>
                      <option value="Scaling">Scaling</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Preferred Timeline
                    </label>
                    <select
                      name="timeline_preference"
                      value={profileData.timeline_preference}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="">Select timeline</option>
                      <option value="ASAP">ASAP (Urgent)</option>
                      <option value="1-3 months">1-3 months</option>
                      <option value="3-6 months">3-6 months</option>
                      <option value="6-12 months">6-12 months</option>
                      <option value="1+ years">1+ years</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: Skills & Expertise */}
            {currentSection === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills & Expertise</h2>

                {/* Technical Skills */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Technical Skills <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profileData.technical_skills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill('technical_skills', skill)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a technical skill (e.g., React, Python, AI/ML)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const input = e.target as HTMLInputElement
                          addSkill('technical_skills', input.value)
                          input.value = ''
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement
                        addSkill('technical_skills', input.value)
                        input.value = ''
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Industry Expertise */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Industry Expertise
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profileData.industry_expertise.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill('industry_expertise', skill)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add industry expertise (e.g., Healthcare, Fintech, E-commerce)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const input = e.target as HTMLInputElement
                          addSkill('industry_expertise', input.value)
                          input.value = ''
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement
                        addSkill('industry_expertise', input.value)
                        input.value = ''
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Languages
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profileData.languages.map((language, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        {language}
                        <button
                          type="button"
                          onClick={() => removeSkill('languages', language)}
                          className="ml-2 text-purple-600 hover:text-purple-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a language (e.g., English, Spanish, Mandarin)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const input = e.target as HTMLInputElement
                          addSkill('languages', input.value)
                          input.value = ''
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement
                        addSkill('languages', input.value)
                        input.value = ''
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Section 5: Portfolio Projects */}
            {currentSection === 5 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Portfolio Projects</h2>
                  <button
                    type="button"
                    onClick={addProject}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    Add Project
                  </button>
                </div>

                {profileData.portfolio_projects.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                    <p className="text-gray-600 mb-4">Showcase your previous work to attract funding partners</p>
                    <button
                      type="button"
                      onClick={addProject}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Add Your First Project
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {profileData.portfolio_projects.map((project, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Project {index + 1}</h3>
                          <button
                            type="button"
                            onClick={() => removeProject(index)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Project Title</label>
                            <input
                              type="text"
                              value={project.title}
                              onChange={(e) => updateProject(index, 'title', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                              placeholder="Project name"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                              value={project.status}
                              onChange={(e) => updateProject(index, 'status', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            >
                              <option value="completed">Completed</option>
                              <option value="in-progress">In Progress</option>
                              <option value="planned">Planned</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            value={project.description}
                            onChange={(e) => updateProject(index, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical text-gray-900 placeholder-gray-400"
                            placeholder="Describe your project, its impact, and key achievements..."
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Project Link (Optional)</label>
                          <input
                            type="url"
                            value={project.link}
                            onChange={(e) => updateProject(index, 'link', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                            placeholder="https://yourproject.com or GitHub repository"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Form Navigation */}
            <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
              <div>
                {currentSection > 1 && (
                  <button
                    type="button"
                    onClick={prevSection}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                  >
                    Previous
                  </button>
                )}
              </div>

              <div>
                {currentSection < totalSections ? (
                  <button
                    type="button"
                    onClick={nextSection}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={saveProfile}
                    disabled={formState.isSaving}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formState.isSaving ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving Profile...
                      </div>
                    ) : (
                      'Save Profile'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}