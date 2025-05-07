export interface Salary {
  id: number;
  companyId: number;
  jobId: number;
  locationId: number | null;
  companyName: string;
  position: string;
  department: string;
  employmentStatus: string;
  employmentType: string;
  salary: number;
  currency: string;
  payPeriod: string;
  formattedAmount: string;
  bonuses: string;
  stockOptions: string;
  experience: string;
  location: string;
  anonymous: boolean;
  approvalStatus: string;
  hasVerification: boolean;
  contractDocumentUrl: string | null;
  date: string;
  adminComment?: string;
}

export interface SalaryState {
  userSalaries: Salary[];
  allSalaries: Salary[];
  currentSalary: Salary | null;
  isLoading: boolean;
  error: string | null;
  userSalariesLoaded: boolean;
  allSalariesLoaded: boolean;
}

export interface SalarySubmitRequest {
  companyId: number | null;
  companyName: string;
  jobId: number | null;
  position: string;
  department: string;
  employmentStatus: string;
  employmentType: string;
  salary: number;
  currency: string;
  payPeriod: string;
  bonuses: string;
  stockOptions: string;
  experience: string;
  locationId: number | null;
  location: string;
  anonymous: boolean;
}

export interface SalaryStatusUpdateRequest {
  status: string;
  adminComment?: string;
}

export interface SalaryResponse {
  data: Salary;
  message: string;
  error: null | string;
  code: number;
}
