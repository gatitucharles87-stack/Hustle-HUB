import axios from "axios";
import { toast } from "@/hooks/use-toast";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post(
            "http://localhost:8000/api/token/refresh/",
            {
              refresh: refreshToken,
            }
          );
          const { access } = response.data;
          localStorage.setItem("accessToken", access);
          api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed", refreshError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          // Redirect to login page
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export const getRecommendedJobs = async (categoryId?: string) => {
  try {
    const response = await api.get('/jobs/recommended/', {
      params: { category: categoryId },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch recommended jobs:", error);
    toast({
      title: "Error",
      description: "Failed to load recommended jobs. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

export const getJobCategories = async () => {
  try {
    const response = await api.get('/job-categories/');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch job categories:", error);
    toast({
      title: "Error",
      description: "Failed to load job categories. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

export const getCommissionHistory = async () => {
  try {
    const response = await api.get('/commission-logs/');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch commission history:", error);
    toast({
      title: "Error",
      description: "Failed to load commission history. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

export default api;
