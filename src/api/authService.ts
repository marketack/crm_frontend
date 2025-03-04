import axios from "axios";
import API_BASE_URL from "./apiConfig";

const API_URL = `${API_BASE_URL}/auth`;

/**
 * ✅ Register User
 */
export const register = async (data: { name: string; email: string; password: string; phone: string }) => {
  return await axios.post(`${API_URL}/register`, data);
};

/**
 * ✅ Login User
 */
export const login = async (data: { email: string; password: string }) => {
  return await axios.post(`${API_URL}/login`, data);
};

/**
 * ✅ Logout User
 */
export const logout = async () => {
  return await axios.post(`${API_URL}/logout`);
};

/**
 * ✅ Refresh Token
 */
export const refreshToken = async (refreshToken: string) => {
  return await axios.post(`${API_URL}/refresh-token`);
};

/**
 * ✅ Send Verification Code for Phone
 */
export const sendPhoneVerificationCode = (phone: string) =>
  axios.post(`${API_URL}/verify-phone/send-code`, { phone });

/**
 * ✅ Verify Phone Code
 */
export const verifyPhoneCode = (phone: string, code: string) =>
  axios.post(`${API_URL}/verify-phone`, { phone, code });

/**
 * ✅ Send Email Verification Code
 */
export const sendEmailVerificationCode = async (email: string) => {
  return await axios.post(`${API_URL}/verify-email/send-code`, { email });
};

/**
 * ✅ Verify Email Code
 */
export const verifyEmail = async (data: { email: string; otp: string }) => {
  return await axios.post(`${API_URL}/verify-email`, data);
};

export default {
  register,
  login,
  logout,
  refreshToken,
  sendPhoneVerificationCode,
  verifyPhoneCode,
  sendEmailVerificationCode, // ✅ New API added
  verifyEmail,
};
