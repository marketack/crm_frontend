import axios from "axios";
import API_BASE_URL from "./apiConfig";

const api = axios.create({
  baseURL: `${API_BASE_URL}/subscriptions`,
  headers: { "Content-Type": "application/json" },
});

const SubscriptionService = {
  getUserSubscriptions: () => api.get("/"),
  subscribeToTool: (toolId: string) => api.post(`/${toolId}`),
  unsubscribeFromTool: (subscriptionId: string) => api.delete(`/${subscriptionId}`),
};

export default SubscriptionService;
