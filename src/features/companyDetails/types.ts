// src/features/companyDetails/types.ts

// Company Overview
export interface CompanyOverview {
  id: number;
  name: string;
  logoUrl: string;
  bannerImg: string;
  description: string;
  location: string;
  rating: number;
  size: string;
  industries: string[];
  founded: string;
  revenue: string;
  mission: string;
  type: string; // Added the missing type property
  topReview: {
    id: number;
    title: string;
    body: string;
    rating: number;
    author: string | null;
    date: string;
  } | null;
  totalReviews: number;
  topSalary: any | null;
  totalSalaries: number;
}

// Company Taxes
export interface CompanyTaxes {
  companyId: number;
  companyName: string;
  registrationDate: string;
  companyStatus: string;
  companyType: string;
  companySize: string;
  businessActivity: string;
  businessActivityCode: string;
  lastUpdateDate: string;
  dataSource: string;
  vatPayer: boolean;
  astanaHubParticipant: boolean;
  governmentProcurementParticipant: boolean;
  licenseCount: number;
  lastDocumentChangeDate: string;
  participationsInOtherCompanies: number;
  yearlyTaxes: {
    year: number;
    amount: number;
    formattedAmount: string;
    dataSource: string;
  }[];
  annualRevenue: number;
  annualRevenueFormatted: string;
}

// Stock Historical Data
export interface StockHistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Company Stocks
export interface CompanyStocks {
  companyId: number;
  companyName: string;
  symbol: string;
  currentPrice: number;
  previousClose: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  currency: string;
  priceChange: number;
  priceChangePercent: number;
  formattedPrice: string;
  formattedMarketCap: string;
  timestamp: string;
  historicalData: StockHistoricalData[];
}

// Experience Filter Type
export type ExperienceFilter = "all" | "entry" | "mid" | "senior" | "executive";

// Salary Distribution
export interface SalaryDistribution {
  salaryRange: number;
  count: number;
}

// Top Salary
export interface TopSalary {
  position: string;
  median: number;
}

// Salary Statistics
export interface SalaryStatistics {
  averageSalaryByExperience: Record<string, number>;
  averageSalary: number;
  highestSalary: number;
  totalPositions: number;
  topSalaries: TopSalary[];
  salaryDistribution: SalaryDistribution[];
}

// Individual Salary
export interface Salary {
  id: number;
  position: string;
  department: string;
  experienceLevel: string;
  salary: number;
  min: number;
  max: number;
  median: number;
  currency: string;
  additionalPay: number;
  formattedAmount?: string;
  location:string;
  employmentType: string;
  hasVerification: boolean;
  payPeriod: string;
}

// Company Salaries Response
export interface CompanySalaries {
  companyId: number;
  companyName: string;
  statistics: SalaryStatistics;
  salaries: Salary[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalSalaries: number;
}

// Rating Distribution
export interface RatingDistribution {
  [key: string]: number;
}

// Individual Review
export interface Review {
  id: number;
  title: string;
  body: string;
  pros: string;
  cons: string;
  advice: string;
  rating: number;
  careerOpportunities: number;
  workLifeBalance: number;
  compensation: number;
  jobSecurity: number;
  management: number;
  position: string;
  employmentStatus: string;
  employmentType: string;
  recommendToFriend: boolean;
  author: string | null;
  helpfulCount: number;
  notHelpfulCount: number;
  commentsCount: number;
  date: string;
  hasVerification:boolean;
}

// Company Reviews Response
export interface CompanyReviews {
  companyId: number;
  companyName: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: string]: number;
  };
  reviews: Review[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

// Parameters for fetching salaries
export interface FetchSalariesParams {
  companyId: string;
  experienceFilter?: ExperienceFilter;
  search?: string;
  sort?: "highest" | "lowest";
  page?: number;
  pageSize?: number;
}

// Parameters for fetching reviews
export interface FetchReviewsParams {
  companyId: string;
  ratingFilter?: string;
  sort?: "newest" | "highest" | "lowest";
  page?: number;
  pageSize?: number;
}

// Company Details State
export interface CompanyDetailsState {
  overview: CompanyOverview | null;
  taxes: CompanyTaxes | null;
  stocks: CompanyStocks | null;
  reviews: Record<string, CompanyReviews>; // Keyed by companyId + params
  salaries: Record<string, CompanySalaries>; // Keyed by companyId + params
  loading: {
    overview: boolean;
    taxes: boolean;
    stocks: boolean;
    reviews: boolean;
    salaries: boolean;
  };
  error: {
    overview: string | null;
    taxes: string | null;
    stocks: string | null;
    reviews: string | null;
    salaries: string | null;
  };
}
