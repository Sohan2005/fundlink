'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

const opportunities = [
  {
    id: 1,
    title: 'Seed Funding for AI Startups',
    company: 'Horizon Ventures',
    type: 'Venture Capital',
    amount: '$50K – $500K',
    industry: 'Artificial Intelligence',
    deadline: 'Rolling',
    location: 'San Francisco, CA',
    tags: ['AI', 'Machine Learning', 'SaaS'],
    description: 'Horizon Ventures backs early-stage AI companies with bold ideas. We invest in founders who are using AI to reshape industries.',
    matchScore: 95,
  },
  {
    id: 2,
    title: 'GreenTech Innovation Grant',
    company: 'CleanFuture Foundation',
    type: 'Grant',
    amount: '$10K – $100K',
    industry: 'Clean Energy',
    deadline: 'Mar 31, 2026',
    location: 'Remote',
    tags: ['CleanTech', 'Sustainability', 'Energy'],
    description: 'Non-dilutive grants for projects addressing climate change through technology. Open to startups and research teams globally.',
    matchScore: 82,
  },
  {
    id: 3,
    title: 'HealthTech Accelerator Program',
    company: 'MedBridge Capital',
    type: 'Accelerator',
    amount: '$25K + Mentorship',
    industry: 'Healthcare',
    deadline: 'Apr 15, 2026',
    location: 'Boston, MA',
    tags: ['HealthTech', 'MedTech', 'Biotech'],
    description: 'A 12-week intensive program for healthcare startups. Includes $25K investment, office space, and access to top medical advisors.',
    matchScore: 78,
  },
  {
    id: 4,
    title: 'Blockchain & Web3 Fund',
    company: 'Decentralized Capital',
    type: 'Venture Capital',
    amount: '$100K – $2M',
    industry: 'Blockchain',
    deadline: 'Rolling',
    location: 'New York, NY',
    tags: ['Blockchain', 'Web3', 'DeFi', 'NFT'],
    description: 'We fund the next generation of decentralized applications. From DeFi protocols to NFT platforms and beyond.',
    matchScore: 71,
  },
  {
    id: 5,
    title: 'EdTech Social Impact Grant',
    company: 'LearnForward Initiative',
    type: 'Grant',
    amount: '$5K – $50K',
    industry: 'Education',
    deadline: 'May 1, 2026',
    location: 'Remote',
    tags: ['EdTech', 'Social Impact', 'E-learning'],
    description: 'Supporting technology-driven education projects that improve access to quality learning for underserved communities.',
    matchScore: 65,
  },
  {
    id: 6,
    title: 'Fintech Startup Fund',
    company: 'Atlas Financial Partners',
    type: 'Angel Investment',
    amount: '$50K – $250K',
    industry: 'Finance',
    deadline: 'Rolling',
    location: 'Chicago, IL',
    tags: ['Fintech', 'Payments', 'Banking'],
    description: 'Early-stage investment for fintech startups disrupting traditional financial services. We love bold ideas in payments, lending, and wealth management.',
    matchScore: 88,
  },
  {
    id: 7,
    title: 'Female Founders Fund',
    company: 'Rising Stars Capital',
    type: 'Venture Capital',
    amount: '$25K – $300K',
    industry: 'All Industries',
    deadline: 'Rolling',
    location: 'Remote',
    tags: ['Female Founders', 'Diversity', 'All Sectors'],
    description: 'Dedicated to funding exceptional female founders across all industries. We believe diverse teams build better companies.',
    matchScore: 60,
  },
  {
    id: 8,
    title: 'Deep Tech Research Fund',
    company: 'Quantum Leap Ventures',
    type: 'Venture Capital',
    amount: '$500K – $5M',
    industry: 'Deep Tech',
    deadline: 'Rolling',
    location: 'Austin, TX',
    tags: ['Deep Tech', 'Quantum', 'Robotics', 'Space'],
    description: 'Funding breakthrough research and development in quantum computing, advanced robotics, and space technology.',
    matchScore: 73,
  },
]

const types = ['All', 'Venture Capital', 'Grant', 'Accelerator', 'Angel Investment']
const industries = ['All', 'Artificial Intelligence', 'Clean Energy', 'Healthcare', 'Blockchain', 'Education', 'Finance', 'Deep Tech']

export default function OpportunitiesPage() {
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedIndustry, setSelectedIndustry] = useState('All')

  const filtered = opportunities.filter(op => {
    const matchSearch =
      op.title.toLowerCase().includes(search.toLowerCase()) ||
      op.company.toLowerCase().includes(search.toLowerCase()) ||
      op.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchType = selectedType === 'All' || op.type === selectedType
    const matchIndustry = selectedIndustry === 'All' || op.industry === selectedIndustry
    return matchSearch && matchType && matchIndustry
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Grant': return 'bg-green-100 text-green-700'
      case 'Accelerator': return 'bg-purple-100 text-purple-700'
      case 'Angel Investment': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-blue-100 text-blue-700'
    }
  }

  const getMatchColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50'
    if (score >= 70) return 'text-blue-600 bg-blue-50'
    return 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero */}
      <div className="bg-white border-b border-gray-100 py-12 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Funding <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Opportunities</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Discover grants, venture capital, accelerators, and angel investments perfectly matched to your project.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <input
              type="text"
              placeholder="Search by name, company, or tag..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <aside className="w-full lg:w-56 shrink-0 space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Funding Type</h3>
            <div className="space-y-1">
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === t ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Industry</h3>
            <div className="space-y-1">
              {industries.map(ind => (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustry(ind)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedIndustry === ind ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Cards */}
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-5">{filtered.length} opportunities found</p>
          <div className="space-y-4">
            {filtered.map(op => (
              <div key={op.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all duration-150">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getTypeColor(op.type)}`}>{op.type}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getMatchColor(op.matchScore)}`}>
                        {op.matchScore}% match
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{op.title}</h3>
                    <p className="text-sm text-blue-600 font-medium">{op.company}</p>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">{op.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {op.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 text-right space-y-2 min-w-[140px]">
                    <div className="text-lg font-bold text-gray-900">{op.amount}</div>
                    <div className="text-xs text-gray-400">📍 {op.location}</div>
                    <div className="text-xs text-gray-400">⏰ Deadline: {op.deadline}</div>
                    <Link
                      href={`/apply?opportunity=${op.id}`}
                      className="block mt-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl hover:opacity-90 transition-opacity text-center"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg">No opportunities match your filters.</p>
                <button onClick={() => { setSearch(''); setSelectedType('All'); setSelectedIndustry('All') }} className="mt-3 text-blue-600 hover:underline text-sm">
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}