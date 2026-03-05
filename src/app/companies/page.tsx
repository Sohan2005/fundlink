'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { sampleCompanies, industries, companySizes, fundingRanges, Company } from '@/lib/companiesData'

export default function BrowseCompaniesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries')
  const [selectedCompanySize, setSelectedCompanySize] = useState('All Sizes')
  const [selectedFundingRange, setSelectedFundingRange] = useState(0)
  const [sortBy, setSortBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const companiesPerPage = 8

  // Filter and search companies
  const filteredCompanies = useMemo(() => {
    let filtered = sampleCompanies.filter(company => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.focusAreas.some(area => area.toLowerCase().includes(searchQuery.toLowerCase()))

      // Industry filter
      const matchesIndustry = selectedIndustry === 'All Industries' || 
        company.industry === selectedIndustry

      // Company size filter
      const matchesSize = selectedCompanySize === 'All Sizes' || 
        company.companySize === selectedCompanySize

      // Funding range filter
      const selectedRange = fundingRanges[selectedFundingRange]
      const matchesFundingRange = company.fundingRangeMin >= selectedRange.min && 
        company.fundingRangeMin <= selectedRange.max

      return matchesSearch && matchesIndustry && matchesSize && matchesFundingRange
    })

    // Sort companies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'funding-high':
          return b.fundingRangeMax - a.fundingRangeMax
        case 'funding-low':
          return a.fundingRangeMin - b.fundingRangeMin
        case 'success-rate':
          return b.successRate - a.successRate
        case 'response-time':
          return a.responseTime.localeCompare(b.responseTime)
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedIndustry, selectedCompanySize, selectedFundingRange, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage)
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * companiesPerPage,
    currentPage * companiesPerPage
  )

  const formatFundingRange = (min: number, max: number) => {
    const formatAmount = (amount: number) => {
      if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
      if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
      return `$${amount.toLocaleString()}`
    }
    return `${formatAmount(min)} - ${formatAmount(max)}`
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedIndustry('All Industries')
    setSelectedCompanySize('All Sizes')
    setSelectedFundingRange(0)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Your Perfect Funding Partner
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Browse {sampleCompanies.length} companies actively seeking projects to fund
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search companies, industries, or focus areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-lg"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Results Count */}
              <div className="mb-6 p-3 bg-blue-50 rounded-xl">
                <p className="text-sm font-medium text-blue-900">
                  {filteredCompanies.length} companies match your criteria
                </p>
              </div>

              {/* Industry Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Industry</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              {/* Company Size Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Company Size</label>
                <select
                  value={selectedCompanySize}
                  onChange={(e) => setSelectedCompanySize(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  {companySizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              {/* Funding Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Funding Range</label>
                <select
                  value={selectedFundingRange}
                  onChange={(e) => setSelectedFundingRange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  {fundingRanges.map((range, index) => (
                    <option key={index} value={index}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="name">Company Name</option>
                  <option value="funding-high">Highest Funding</option>
                  <option value="funding-low">Lowest Funding</option>
                  <option value="success-rate">Success Rate</option>
                  <option value="response-time">Response Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Companies Grid */}
          <div className="flex-1">
            {filteredCompanies.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearAllFilters}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Companies Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {paginatedCompanies.map((company) => (
                    <div key={company.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
                      {/* Company Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white text-xl">
                            {company.logo}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                              {company.name}
                            </h3>
                            <p className="text-sm text-gray-600">{company.location}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {company.industry}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {company.description}
                      </p>

                      {/* Key Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Funding Range:</span>
                          <span className="font-semibold text-green-600">
                            {formatFundingRange(company.fundingRangeMin, company.fundingRangeMax)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Response Time:</span>
                          <span className="font-medium text-gray-900">{company.responseTime}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Success Rate:</span>
                          <span className="font-medium text-gray-900">{company.successRate}%</span>
                        </div>
                      </div>

                      {/* Focus Areas Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {company.focusAreas.slice(0, 3).map((area, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                            {area}
                          </span>
                        ))}
                        {company.focusAreas.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                            +{company.focusAreas.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <Link
                          href={`/companies/${company.id}`}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-2 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm"
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/apply?company=${company.id}`}
                          className="flex-1 border border-gray-300 text-gray-700 text-center py-2 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 text-sm"
                        >
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}