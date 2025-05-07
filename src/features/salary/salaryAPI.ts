import apiClient from "@/services/apiClient";

const salaryAPI = {
  submitSalary: async (formData: FormData) => {
    const response = await apiClient.post("/salary/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateSalary: async (salaryId: string, formData: FormData) => {
    const response = await apiClient.put(`/salary/${salaryId}/edit`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getSalary: async (salaryId: string) => {
    const response = await apiClient.get(`/salary/${salaryId}`);
    return response.data;
  },

  deleteSalary: async (salaryId: string) => {
    const response = await apiClient.delete(`/salary/${salaryId}`);
    return response.data;
  },

  // Get user's salaries
  getUserSalaries: async () => {
    const response = await apiClient.get("/salary/my");
    return response.data;
  },

  // Admin: Get all salaries
  getAllSalaries: async (status?: string) => {
    const url = status ? `/admin/salaries?status=${status}` : `/admin/salaries`;
    const response = await apiClient.get(url);
    return response.data;
  },

  // Admin: Update salary status
  updateSalaryStatus: async (
    salaryId: string,
    data: { status: string; adminComment?: string }
  ) => {
    const response = await apiClient.put(
      `/admin/salaries/${salaryId}/status`,
      data
    );
    return response.data;
  },
};

export default salaryAPI;
