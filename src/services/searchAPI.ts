import apiClient from "@/services/apiClient";

const searchAPI = {
  searchCompanies: async (query: string) => {
    const response = await apiClient.get(`/companies?search=${query}`);
    return response.data;
  },
  
  searchJobs: async (query: string) => {
    const response = await apiClient.get(`/jobs?search=${query}`);
    return response.data;
  },
  
  searchLocations: async (query: string) => {
    const response = await apiClient.get(`/locations?search=${query}`);
    return response.data;
  },
};

export default searchAPI;