import axios from "axios";
import API_BASE_URL from "./apiConfig";

const api = axios.create({
  baseURL: `${API_BASE_URL}/saas`,
  headers: { "Content-Type": "application/json" },
});

// ✅ Function to get Auth Token from Local Storage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // Ensure token is stored in localStorage
  return { Authorization: `Bearer ${token}` };
};

export interface SaaSTool {
  _id: string;
  name: string;
  description: string;
  price: number;
  url: string;
}

export interface Subscription {
  _id: string;
  userId: string;
  toolId: string;
  toolName: string;
  status: string;
}

/**
 * SaaS Service API calls
 */
const SaaSService = {
  // Fetch all SaaS tools
  getAllSaaSTools: () => api.get<SaaSTool[]>("/"),

  // Get a single SaaS tool by ID
  getSaaSToolById: (toolId: string) => api.get<SaaSTool>(`/${toolId}`),

  // Create a new SaaS tool (Admin only) ✅ Fix: Send Auth Token
  createSaaSTool: (toolData: Omit<SaaSTool, "_id">) =>
    api.post("/", toolData, { headers: getAuthHeaders() }),

  // Update an existing SaaS tool (Admin only) ✅ Fix: Send Auth Token
  updateSaaSTool: (toolId: string, toolData: Partial<SaaSTool>) =>
    api.put(`/${toolId}`, toolData, { headers: getAuthHeaders() }),

  // Delete a SaaS tool (Admin only) ✅ Fix: Send Auth Token
  deleteSaaSTool: (toolId: string) =>
    api.delete(`/${toolId}`, { headers: getAuthHeaders() }),

  // Fetch all subscriptions (Admin only) ✅ Fix: Send Auth Token
  getAllSubscriptions: () =>
    api.get<Subscription[]>("/subscriptions", { headers: getAuthHeaders() }),

  // Fetch user's subscriptions
  getUserSubscriptions: () => api.get<Subscription[]>("/subscriptions/user"),

  // Subscribe to a SaaS tool
  subscribeToTool: (toolId: string) =>
    api.post(`/subscriptions/${toolId}`, {}, { headers: getAuthHeaders() }),

  // Unsubscribe from a SaaS tool
  unsubscribeFromTool: (subscriptionId: string) =>
    api.delete(`/subscriptions/${subscriptionId}`, { headers: getAuthHeaders() }),
};

export default SaaSService;
