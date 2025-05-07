import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "https://iwork-production.up.railway.app/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear cookies directly instead of using the store
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");

      // Redirect to login
      window.location.href = "/auth/login";
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
