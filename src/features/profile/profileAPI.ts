import apiClient from "@/services/apiClient";

const profileAPI = {
  getProfile: async () => {
    const response = await apiClient.get("/profile");
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await apiClient.put("/profile/edit", data);
    return response.data;
  },

  updatePassword: async (data: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const response = await apiClient.post("/profile/update-password", data);
    return response.data;
  },
};

export default profileAPI;
