import axios from "axios";
import API_BASE_URL from "./apiConfig";

const USER_API_URL = `${API_BASE_URL}/user`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Ensure headers exist before modifying
api.interceptors.request.use((config) => {
  if (!config.headers) {
    config.headers = {};
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * ✅ User API Services
 */
export const getUserProfile = (userId: string) => {
  console.log(`🔵 Fetching User Profile: ${USER_API_URL}/profile/${userId}`);
  return api.get(`${USER_API_URL}/profile/${userId}`);
};

export const updateUserProfile = (userId: string, data: any) => {
  console.log(`🟠 Updating User Profile: ${USER_API_URL}/profile/${userId}`);
  return api.put(`${USER_API_URL}/profile/${userId}`, data);
};

export const getUserActivityLogs = () => {
  console.log(`📜 Fetching Activity Logs: ${USER_API_URL}/activity-logs`);
  return api.get(`${USER_API_URL}/activity-logs`);
};

export const generateApiKeyForUser = () => {
  console.log(`🔑 Generating API Key: ${USER_API_URL}/api-key`);
  return api.post(`${USER_API_URL}/api-key`);
};

export const revokeApiKeyForUser = (apiKey: string) => {
  console.log(`🚫 Revoking API Key: ${USER_API_URL}/api-key`);
  return api.delete(`${USER_API_URL}/api-key`, { params: { apiKey } });
};

export const deactivateUser = () => {
  console.log(`🛑 Deactivating User: ${USER_API_URL}/deactivate`);
  return api.put(`${USER_API_URL}/deactivate`);
};

export const deleteUser = () => {
  console.log(`❌ Deleting User: ${USER_API_URL}`);
  return api.delete(`${USER_API_URL}`);
};

export default {
  getUserProfile,
  updateUserProfile,
  getUserActivityLogs,
  generateApiKeyForUser,
  revokeApiKeyForUser,
  deactivateUser,
  deleteUser,
};
