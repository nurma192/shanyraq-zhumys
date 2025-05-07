// src/features/review/reviewAPI.ts
import apiClient from "@/services/apiClient";

const reviewAPI = {
  submitReview: async (formData: FormData) => {
    const response = await apiClient.post("/reviews/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateReview: async (reviewId: string, formData: FormData) => {
    const response = await apiClient.put(
      `/reviews/${reviewId}/edit`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  getReview: async (reviewId: string) => {
    const response = await apiClient.get(`/reviews/${reviewId}`);
    return response.data;
  },

  deleteReview: async (reviewId: string) => {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  // New methods
  getUserReviews: async () => {
    const response = await apiClient.get("/reviews/my");
    return response.data;
  },

  getAllReviews: async (status?: string) => {
    const url = status ? `/admin/reviews?status=${status}` : `/admin/reviews`;
    const response = await apiClient.get(url);
    return response.data;
  },

  updateReviewStatus: async (
    reviewId: string,
    data: { status: string; adminComment?: string }
  ) => {
    const response = await apiClient.put(
      `/admin/reviews/${reviewId}/status`,
      data
    );
    return response.data;
  },
};

export default reviewAPI;
