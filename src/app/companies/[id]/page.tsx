'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import {
  sampleCompanies,
  Company,
} from '@/lib/companiesData'

interface CompanyPageProps {
  params: { id: string }
}

export default function CompanyPage({ params }: CompanyPageProps) {
  const { id } = params

  // Match by id (since your list page uses company.id for routing)
  const company: Company | undefined = sampleCompanies.find(
    c => String(c.id) === String(id)
  )

  if (!company) {
    return notFound()
  }

  const formatFundingRange = (min: number, max: number) => {
    const formatAmount = (amount: number) => {
      if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
      if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
      return `$${amount.toLocaleString()}`
    }
    return `${formatAmount(min)} - ${formatAmount(max)}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Back link */}
        <div className="mb-4">
          <Link
            href="/companies"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <span className="mr-1 text-lg">←</span>
            Back to companies
          </Link>
        </div>

        {/* Header card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {company.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {company.location} • {company.companySize}
              </p>
              <p className="mt-3 text-sm text-gray-700 max-w-2xl">
                {company.description}
              </p>
            </div>

            {/* Apply button passes company.id for targeted applications */}
            <Link
              href={`/apply?company=${company.id}`}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all"
            >
              Apply for funding
            </Link>
          </div>
        </div>

        {/* Content sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: focus and funding */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:col-span-2">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Focus areas
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {company.focusAreas?.map(area => (
                <span
                  key={area}
                  className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
                >
                  {area}
                </span>
              ))}
            </div>

            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Funding range
            </h2>
            <p className="text-sm text-gray-700 mb-2">
              {formatFundingRange(company.fundingRangeMin, company.fundingRangeMax)}
            </p>

            <p className="text-xs text-gray-500">
              This is the typical ticket size this company deploys for the right projects.
            </p>
          </div>

          {/* Right: quick facts */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Company details
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Industry</dt>
                <dd className="text-gray-900">{company.industry}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Check size</dt>
                <dd className="text-gray-900">
                  {formatFundingRange(company.fundingRangeMin, company.fundingRangeMax)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Website</dt>
                <dd>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Visit site
                  </a>
                </dd>
              </div>
              {company.responseTime && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Typical response</dt>
                  <dd className="text-gray-900">{company.responseTime}</dd>
                </div>
              )}
              {typeof company.successRate === 'number' && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Acceptance rate</dt>
                  <dd className="text-gray-900">{company.successRate}%</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </main>
    </div>
  )
}
