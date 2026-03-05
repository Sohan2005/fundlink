// src/lib/matchingAlgorithm.ts

import { Company } from './companiesData'

export interface UserProfile {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  location: string | null
  current_role: string | null
  company: string | null
  years_of_experience: string | null
  linkedin_url: string | null
  website_url: string | null
  funding_stage: string[] | null
  industries: string[] | null
  funding_amount_min: number | null
  funding_amount_max: number | null
  skills: string[] | null
  bio: string | null
  profile_completion: number
  is_complete: boolean
}

export interface CompanyMatch {
  company: Company
  matchScore: number
  matchPercentage: number
  matchReasons: string[]
  matchStrength: 'Perfect Match' | 'Great Match' | 'Good Match' | 'Potential Match'
  breakdown: {
    industryMatch: number
    fundingMatch: number
    experienceMatch: number
    stageMatch: number
  }
}

/**
 * Calculate match score between a user profile and a company
 * Returns a score from 0-100
 */
export function calculateMatchScore(
  profile: UserProfile,
  company: Company
): CompanyMatch {
  let totalScore = 0
  let maxPossibleScore = 0
  const matchReasons: string[] = []
  
  const breakdown = {
    industryMatch: 0,
    fundingMatch: 0,
    experienceMatch: 0,
    stageMatch: 0
  }

    // 1. INDUSTRY MATCH (30% weight)
  const industryWeight = 30
  maxPossibleScore += industryWeight
  
  if (profile.industries && profile.industries.length > 0) {
    // Check if user's preferred industries match the company's single industry
    const hasMatch = profile.industries.some(industry => 
      industry.toLowerCase() === company.industry.toLowerCase()
    )
    
    if (hasMatch) {
      totalScore += industryWeight
      breakdown.industryMatch = 100
      matchReasons.push(`Matches your ${company.industry} industry focus`)
    }
  }


  // 2. FUNDING AMOUNT MATCH (25% weight)
  const fundingWeight = 25
  maxPossibleScore += fundingWeight
  
  if (profile.funding_amount_min !== null && profile.funding_amount_max !== null) {
    const userMin = profile.funding_amount_min
    const userMax = profile.funding_amount_max
    const companyMin = company.fundingRangeMin
    const companyMax = company.fundingRangeMax
    
    // Check if ranges overlap
    const overlapMin = Math.max(userMin, companyMin)
    const overlapMax = Math.min(userMax, companyMax)
    
    if (overlapMax >= overlapMin) {
      // Calculate percentage of overlap
      const overlapAmount = overlapMax - overlapMin
      const userRange = userMax - userMin
      const overlapPercentage = overlapAmount / userRange
      
      const fundingScore = overlapPercentage * fundingWeight
      totalScore += fundingScore
      breakdown.fundingMatch = Math.round((fundingScore / fundingWeight) * 100)
      
      matchReasons.push(`Funding range aligns with your $${formatNumber(userMin)}-$${formatNumber(userMax)} target`)
    }
  }

  // 3. EXPERIENCE LEVEL MATCH (20% weight)
  const experienceWeight = 20
  maxPossibleScore += experienceWeight
  
  if (profile.years_of_experience) {
    const years = parseInt(profile.years_of_experience.split('-')[0]) || 0
    
    // Map experience to company preference
    let experienceScore = 0
    if (years >= 10 && company.companySize === 'Enterprise (1000+ employees)') {
      experienceScore = experienceWeight
      matchReasons.push('Your senior experience fits their enterprise scale')
    } else if (years >= 5 && company.companySize === 'Large (200-999 employees)') {
      experienceScore = experienceWeight * 0.9
      matchReasons.push('Your mid-level experience matches their company size')
    } else if (years >= 2 && company.companySize === 'Medium (50-199 employees)') {
      experienceScore = experienceWeight * 0.8
      matchReasons.push('Your experience level suits their growth stage')
    } else if (years < 5) {
      experienceScore = experienceWeight * 0.7
      matchReasons.push('Good opportunity for your career level')
    }
    
    totalScore += experienceScore
    breakdown.experienceMatch = Math.round((experienceScore / experienceWeight) * 100)
  }

  // 4. FUNDING STAGE MATCH (25% weight)
  const stageWeight = 25
  maxPossibleScore += stageWeight
  
  if (profile.funding_stage && profile.funding_stage.length > 0) {
    // Map company funding range to stages
    const companyStages = inferCompanyStage(company)
    const stageOverlap = profile.funding_stage.filter(stage => 
      companyStages.includes(stage)
    ).length
    
    if (stageOverlap > 0) {
      const stageScore = (stageOverlap / profile.funding_stage.length) * stageWeight
      totalScore += stageScore
      breakdown.stageMatch = Math.round((stageScore / stageWeight) * 100)
      
      matchReasons.push(`Matches your ${profile.funding_stage.join(', ')} stage preference`)
    }
  }

  // Calculate final match percentage
  const matchPercentage = maxPossibleScore > 0 
    ? Math.round((totalScore / maxPossibleScore) * 100) 
    : 0

  // Determine match strength
  let matchStrength: CompanyMatch['matchStrength']
  if (matchPercentage >= 85) {
    matchStrength = 'Perfect Match'
  } else if (matchPercentage >= 70) {
    matchStrength = 'Great Match'
  } else if (matchPercentage >= 50) {
    matchStrength = 'Good Match'
  } else {
    matchStrength = 'Potential Match'
  }

  // Add response time as a bonus reason if it's fast
  if (company.responseTime === 'Within 24 hours') {
    matchReasons.push('Fast response time')
  }

  return {
    company,
    matchScore: totalScore,
    matchPercentage,
    matchReasons: matchReasons.slice(0, 3), // Top 3 reasons
    matchStrength,
    breakdown
  }
}

/**
 * Get all matches for a user, sorted by match score
 */
export function getAllMatches(
  profile: UserProfile,
  companies: Company[]
): CompanyMatch[] {
  return companies
    .map(company => calculateMatchScore(profile, company))
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
}

/**
 * Get top N matches for a user
 */
export function getTopMatches(
  profile: UserProfile,
  companies: Company[],
  limit: number = 6
): CompanyMatch[] {
  return getAllMatches(profile, companies).slice(0, limit)
}

/**
 * Infer funding stages from company funding range
 */
function inferCompanyStage(company: Company): string[] {
  const stages: string[] = []
  const min = company.fundingRangeMin
  const max = company.fundingRangeMax

  if (max <= 100000) stages.push('Pre-seed')
  if (min <= 500000 && max >= 100000) stages.push('Seed')
  if (min <= 2000000 && max >= 500000) stages.push('Series A')
  if (min <= 10000000 && max >= 2000000) stages.push('Series B')
  if (min >= 10000000) stages.push('Series C+')

  return stages
}

/**
 * Format number with K/M suffix
 */
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`
  }
  return num.toString()
}
