import apiBase from "./apiBase";

interface Role {
  _id: string;
  name: string;
}


export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  subscriptionPlan: string;
  profileImage?: string;
  role: Role;
}


export interface ActivityLog {
  _id: string;
  userId: { _id: string; name: string; email: string };
  action: string;
  timestamp: string;
  ipAddress?: string;
}

/** ✅ Get User Profile */
export const getUserProfile = async (userId: string): Promise<User> => {
  try {
    const response = await apiBase.get<User>(`/users/${userId}`); // ✅ Matches new route
    return response.data; 
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

/** ✅ Get User Activity Logs */
export const getUserActivityLogs = async (userId: string): Promise<ActivityLog[]> => {
  try {
    const response = await apiBase.get<{ logs: ActivityLog[] }>(`/users/${userId}/activity-logs`); // ✅ Matches new route
    return response.data.logs || [];
  } catch (error) {
    console.error("Error fetching user activity logs:", error);
    return [];
  }
};

/** ✅ Update User Profile */
export const updateUserProfile = async (userId: string, updateData: Partial<User>) => {
  try {
    await apiBase.put(`/users/${userId}`, updateData); // ✅ Matches new route
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

/** ✅ Generate API Key */
export const generateApiKey = async (userId: string) => {
  try {
    const response = await apiBase.post(`/users/${userId}/api-key`);
    return response.data;
  } catch (error) {
    console.error("Error generating API key:", error);
    throw error;
  }
};

/** ✅ Revoke API Key */
export const revokeApiKey = async (userId: string) => {
  try {
    await apiBase.delete(`/users/${userId}/api-key`);
  } catch (error) {
    console.error("Error revoking API key:", error);
    throw error;
  }
};

/** ✅ Deactivate User */
export const deactivateUser = async (userId: string) => {
  try {
    await apiBase.put(`/users/${userId}/deactivate`); // ✅ Matches new route
  } catch (error) {
    console.error("Error deactivating user:", error);
    throw error;
  }
};

/** ✅ Delete User */
export const deleteUser = async (userId: string) => {
  try {
    await apiBase.delete(`/users/${userId}`); // ✅ Matches new route
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

/** ✅ Get User Subscription Status */
export const getUserSubscriptionStatus = async (userId: string): Promise<{ apiKey?: string }> => {
  try {
    const response = await apiBase.get<{ apiKey?: string }>(`/users/${userId}/subscriptions`);
    return { apiKey: response.data.apiKey ?? null }; // ✅ Ensure `apiKey` always exists
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return { apiKey: null };
  }
};


export const uploadProfileImage = async (userId: string, file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", userId);

    const response = await apiBase.post<{ imageUrl: string }>("users/upload-profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" }, // ✅ Required for file uploads
    });

    return response.data.imageUrl; // ✅ Return the uploaded image URL
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};

// ✅ Verify Email
export const verifyEmail = async (userId: string) => {
  try {
    const response = await apiBase.post(`/users/${userId}/verify-email`);
    return response.data;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};

// ✅ Verify Phone
export const verifyPhone = async (userId: string) => {
  try {
    const response = await apiBase.post(`/users/${userId}/verify-phone`);
    return response.data;
  } catch (error) {
    console.error("Error verifying phone:", error);
    throw error;
  }
};

// ✅ Change User Password
export const changeUserPassword = async (userId: string) => {
  try {
    const response = await apiBase.post(`/users/${userId}/change-password`);
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};
