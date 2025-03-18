import apiBase from "./apiBase"; // ✅ Use centralized API base

const AUTH_API_URL = "/auth";

interface LoginResponse {
  token: string;
  refreshToken?: string; // ✅ Make refreshToken optional if backend may not return it
  user: { _id: string; name: string; email: string; role: string }; // ✅ Ensure role exists
}

interface RefreshTokenResponse {
  token: string;
}

/**
 * ✅ Register User
 */
export const register = async (data: { name: string; email: string; password: string; phone: string }): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiBase.post<{ success: boolean; message: string }>(`${AUTH_API_URL}/register`, data);
    return response.data; // ✅ Returns only `data`
  } catch (error: any) {
    console.error("❌ Registration Error:", error.response?.data || error);
    throw error.response?.data || { success: false, message: "Registration failed", error };
  }
};


/**
 * ✅ Login User
 */
export const login = async (data: { email: string; password: string }): Promise<LoginResponse> => {
  try {
    const response = await apiBase.post<LoginResponse>(`${AUTH_API_URL}/login`, data);
    return response.data; // ✅ Ensure it returns only `data`
  } catch (error: any) {
    console.error("❌ Login Error:", error.response?.data || error);
    throw error.response?.data || { success: false, message: "Login failed", error };
  }
};


/**
 * ✅ Logout User
 */
export const logout = async () => {
  try {
    await apiBase.post(`${AUTH_API_URL}/logout`);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { success: true, message: "Logout successful" };
  } catch (error: any) {
    console.error("❌ Logout Error:", error.response?.data || error);
    return { success: false, message: error.response?.data?.message || "Logout failed", error };
  }
};

/**
 * ✅ Refresh Token
 */
export const refreshToken = async () => {
  try {
    const response = await apiBase.post<RefreshTokenResponse>(
      `${AUTH_API_URL}/refresh-token`,
      {},
      { withCredentials: true } // Ensures cookies are sent
    );

    const { token } = response.data; // ✅ Now TypeScript recognizes `token`

    if (token) {
      localStorage.setItem("token", token);
    }

    return response.data;
  } catch (error: any) {
    console.error("❌ Refresh Token Error:", error.response?.data || error);
    return { success: false, message: error.response?.data?.message || "Token refresh failed", error };
  }
};

/**
 * ✅ Send Verification Code for Phone
 */
export const sendPhoneVerificationCode = async (phone: string) => {
  try {
    const response = await apiBase.post(`${AUTH_API_URL}/verify-phone/send-code`, { phone });
    return response.data;
  } catch (error: any) {
    console.error("❌ Phone Verification Error:", error.response?.data || error);
    return { success: false, message: error.response?.data?.message || "Failed to send phone verification code", error };
  }
};

/**
 * ✅ Verify Phone Code
 */
export const verifyPhoneCode = async (phone: string, code: string) => {
  try {
    const response = await apiBase.post(`${AUTH_API_URL}/verify-phone`, { phone, code });
    return response.data;
  } catch (error: any) {
    console.error("❌ Phone Code Verification Error:", error.response?.data || error);
    return { success: false, message: error.response?.data?.message || "Phone verification failed", error };
  }
};

/**
 * ✅ Send Email Verification Code
 */
export const sendEmailVerificationCode = async (email: string) => {
  try {
    const response = await apiBase.post(`${AUTH_API_URL}/verify-email/send-code`, { email });
    return response.data;
  } catch (error: any) {
    console.error("❌ Email Verification Error:", error.response?.data || error);
    return { success: false, message: error.response?.data?.message || "Failed to send email verification code", error };
  }
};

/**
 * ✅ Verify Email Code
 */
export const verifyEmail = async (data: { email: string; otp: string }): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiBase.post<{ success: boolean; message: string }>(`${AUTH_API_URL}/verify-email`, data);
    return response.data; // ✅ Returns only `data`
  } catch (error: any) {
    console.error("❌ Email Verification Error:", error.response?.data || error);
    throw error.response?.data || { success: false, message: "Email verification failed", error };
  }
};


export default {
  register,
  login,
  logout,
  refreshToken,
  sendPhoneVerificationCode,
  verifyPhoneCode,
  sendEmailVerificationCode,
  verifyEmail,
};
