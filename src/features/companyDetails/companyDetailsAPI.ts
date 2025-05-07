// src/features/companyDetails/companyDetailsAPI.ts
import apiClient from "@/services/apiClient";
import {
  FetchSalariesParams,
  FetchReviewsParams,
  CompanyOverview,
  CompanyTaxes,
  CompanyStocks,
  CompanySalaries,
  CompanyReviews,
} from "./types";

// Helper to build query string
const buildQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : "";
};

// Company Details API
export const companyDetailsAPI = {
  // Get company overview
  getCompanyOverview: async (
    companyId: string
  ): Promise<{ data: CompanyOverview }> => {
    try {
      const response = await apiClient.get(`/companies/${companyId}/overview`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching company overview:", error);
      throw error;
    }
  },

  // Get company taxes
  getCompanyTaxes: async (
    companyId: string
  ): Promise<{ data: CompanyTaxes }> => {
    try {
      const response = await apiClient.get(`/companies/${companyId}/taxes`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching company taxes:", error);
      throw error;
    }
  },

  // Get company stocks
  getCompanyStocks: async (
    companyId: string
  ): Promise<{ data: CompanyStocks }> => {
    try {
      const response = await apiClient.get(`/companies/${companyId}/stocks`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching company stocks:", error);
      throw error;
    }
  },

  // Get company salaries with optional filtering
  getCompanySalaries: async (
    params: FetchSalariesParams
  ): Promise<{ data: CompanySalaries }> => {
    try {
      const { companyId, ...queryParams } = params;
      const queryString = buildQueryString(queryParams);
      const response = await apiClient.get(
        `/companies/${companyId}/salaries${queryString}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching company salaries:", error);
      throw error;
    }
  },

  // Get company reviews with optional filtering
  getCompanyReviews: async (
    params: FetchReviewsParams
  ): Promise<{ data: CompanyReviews }> => {
    try {
      const { companyId, ...queryParams } = params;
      const queryString = buildQueryString(queryParams);
      const response = await apiClient.get(
        `/companies/${companyId}/reviews${queryString}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching company reviews:", error);
      throw error;
    }
  },
};

export default companyDetailsAPI;
