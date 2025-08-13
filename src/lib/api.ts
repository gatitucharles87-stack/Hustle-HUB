import axios from "axios";
import { toast } from "@/hooks/use-toast";
import {
  getMockCommissionHistory,
  getMockRecommendedJobs,
  getMockJobCategories,
  getMockJobs,
  getMockJobById,
  postMockJob,
  applyMockJob,
  getMockSkillBarterPosts,
  getMockSkillBarterPostById,
  postMockSkillBarterPost,
  applyMockSkillBarter,
  getMockReviewsByProfileId,
  postMockReview,
  getMockNotifications,
  markMockNotificationAsRead,
  getMockFreelancers,
  getMockFreelancerById,
  getMockUserProfile,
  updateMockUserProfile,
  getMockDashboardStats,
  getMockApplicantsForJob,
  generateMockJobPostAI,
  getMockLoyaltyPoints,
  getMockBadges,
  getMockMyPosts,
  getMockMyApplications,
  getMockEmployerApplications,
  acceptMockOffer,
  rejectMockOffer,
  updateMockJob,
  updateMockSkillBarterPost,
  deleteMockJob,
  deleteMockSkillBarterPost
} from "./mockApi";

const _backendApi = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

_backendApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

_backendApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url === "/token/refresh/") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return _backendApi(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;
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
          _backendApi.defaults.headers.common["Authorization"] = `Bearer ${access}`;
          processQueue(null, access);
          return _backendApi(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed", refreshError);
          processQueue(refreshError, null);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

const integratedPaths = [
  "/token/",
  "/users/me/",
  "/users/password/reset/",
  "/users/set_password/",
  "/users/",
  "/dashboard/",
];

const shouldUseMock = (url: string) => {
  const isIntegrated = integratedPaths.some(path => url.startsWith(path));
  return !isIntegrated;
};

export const loginUser = async (credentials: any) => {
    return _backendApi.post("/token/", credentials);
};

export const signupUser = async (userData: any) => {
    return _backendApi.post("/users/", userData);
};

export const getCommissionHistory = async () => {
  if (shouldUseMock("/commissions/history/")) {
    return getMockCommissionHistory();
  }
  return _backendApi.get("/commissions/history/");
};

export const getRecommendedJobs = async () => {
  if (shouldUseMock("/jobs/recommended/")) {
    return getMockRecommendedJobs();
  }
  return _backendApi.get("/jobs/recommended/");
};

export const getJobCategories = async () => {
  if (shouldUseMock("/job-categories/")) {
    return getMockJobCategories();
  }
  return _backendApi.get("/job-categories/");
};

export const getJobs = async () => {
  if (shouldUseMock("/jobs/")) {
    return getMockJobs();
  }
  return _backendApi.get("/jobs/");
};

export const getJobById = async (id: string) => {
  if (shouldUseMock(`/jobs/${id}/`)) {
    return getMockJobById(id);
  }
  return _backendApi.get(`/jobs/${id}/`);
};

export const postJob = async (jobData: any) => {
  if (shouldUseMock("/jobs/")) {
    return postMockJob(jobData);
  }
  return _backendApi.post("/jobs/", jobData);
};

export const applyJob = async (jobId: string, applicationData: any) => {
  if (shouldUseMock(`/jobs/${jobId}/apply/`)) {
    return applyMockJob(jobId, applicationData);
  }
  return _backendApi.post(`/jobs/${jobId}/apply/`, applicationData);
};

export const getSkillBarterPosts = async () => {
  if (shouldUseMock("/skill-barter-posts/")) {
    return getMockSkillBarterPosts();
  }
  return _backendApi.get("/skill-barter-posts/");
};

export const getSkillBarterPostById = async (id: string) => {
  if (shouldUseMock(`/skill-barter-posts/${id}/`)) {
    return getMockSkillBarterPostById(id);
  }
  return _backendApi.get(`/skill-barter-posts/${id}/`);
};

export const postSkillBarterPost = async (postData: any) => {
  if (shouldUseMock("/skill-barter-posts/")) {
    return postMockSkillBarterPost(postData);
  }
  return _backendApi.post("/skill-barter-posts/", postData);
};

export const applySkillBarter = async (postId: string, offerData: any) => {
  if (shouldUseMock(`/skill-barter-posts/${postId}/apply/`)) {
    return applyMockSkillBarter(postId, offerData);
  }
  return _backendApi.post(`/skill-barter-posts/${postId}/apply/`, offerData);
};

export const getReviewsByProfileId = async (profileId: string) => {
  if (shouldUseMock(`/reviews/?profile_id=${profileId}`)) {
    return getMockReviewsByProfileId(profileId);
  }
  return _backendApi.get(`/reviews/?profile_id=${profileId}`);
};

export const postReview = async (reviewData: any) => {
  if (shouldUseMock("/reviews/")) {
    return postMockReview(reviewData);
  }
  return _backendApi.post("/reviews/", reviewData);
};

export const getNotifications = async () => {
  if (shouldUseMock("/notifications/")) {
    return getMockNotifications();
  }
  return _backendApi.get("/notifications/");
};

export const markNotificationAsRead = async (id: string) => {
  if (shouldUseMock(`/notifications/${id}/mark_read/`)) {
    return markMockNotificationAsRead(id);
  }
  return _backendApi.post(`/notifications/${id}/mark_read/`);
};

export const getFreelancers = async () => {
  if (shouldUseMock("/freelancers/")) {
    return getMockFreelancers();
  }
  return _backendApi.get("/freelancers/");
};

export const getFreelancerById = async (id: string) => {
  if (shouldUseMock(`/freelancers/${id}/`)) {
    return getMockFreelancerById(id);
  }
  return _backendApi.get(`/freelancers/${id}/`);
};

export const getUserProfile = async () => {
  return _backendApi.get("/users/me/");
};

export const updateUserProfile = async (profileData: any) => {
  return _backendApi.patch("/users/me/", profileData);
};

export const getDashboardStats = async (userType: 'freelancer' | 'employer') => {
  return _backendApi.get(`/dashboard/${userType}/`);
};

export const getApplicantsForJob = async (jobId: string) => {
  if (shouldUseMock(`/jobs/${jobId}/applicants/`)) {
    return getMockApplicantsForJob(jobId);
  }
  return _backendApi.get(`/jobs/${jobId}/applicants/`);
};

export const generateJobPostAI = async (prompt: string) => {
  return generateMockJobPostAI(prompt);
};

export const getLoyaltyPoints = async () => {
  if (shouldUseMock("/loyalty-points/")) {
    return getMockLoyaltyPoints();
  }
  return _backendApi.get("/loyalty-points/");
};

export const getBadges = async () => {
  if (shouldUseMock("/badges/")) {
    return getMockBadges();
  }
  return _backendApi.get("/badges/");
};

export const getMyPosts = async (userId: string) => {
  if (shouldUseMock(`/skill-barter-posts/my-posts/?user_id=${userId}`)) {
    return getMockMyPosts(userId);
  }
  return _backendApi.get(`/skill-barter-posts/my-posts/`);
};

export const getMyApplications = async (userId: string) => {
  if (shouldUseMock(`/skill-barter-applications/my-applications/?user_id=${userId}`)) {
    return getMockMyApplications(userId);
  }
  return _backendApi.get(`/skill-barter-applications/my-applications/`);
};

export const getEmployerApplications = async (employerId: string) => {
  if (shouldUseMock(`/jobs/employer-applications/?employer_id=${employerId}`)) {
    return getMockEmployerApplications(employerId);
  }
  return _backendApi.get(`/jobs/employer-applications/`);
};

export const acceptOffer = async (offerId: string) => {
  if (shouldUseMock(`/skill-barter-offers/${offerId}/accept/`)) {
    return acceptMockOffer(offerId);
  }
  return _backendApi.post(`/skill-barter-offers/${offerId}/accept/`);
};

export const rejectOffer = async (offerId: string) => {
  if (shouldUseMock(`/skill-barter-offers/${offerId}/reject/`)) {
    return rejectMockOffer(offerId);
  }
  return _backendApi.post(`/skill-barter-offers/${offerId}/reject/`);
};

export const updateJob = async (jobId: string, jobData: any) => {
  if (shouldUseMock(`/jobs/${jobId}/`)) {
    return updateMockJob(jobId, jobData);
  }
  return _backendApi.patch(`/jobs/${jobId}/`, jobData);
};

export const updateSkillBarterPost = async (postId: string, postData: any) => {
  if (shouldUseMock(`/skill-barter-posts/${postId}/`)) {
    return updateMockSkillBarterPost(postId, postData);
  }
  return _backendApi.patch(`/skill-barter-posts/${postId}/`, postData);
};

export const deleteJob = async (jobId: string) => {
  if (shouldUseMock(`/jobs/${jobId}/`)) {
    return deleteMockJob(jobId);
  }
  return _backendApi.delete(`/jobs/${jobId}/`);
};

export const deleteSkillBarterPost = async (postId: string) => {
  if (shouldUseMock(`/skill-barter-posts/${postId}/`)) {
    return deleteMockSkillBarterPost(postId);
  }
  return _backendApi.delete(`/skill-barter-posts/${postId}/`);
};
