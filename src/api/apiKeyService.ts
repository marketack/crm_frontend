import axios from "axios";
import API_BASE_URL from "./apiConfig";

const api = axios.create({
  baseURL: `${API_BASE_URL}/user`,
  headers: { "Content-Type": "application/json" },
});

interface ApiKey {
  key: string;
  expiresAt: string;
}

const ApiKeyService = {
  /**
   * ✅ Generate API Key
   */
  generateApiKey: async (token: string): Promise<ApiKey | null> => {
    try {
      const response = await api.post<{ apiKey: ApiKey }>("/api-key", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.apiKey;
    } catch (error) {
      console.error("Error generating API Key:", error);
      return null;
    }
  },

  /**
   * ✅ Revoke API Key (Fixed Axios issue)
   */
  revokeApiKey: async (token: string, apiKey: string): Promise<boolean> => {
    try {
      await api.request({
        method: "DELETE",
        url: "/api-key",
        headers: { Authorization: `Bearer ${token}` },
        params: { apiKey }, // ✅ Corrected: Use `params` instead of `data`
      });
      return true;
    } catch (error) {
      console.error("Error revoking API Key:", error);
      return false;
    }
  },

  /**
   * ✅ Get User API Keys
   */
  getUserApiKeys: async (token: string): Promise<ApiKey[]> => {
    try {
      const response = await api.get<{ apiKeys: ApiKey[] }>("/api-keys", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.apiKeys;
    } catch (error) {
      console.error("Error fetching API Keys:", error);
      return [];
    }
  },
};

export default ApiKeyService;
