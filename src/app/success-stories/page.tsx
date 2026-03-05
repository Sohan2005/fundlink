'use client'
import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Link from 'next/link'

const stories = [
  {
    id: 1,
    founder: 'Sarah Chen',
    company: 'NeuralBridge AI',
    role: 'CEO & Co-Founder',
    industry: 'Artificial Intelligence',
    funded: '$1.2M',
    funder: 'Horizon Ventures',
    timeToFund: '6 weeks',
    avatar: 'SC',
    color: 'from-blue-500 to-blue-700',
    quote: 'FundLink connected us directly with Horizon Ventures within 48 hours of creating our profile. We had our term sheet in 6 weeks. What used to take months of cold outreach happened in weeks.',
    description: 'NeuralBridge AI builds natural language processing tools for enterprise customer support, reducing response times by 70%.',
    tags: ['AI', 'SaaS', 'Enterprise'],
  },
  {
    id: 2,
    founder: 'Marcus Thompson',
    company: 'SolarGrid Pro',
    role: 'Founder',
    industry: 'Clean Energy',
    funded: '$450K',
    funder: 'CleanFuture Foundation',
    timeToFund: '3 weeks',
    avatar: 'MT',
    color: 'from-green-500 to-green-700',
    quote: "I'd spent 8 months applying to grants manually with zero success. FundLink matched me with CleanFuture Foundation and I received their non-dilutive grant 3 weeks later. Game-changer.",
    description: 'SolarGrid Pro is making residential solar installation 40% cheaper through AI-optimized grid management software.',
    tags: ['CleanTech', 'Energy', 'Hardware'],
  },
  {
    id: 3,
    founder: 'Priya Nair',
    company: 'MindPath Health',
    role: 'CEO',
    industry: 'Healthcare',
    funded: '$800K',
    funder: 'MedBridge Capital',
    timeToFund: '10 weeks',
    avatar: 'PN',
    color: 'from-purple-500 to-purple-700',
    quote: 'FundLink understood our mission. Within days we were in conversations with MedBridge — investors who truly understood healthcare. We got into their accelerator and walked away with $800K.',
    description: 'MindPath Health is an AI-powered mental health platform that connects patients with therapists and provides between-session support.',
    tags: ['HealthTech', 'Mental Health', 'AI'],
  },
  {
    id: 4,
    founder: 'James Okafor',
    company: 'ChainVault',
    role: 'Co-Founder & CTO',
    industry: 'Blockchain',
    funded: '$2.1M',
    funder: 'Decentralized Capital',
    timeToFund: '4 weeks',
    avatar: 'JO',
    color: 'from-orange-500 to-orange-700',
    quote: "Finding Web3-savvy investors was nearly impossible through traditional channels. FundLink knew exactly who to connect us with. Decentralized Capital led our round and it closed in under a month.",
    description: 'ChainVault is a decentralized treasury management protocol used by over 200 DAOs to manage their on-chain assets.',
    tags: ['Blockchain', 'DeFi', 'Web3'],
  },
  {
    id: 5,
    founder: 'Aisha Williams',
    company: 'LearnSpark',
    role: 'Founder & CEO',
    industry: 'Education',
    funded: '$120K',
    funder: 'LearnForward Initiative',
    timeToFund: '5 weeks',
    avatar: 'AW',
    color: 'from-pink-500 to-pink-700',
    quote: 'As a solo founder in EdTech, I had no network and no idea where to start. FundLink got me in front of the right grant committee and I received $120K in non-dilutive funding to expand into 12 new schools.',
    description: 'LearnSpark gamifies K-12 STEM education, making complex subjects accessible and engaging for students in underserved communities.',
    tags: ['EdTech', 'K-12', 'Social Impact'],
  },
  {
    id: 6,
    founder: 'David Park',
    company: 'FinFlow',
    role: 'CEO',
    industry: 'Finance',
    funded: '$600K',
    funder: 'Atlas Financial Partners',
    timeToFund: '7 weeks',
    avatar: 'DP',
    color: 'from-cyan-500 to-cyan-700',
    quote: 'Our B2B fintech idea needed investors who understood regulatory nuances. FundLink matched us with Atlas who had exactly the domain expertise we needed. They became true partners.',
    description: 'FinFlow automates accounts payable for mid-market companies, cutting invoice processing time from 15 days to same-day.',
    tags: ['Fintech', 'B2B', 'SaaS'],
  },
]

const stats = [
  { label: 'Total Funded', value: '$142M+' },
  { label: 'Success Stories', value: '1,200+' },
  { label: 'Avg. Time to Fund', value: '5.2 weeks' },
  { label: 'Funding Partners', value: '340+' },
]

export default function SuccessStoriesPage() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero */}
      <div className="bg-white border-b border-gray-100 py-16 px-6 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Real Founders. Real Funding.
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Success <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Stories</span>
          </h1>
          <p className="text-gray-500 text-lg">
            These founders used FundLink to connect with the right investors and secure the funding their ideas deserved. Yours could be next.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto mt-12">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{s.value}</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stories */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map(story => (
            <div
              key={story.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => setSelected(selected === story.id ? null : story.id)}
            >
              {/* Card top */}
              <div className={`bg-gradient-to-r ${story.color} p-6 flex items-center gap-4`}>
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {story.avatar}
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{story.founder}</p>
                  <p className="text-white/80 text-sm">{story.role}</p>
                  <p className="text-white font-semibold">{story.company}</p>
                </div>
              </div>

              {/* Card body */}
              <div className="p-6">
                <blockquote className="text-gray-600 text-sm leading-relaxed italic mb-4">
                  "{story.quote}"
                </blockquote>

                <div className="flex flex-wrap gap-2 mb-4">
                  {story.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 grid grid-cols-3 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{story.funded}</p>
                    <p className="text-xs text-gray-400">Raised</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{story.timeToFund}</p>
                    <p className="text-xs text-gray-400">To Fund</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-600">{story.funder}</p>
                    <p className="text-xs text-gray-400">Funder</p>
                  </div>
                </div>

                {selected === story.id && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{story.description}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to write your own success story?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join thousands of founders who found their funding match through FundLink. It only takes minutes to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Start for Free
            </Link>
            <Link
              href="/companies"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors"
            >
              Browse Companies
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
