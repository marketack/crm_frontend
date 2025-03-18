import axios from "axios";
import API_BASE_URL from "./apiConfig";

const apiBase = axios.create({
  baseURL: API_BASE_URL, // ✅ Ensures all API requests use the correct base URL
  withCredentials: true, // ✅ Ensures cookies are always sent
});

// ✅ Attach Auth Token Before Requests
apiBase.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ✅ Get the latest auth token
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // ✅ Attach token to requests
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiBase;
