'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { sampleCompanies } from '@/lib/companiesData'

function ApplyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const providerCompanyId = searchParams.get('company')
  const { user } = useAuth()
  
  const companyId = searchParams.get('company')
  const selectedCompany = sampleCompanies.find(c => c.id === companyId)

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    projectName: '',
    projectDescription: '',
    industry: '',
    stage: '',
    fundingAmount: '',
    fundingPurpose: '',
    timeline: '',
    website: '',
    linkedIn: '',
    pitchDeck: '',
    additionalInfo: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
      }))
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!selectedCompany) throw new Error('No company selected')

      const applicationData = {
        user_id: user?.id ?? null,
        company_id: selectedCompany.id,
        company_name: selectedCompany.name,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        project_name: formData.projectName,
        project_description: formData.projectDescription,
        industry: formData.industry,
        stage: formData.stage,
        funding_amount: parseFloat(formData.fundingAmount) || 0,
        funding_purpose: formData.fundingPurpose,
        timeline: formData.timeline,
        website: formData.website || null,
        linkedin_url: formData.linkedIn || null,
        pitch_deck_url: formData.pitchDeck || null,
        additional_info: formData.additionalInfo || null,
        status: 'pending',
        submitted_at: new Date().toISOString(),
        provider_company_slug: providerCompanyId,
      }

      const { error: insertError } = await supabase
        .from('applications')
        .insert(applicationData)
        .select()
        .single()

      if (insertError) throw insertError

      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'application_submitted',
            to: formData.email,
            userName: formData.fullName || formData.email.split('@')[0],
            companyName: selectedCompany.name
          })
        })
      } catch (emailError) {
        console.error('Failed to send email:', emailError)
      }

      setSuccess(true)
      setLoading(false)
      
      setTimeout(() => {
        if (user) {
          router.push('/dashboard/applications')
        } else {
          router.push('/auth/signup')
        }
      }, 3000)

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit application'
      setError(message)
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

  if (!selectedCompany) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-black mb-4">Company Not Found</h1>
            <p className="text-gray-600 mb-6">Please select a company to apply to.</p>
            <Link href="/companies" className="text-blue-600 hover:underline">
              Browse Companies
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-semibold text-black mb-4">Application Submitted!</h1>
            <p className="text-gray-600 mb-2">
              Your application to {selectedCompany?.name || 'the selected company'} has been submitted.
            </p>
            {selectedCompany && (
              <p className="text-gray-600 mb-4">
                <strong>Expected response time:</strong> {selectedCompany.responseTime}
              </p>
            )}
            <p className="text-sm text-gray-500 mb-6">
              {user
                ? 'Redirecting to your dashboard to track this application...'
                : 'Create an account to track your application status and get updates!'}
            </p>
            <p className="text-sm text-green-600 font-medium">
              Check your email for confirmation!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href={`/companies/${selectedCompany.id}`} className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to {selectedCompany.name}
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{selectedCompany.logo}</div>
            <div>
              <h1 className="text-3xl font-semibold text-black">{selectedCompany.name}</h1>
              <p className="text-gray-600">
                {formatFundingRange(selectedCompany.fundingRangeMin, selectedCompany.fundingRangeMax)} • {selectedCompany.responseTime} response time
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-20 h-1 mx-2 ${currentStep > step ? 'bg-black' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-600">Basic Info</span>
            <span className="text-xs text-gray-600">Project</span>
            <span className="text-xs text-gray-600">Funding</span>
            <span className="text-xs text-gray-600">Details</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-black mb-6">Basic Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-400 text-gray-900"
                  placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-400 text-gray-900"
                  placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-400 text-gray-900"
                  placeholder="+1 (555) 123-4567" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-400 text-gray-900"
                  placeholder="San Francisco, CA" />
              </div>
              <button type="button" onClick={nextStep}
                className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                Continue
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-black mb-6">Project Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-400 text-gray-900"
                  placeholder="My Startup" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Description *</label>
                <textarea name="projectDescription" value={formData.projectDescription} onChange={handleChange} required rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-400 text-gray-900"
                  placeholder="Describe your project, what problem it solves, and your target market..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                <select name="industry" value={formData.industry} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900">
                  <option value="">Select Industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Stage *</label>
                <select name="stage" value={formData.stage} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900">
                  <option value="">Select Stage</option>
                  <option value="Idea">Idea Stage</option>
                  <option value="MVP">MVP/Prototype</option>
                  <option value="Early Revenue">Early Revenue</option>
                  <option value="Growth">Growth Stage</option>
                  <option value="Established">Established</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={prevStep}
                  className="flex-1 px-6 py-3 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Back
                </button>
                <button type="button" onClick={nextStep}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-black mb-6">Funding Request</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Funding Amount Requested *</label>
                <input type="number" name="fundingAmount" value={formData.fundingAmount} onChange={handleChange} required min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-400 text-gray-900"
                  placeholder="50000" />
                <p className="text-sm text-gray-500 mt-1">Enter amount in USD</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose of Funding *</label>
                <textarea name="fundingPurpose" value={formData.fundingPurpose} onChange={handleChange} required rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-400 text-gray-900"
                  placeholder="How will you use the funding? (e.g., product development, marketing, hiring)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timeline *</label>
                <select name="timeline" value={formData.timeline} onChange={handleChange} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900">
                  <option value="">When do you need funding?</option>
                  <option value="Immediate">Immediate (1-2 weeks)</option>
                  <option value="1 month">Within 1 month</option>
                  <option value="3 months">Within 3 months</option>
                  <option value="6 months">Within 6 months</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={prevStep}
                  className="flex-1 px-6 py-3 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Back
                </button>
                <button type="button" onClick={nextStep}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-black mb-6">Additional Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input type="url" name="website" value={formData.website} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-400 text-gray-900"
                  placeholder="https://myproject.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                <input type="url" name="linkedIn" value={formData.linkedIn} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-400 text-gray-900"
                  placeholder="https://linkedin.com/in/yourprofile" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pitch Deck URL</label>
                <input type="url" name="pitchDeck" value={formData.pitchDeck} onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-400 text-gray-900"
                  placeholder="https://drive.google.com/..." />
                <p className="text-sm text-gray-500 mt-1">Link to Google Drive, Dropbox, or similar</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-gray-400 text-gray-900"
                  placeholder="Any other information you would like to share..." />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={prevStep}
                  className="flex-1 px-6 py-3 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium">
                  {loading ? 'Submitting...' : 'Submit your project for funding consideration'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default function ApplyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    }>
      <ApplyContent />
    </Suspense>
  )
}