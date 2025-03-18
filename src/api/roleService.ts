import apiClient from "./apiClient";
import { store } from "../redux/store"; // ✅ Get user from Redux

// ✅ Define Role Type
export interface Role {
  _id: string;
  name: string;
  permissions: string[];
  createdAt?: string;
  updatedAt?: string;
}

// ✅ Define ErrorResponse
interface ErrorResponse {
  success: boolean;
  message: string;
  error?: any;
}

// ✅ API Base URL
const ROLE_API_URL = "/roles";

/** ✅ Get All Roles */
export const getAllRoles = async (): Promise<Role[] | ErrorResponse> => {
  try {
    console.log("📡 Fetching Roles...");
    
    const response = await apiClient.get<{ success: boolean; roles?: Role[] }>(ROLE_API_URL);
    
    console.log("✅ API Response:", response.data);

    if (response.data.success && Array.isArray(response.data.roles)) {
      return response.data.roles;
    }

    return { success: false, message: "Unexpected API response format", error: response.data };
  } catch (error: any) {
    console.error("❌ Error fetching roles:", error.response?.data || error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch roles", error };
  }
};

/** ✅ Create a Role */
export const createRole = async (roleData: { name: string; permissions: string[] }): Promise<Role | ErrorResponse> => {
  console.log("📡 Creating Role:", roleData);

  try {
    const response = await apiClient.post<{ success: boolean; role?: Role; message?: string }>(
      ROLE_API_URL, 
      roleData
    );

    console.log("✅ API Response:", response.data);

    if (response.data.success && response.data.role) {
      return response.data.role;
    }

    return { success: false, message: response.data.message || "Failed to create role" };
  } catch (error: any) {
    console.error("❌ Error creating role:", error.response?.data || error);
    return { success: false, message: error.response?.data?.message || "API request failed", error };
  }
};

/** ✅ Update Role Permissions */
export const updateRolePermissions = async (
  roleId: string, 
  permissions: string[]
): Promise<Role | ErrorResponse> => {
  console.log(`📡 Updating Role Permissions for Role ID: ${roleId}`);

  try {
    const response = await apiClient.put<{ success: boolean; role?: Role; message?: string }>(
      `${ROLE_API_URL}/${roleId}`, 
      { permissions }
    );

    console.log("✅ API Response:", response.data);

    if (response.data.success && response.data.role) {
      return response.data.role;
    }

    return { success: false, message: response.data.message || "Failed to update role permissions" };
  } catch (error: any) {
    console.error("❌ Error updating role permissions:", error.response?.data || error);
    return { success: false, message: error.response?.data?.message || "API request failed", error };
  }
};

/** ✅ Delete a Role */
export const deleteRole = async (roleId: string): Promise<{ success: boolean; message: string } | ErrorResponse> => {
  console.log(`📡 Deleting Role ID: ${roleId}`);

  try {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `${ROLE_API_URL}/${roleId}`
    );

    console.log("✅ API Response:", response.data);

    if (response.data.success) {
      return response.data;
    }

    return { success: false, message: "Failed to delete role" };
  } catch (error: any) {
    console.error("❌ Error deleting role:", error.response?.data || error);
    return { success: false, message: error.response?.data?.message || "API request failed", error };
  }
};

/**
 * ✅ Export all functions
 */
export default {
  getAllRoles,
  createRole,
  updateRolePermissions,
  deleteRole,
};
