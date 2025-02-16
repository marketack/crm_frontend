import API from "./api";

import { toast } from "react-toastify";

// Register User
export const registerUser = async (userData) => {
  try {
    // Check if required fields are missing
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


export const loginUser = async (loginData) => {
  try {
    const response = await API.post("/auth/login", loginData);
    const { accessToken, refreshToken, user } = response.data;

    // Store tokens and user data
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));

    toast.success("Login successful!");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed.");
    throw error;
  }
};

// Logout User
export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

// Forgot Password
export const forgotPassword = async (email) => {
  const response = await API.post("/auth/forgot-password", { email });
  return response.data;
};

// Verify OTP for Forgot Password
export const verifyOtp = async (otpData) => {
  const response = await API.post("/auth/verify-otp", otpData);
  return response.data;
};

// Reset Password
export const resetPassword = async (resetData) => {
  const response = await API.post("/auth/reset-password", resetData);
  return response.data;
};

// Refresh Token
export const refreshToken = async (token) => {
  const response = await API.post("/auth/refresh-token", { token });
  return response.data;
};
