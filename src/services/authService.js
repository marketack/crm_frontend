import API from "./api";
import axios from "axios";
import { toast } from "react-toastify";


export const handleLogout = async (navigate) => {
  try {
    console.log("🔄 Logging out...");

    // ✅ Remove tokens from localStorage BEFORE making API request
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    // ✅ Call logout API (even if CORS is removed)
    await API.post("/auth/logout", {}, { withCredentials: true });

    console.log("✅ Logout successful!");

    // ✅ Redirect to the main page
    navigate("/");
  } catch (error) {
    console.error("❌ Logout failed:", error.response?.data || error.message);
    
    // ✅ Ensure redirection even if API request fails
    navigate("/");
  }
};

// ✅ Register User
export const registerUser = async (userData) => {
  try {
    if (!userData.firstName || !userData.lastName || !userData.username || !userData.email || !userData.phoneNumber || !userData.password) {
      toast.error("All fields are required!");
      return;
    }

    const response = await API.post("/auth/register", userData);
    toast.success("Account created successfully! Please log in.");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Signup failed.");
    throw error;
  }
};

// ✅ Login User (Secure Token Handling)
export const loginUser = async (loginData) => {
  try {
    const response = await API.post("/auth/login", loginData);
    const { accessToken, user } = response.data;

    // Store access token and user info
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    toast.success("Login successful!");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed.");
    throw error;
  }
};

// ✅ Logout User (Clear Tokens & Server Refresh Token)
export const logoutUser = async () => {
  try {
    await API.post("/auth/logout", {}, { withCredentials: true });
  } catch (error) {
    console.error("Logout failed:", error);
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  toast.success("Logged out successfully!");
};

// ✅ Forgot Password
export const forgotPassword = async (email) => {
  try {
    const response = await API.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    toast.error("Failed to send reset link.");
    throw error;
  }
};

// ✅ Verify OTP for Password Reset
export const verifyOtp = async (otpData) => {
  try {
    const response = await API.post("/auth/verify-otp", otpData);
    return response.data;
  } catch (error) {
    toast.error("Invalid OTP.");
    throw error;
  }
};

// ✅ Reset Password
export const resetPassword = async (resetData) => {
  try {
    const response = await API.post("/auth/reset-password", resetData);
    return response.data;
  } catch (error) {
    toast.error("Password reset failed.");
    throw error;
  }
};

// ✅ Refresh Token Handling
export const refreshToken = async () => {
  try {
    const response = await axios.post("/api/auth/refresh-token", {}, { withCredentials: true });
    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    console.error("Token refresh failed", error);
    return null;
  }
};

// ✅ Attach Authorization Header Automatically
axios.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("accessToken");

    // Refresh token if expired
    if (isTokenExpiring(token)) {
      token = await refreshToken();
      if (!token) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; // Redirect if refresh fails
      }
    }

    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Check if Token is Expiring Soon
const isTokenExpiring = (token) => {
  if (!token) return true;
  const { exp } = JSON.parse(atob(token.split(".")[1]));
  return Date.now() >= exp * 1000 - 60000; // Refresh 1 min before expiry
};
