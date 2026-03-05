// src/lib/companiesData.ts
export interface Company {
  id: string
  name: string
  description: string
  logo: string
  industry: string
  location: string
  website: string
  fundingRangeMin: number
  fundingRangeMax: number
  companySize: string
  focusAreas: string[]
  applicationRequirements: string[]
  tags: string[]
  isActive: boolean
  responseTime: string
  successRate: number
  totalFunded: number
  foundedYear: number
  employeeCount: string
}

export const sampleCompanies: Company[] = [
  {
    id: "1",
    name: "TechStart Ventures",
    description: "We fund early-stage technology startups with innovative solutions. Our portfolio includes companies in AI, blockchain, and IoT. We provide not just funding, but mentorship and strategic guidance.",
    logo: "🚀",
    industry: "Technology",
    location: "San Francisco, CA",
    website: "techstart.ventures",
    fundingRangeMin: 10000,
    fundingRangeMax: 100000,
    companySize: "51-200",
    focusAreas: ["Artificial Intelligence", "Blockchain", "IoT", "SaaS"],
    applicationRequirements: ["Business Plan", "MVP", "Team Overview", "Financial Projections"],
    tags: ["Fast Response", "Mentor Network", "Post-Funding Support"],
    isActive: true,
    responseTime: "3-5 days",
    successRate: 15,
    totalFunded: 50,
    foundedYear: 2018,
    employeeCount: "51-200"
  },
  {
    id: "2",
    name: "Green Future Fund",
    description: "Dedicated to funding sustainable and environmentally conscious projects. We believe in the power of green technology to reshape our future and create lasting positive impact.",
    logo: "🌱",
    industry: "Sustainability",
    location: "Portland, OR",
    website: "greenfuture.fund",
    fundingRangeMin: 25000,
    fundingRangeMax: 200000,
    companySize: "11-50",
    focusAreas: ["Clean Energy", "Sustainable Agriculture", "Waste Reduction", "Carbon Capture"],
    applicationRequirements: ["Environmental Impact Assessment", "Sustainability Plan", "Market Analysis"],
    tags: ["Mission Driven", "Long-term Partnership", "Impact Focused"],
    isActive: true,
    responseTime: "1-2 weeks",
    successRate: 22,
    totalFunded: 28,
    foundedYear: 2020,
    employeeCount: "11-50"
  },
  {
    id: "3",
    name: "Innovation Labs",
    description: "We support bold ideas and breakthrough innovations across all industries. Our focus is on disruptive technologies that have the potential to change entire markets.",
    logo: "💡",
    industry: "Innovation",
    location: "Austin, TX",
    website: "innovation-labs.com",
    fundingRangeMin: 5000,
    fundingRangeMax: 50000,
    companySize: "11-50",
    focusAreas: ["Disruptive Tech", "Consumer Products", "B2B Solutions", "Mobile Apps"],
    applicationRequirements: ["Prototype", "Market Validation", "Team Bio"],
    tags: ["Quick Decisions", "Broad Focus", "Early Stage"],
    isActive: true,
    responseTime: "1-3 days",
    successRate: 28,
    totalFunded: 75,
    foundedYear: 2019,
    employeeCount: "11-50"
  },
  {
    id: "4",
    name: "HealthTech Accelerator",
    description: "Specialized funding for healthcare technology innovations. We partner with startups developing solutions for digital health, medical devices, and healthcare software.",
    logo: "🏥",
    industry: "Healthcare",
    location: "Boston, MA",
    website: "healthtech-acc.com",
    fundingRangeMin: 50000,
    fundingRangeMax: 500000,
    companySize: "201-500",
    focusAreas: ["Digital Health", "Medical Devices", "Telemedicine", "Health Analytics"],
    applicationRequirements: ["Clinical Data", "Regulatory Compliance", "Market Research", "Team Credentials"],
    tags: ["Industry Expertise", "Regulatory Support", "Clinical Guidance"],
    isActive: true,
    responseTime: "2-3 weeks",
    successRate: 12,
    totalFunded: 35,
    foundedYear: 2016,
    employeeCount: "201-500"
  },
  {
    id: "5",
    name: "Creative Catalyst",
    description: "We fund creative projects and artistic endeavors that push boundaries. From digital art platforms to creative tools, we support innovation in the creative industry.",
    logo: "🎨",
    industry: "Creative",
    location: "Los Angeles, CA",
    website: "creative-catalyst.co",
    fundingRangeMin: 2000,
    fundingRangeMax: 25000,
    companySize: "2-10",
    focusAreas: ["Digital Art", "Creative Tools", "Entertainment", "Content Creation"],
    applicationRequirements: ["Portfolio", "Creative Brief", "Market Opportunity"],
    tags: ["Creative Focus", "Artist Friendly", "Community Building"],
    isActive: true,
    responseTime: "1 week",
    successRate: 35,
    totalFunded: 120,
    foundedYear: 2021,
    employeeCount: "2-10"
  },
  {
    id: "6",
    name: "EdTech Partners",
    description: "Transforming education through technology. We invest in platforms, tools, and solutions that make learning more accessible, engaging, and effective for students worldwide.",
    logo: "📚",
    industry: "Education",
    location: "Chicago, IL",
    website: "edtech-partners.edu",
    fundingRangeMin: 15000,
    fundingRangeMax: 150000,
    companySize: "51-200",
    focusAreas: ["E-Learning", "Educational Software", "Student Analytics", "Accessibility"],
    applicationRequirements: ["Educational Impact Study", "User Testing Results", "Scalability Plan"],
    tags: ["Education Focused", "Impact Measurement", "Scalability Support"],
    isActive: true,
    responseTime: "1-2 weeks",
    successRate: 18,
    totalFunded: 42,
    foundedYear: 2017,
    employeeCount: "51-200"
  },
  {
    id: "7",
    name: "FinTech Forward",
    description: "Leading the future of financial technology. We fund innovative solutions in payments, lending, insurance, and financial services that democratize access to financial tools.",
    logo: "💳",
    industry: "FinTech",
    location: "New York, NY",
    website: "fintech-forward.com",
    fundingRangeMin: 30000,
    fundingRangeMax: 300000,
    companySize: "101-500",
    focusAreas: ["Digital Payments", "Lending Platforms", "Insurance Tech", "Crypto"],
    applicationRequirements: ["Regulatory Analysis", "Security Audit", "Financial Projections", "Compliance Plan"],
    tags: ["Regulatory Expertise", "Security Focus", "Scaling Support"],
    isActive: true,
    responseTime: "2-4 weeks",
    successRate: 10,
    totalFunded: 25,
    foundedYear: 2015,
    employeeCount: "101-500"
  },
  {
    id: "8",
    name: "Social Impact Ventures",
    description: "We fund projects that create positive social change. Our focus is on solutions that address social challenges while building sustainable businesses.",
    logo: "🤝",
    industry: "Social Impact",
    location: "Seattle, WA",
    website: "social-impact.ventures",
    fundingRangeMin: 10000,
    fundingRangeMax: 75000,
    companySize: "11-50",
    focusAreas: ["Social Good", "Community Development", "Accessibility", "Education"],
    applicationRequirements: ["Impact Measurement Plan", "Community Validation", "Sustainability Model"],
    tags: ["Social Mission", "Community Focused", "Impact Driven"],
    isActive: true,
    responseTime: "1-2 weeks",
    successRate: 25,
    totalFunded: 60,
    foundedYear: 2020,
    employeeCount: "11-50"
  },
  {
    id: "9",
    name: "AI Research Fund",
    description: "Dedicated to advancing artificial intelligence research and applications. We support projects that push the boundaries of what's possible with machine learning and AI.",
    logo: "🤖",
    industry: "Artificial Intelligence",
    location: "Palo Alto, CA",
    website: "ai-research.fund",
    fundingRangeMin: 25000,
    fundingRangeMax: 250000,
    companySize: "51-200",
    focusAreas: ["Machine Learning", "Computer Vision", "Natural Language Processing", "Robotics"],
    applicationRequirements: ["Technical Whitepaper", "Research Validation", "Team Expertise", "Implementation Plan"],
    tags: ["Cutting Edge", "Research Focused", "Technical Excellence"],
    isActive: true,
    responseTime: "2-3 weeks",
    successRate: 8,
    totalFunded: 18,
    foundedYear: 2019,
    employeeCount: "51-200"
  },
  {
    id: "10",
    name: "Local Startup Fund",
    description: "Supporting local entrepreneurs and small businesses in their growth journey. We provide accessible funding for community-based projects and local innovations.",
    logo: "🏘️",
    industry: "Local Business",
    location: "Denver, CO",
    website: "local-startup.fund",
    fundingRangeMin: 1000,
    fundingRangeMax: 20000,
    companySize: "2-10",
    focusAreas: ["Local Business", "Community Services", "Small Scale Innovation", "Service Businesses"],
    applicationRequirements: ["Business Concept", "Community Impact", "Financial Need"],
    tags: ["Community Focused", "Accessible", "Local Impact"],
    isActive: true,
    responseTime: "3-5 days",
    successRate: 45,
    totalFunded: 200,
    foundedYear: 2022,
    employeeCount: "2-10"
  },
  {
    id: "11",
    name: "Blockchain Builders",
    description: "Focused exclusively on blockchain and cryptocurrency projects. We fund innovative solutions in DeFi, NFTs, Web3, and distributed systems.",
    logo: "⛓️",
    industry: "Blockchain",
    location: "Miami, FL",
    website: "blockchain-builders.io",
    fundingRangeMin: 20000,
    fundingRangeMax: 200000,
    companySize: "11-50",
    focusAreas: ["DeFi", "NFTs", "Web3", "Cryptocurrency", "Smart Contracts"],
    applicationRequirements: ["Technical Architecture", "Tokenomics", "Security Audit", "Roadmap"],
    tags: ["Blockchain Expert", "Crypto Native", "Web3 Focus"],
    isActive: true,
    responseTime: "1-2 weeks",
    successRate: 20,
    totalFunded: 32,
    foundedYear: 2021,
    employeeCount: "11-50"
  },
  {
    id: "12",
    name: "Women Founders Fund",
    description: "Dedicated to supporting women entrepreneurs and women-led startups. We're committed to closing the funding gap and empowering female founders.",
    logo: "👩‍💼",
    industry: "Diversity & Inclusion",
    location: "San Francisco, CA",
    website: "women-founders.fund",
    fundingRangeMin: 15000,
    fundingRangeMax: 100000,
    companySize: "11-50",
    focusAreas: ["Women-Led Startups", "Diversity", "Female Entrepreneurship", "Inclusive Innovation"],
    applicationRequirements: ["Founder Background", "Business Plan", "Impact Statement", "Market Analysis"],
    tags: ["Women Focused", "Diversity Champion", "Mentorship Included"],
    isActive: true,
    responseTime: "1 week",
    successRate: 30,
    totalFunded: 85,
    foundedYear: 2020,
    employeeCount: "11-50"
  }
]

export const industries = [
  "All Industries",
  "Technology", 
  "Sustainability", 
  "Innovation", 
  "Healthcare", 
  "Creative", 
  "Education", 
  "FinTech", 
  "Social Impact", 
  "Artificial Intelligence", 
  "Local Business", 
  "Blockchain", 
  "Diversity & Inclusion"
]

export const companySizes = [
  "All Sizes",
  "2-10",
  "11-50", 
  "51-200",
  "201-500",
  "500+"
]

export const fundingRanges = [
  { label: "All Amounts", min: 0, max: Infinity },
  { label: "$1K - $10K", min: 1000, max: 10000 },
  { label: "$10K - $50K", min: 10000, max: 50000 },
  { label: "$50K - $100K", min: 50000, max: 100000 },
  { label: "$100K - $500K", min: 100000, max: 500000 },
  { label: "$500K+", min: 500000, max: Infinity }
]