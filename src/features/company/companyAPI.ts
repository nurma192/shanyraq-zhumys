// src/features/company/companyAPI.ts
import apiClient from "@/services/apiClient";
import { CompanyListParams, CompanyListResponse, ICompany } from "./types";

export const companyAPI = {
  getCompanies: async (
    params: CompanyListParams = {}
  ): Promise<CompanyListResponse> => {
    try {
      const queryParams = new URLSearchParams();

      if (params.search) queryParams.append("search", params.search);
      if (params.location) queryParams.append("location", params.location);
      if (params.industry) queryParams.append("industry", params.industry);
      if (params.minRating)
        queryParams.append("minRating", params.minRating.toString());
      if (params.size) queryParams.append("size", params.size);
      if (params.page !== undefined)
        queryParams.append("page", params.page.toString());
      if (params.pageSize)
        queryParams.append("pageSize", params.pageSize.toString());

      const response = await apiClient.get(
        `/companies?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw error;
    }
  },

  getCompanyById: async (id: string): Promise<ICompany> => {
    try {
      const response = await apiClient.get(`/companies/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching company with id ${id}:`, error);
      throw error;
    }
  },
};
