import API from "./api";
import { toast } from "react-toastify";

// Get User Profile with Authorization Header
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("accessToken"); // Retrieve token
    if (!token) throw new Error("No token found");

    const response = await API.get("/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,  // Attach token
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      toast.error("Unauthorized. Please login again.");
    } else {
      toast.error("Failed to load user profile.");
    }
    throw error;
  }
};


// ✅ Update User Profile
export const updateUserProfile = async (userData) => {
  try {
    const response = await API.put("/users/profile", userData);
    toast.success("Profile updated successfully!");
    return response.data;
  } catch (error) {
    toast.error("Profile update failed.");
    throw error;
  }
};

// ✅ Get All Users (Admin only)
export const getAllUsers = async () => {
  try {
    const response = await API.get("/users");
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch users.");
    throw error;
  }
};

export const changeUserRole = async (email, newRole) => {
  try {
    const response = await API.put("/users/change-role", { email, newRole });
    toast.success(`User role updated to ${newRole}`);
    return response.data;
  } catch (error) {
    toast.error("Failed to update user role.");
    throw error;
  }
};