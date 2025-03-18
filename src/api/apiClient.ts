import apiBase from "./apiBase"; // ✅ Import centralized API base
import { store } from "../redux/store"; // ✅ Correct import
import { userLogout } from "../redux/slices/authSlice";

const API_URL = `${apiBase.defaults.baseURL}/auth`; // ✅ Use `apiBase` for consistency

// ✅ Define the expected response type
interface RefreshTokenResponse {
  accessToken: string;
}

let isRefreshing = false; // ✅ Prevents multiple refresh requests
let refreshSubscribers: ((token: string) => void)[] = [];

// ✅ Function to call subscribers with new token
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// ✅ Axios Interceptor: Handle 401 Unauthorized Errors
apiBase.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // ✅ Explicitly define response type
          const { data } = await apiBase.post<RefreshTokenResponse>(
            `/auth/refresh-token`, // ✅ Corrected API endpoint
            {},
            { withCredentials: true }
          );

          console.log("✅ Access Token Refreshed:", data.accessToken);

          // ✅ Store the new token
          localStorage.setItem("token", data.accessToken);

          // ✅ Update **only the `apiBase` instance**, not global Axios defaults
          apiBase.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;

          // ✅ Notify all requests waiting for the token refresh
          onRefreshed(data.accessToken);

          isRefreshing = false;
          return apiBase(originalRequest);
        } catch (refreshError) {
          console.error("🔥 Refresh Token Error:", refreshError);

          isRefreshing = false;
          refreshSubscribers = [];

          // ✅ If refresh fails, log out the user
          store.dispatch(userLogout());
          return Promise.reject(refreshError);
        }
      }

      // ✅ Wait for refresh token process to complete before retrying requests
      return new Promise((resolve) => {
        refreshSubscribers.push((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          resolve(apiBase(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default apiBase;
