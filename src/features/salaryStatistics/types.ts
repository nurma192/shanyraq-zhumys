export interface SalaryStatistics {
  jobTitle: string;
  location: string;
  averageSalary: number;
  minSalary: number;
  maxSalary: number;
  medianSalary: number;
  percentile10: number;
  percentile25: number;
  percentile75: number;
  percentile90: number;
  sampleSize: number;
  currency: string;
  payPeriod: string;
  employmentTypeDistribution: Record<string, number>;
  experienceLevelDistribution: Record<string, number>;
  salaryByExperienceLevel: Record<string, number>;
}

export interface SalaryStatisticsState {
  data: Record<string, SalaryStatistics>;
  loading: boolean;
  error: string | null;
}
