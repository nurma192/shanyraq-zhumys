export interface ICompany {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  location: string;
  rating: number;
  size: string;
  industries: string[];
  overallInfo?: any;
  reviews?: any[];
  salaries?: any[];
  recommended?: any[];
  topCompanies?: any[];
  bannerImg?: string;
}

export interface CompanyListResponse {
  data: {
    content: ICompany[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
  message: string;
  error: null | string;
  code: number;
}

export interface CompanyListParams {
  search?: string;
  location?: string;
  industry?: string;
  minRating?: number;
  size?: string;
  page?: number;
  pageSize?: number;
  locationId?: number | null;
}