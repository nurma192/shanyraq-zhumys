// src/features/auth/authAPI.ts
import apiClient from "@/services/apiClient";
import {
  SignupRequest,
  VerifyEmailRequest,
  LoginRequest,
  LoginResponse,
} from "./types";

const authAPI = {
  signup: async (data: SignupRequest): Promise<{ statusCode: number }> => {
    const response = await apiClient.post("/auth/signup", data);
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<string> => {
    const response = await apiClient.post("/auth/verify-email", data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  logout: async (): Promise<string> => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },
};

export default authAPI;
