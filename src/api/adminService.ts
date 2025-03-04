import axios from "axios";
import API_BASE_URL from "./apiConfig";

const ADMIN_API_URL = `${API_BASE_URL}/admin`;

const api = axios.create({
  baseURL: ADMIN_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Ensure `Authorization` token is included
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {}; // Ensure headers exist
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * 🛠️ **Admin API Service**
 * Handles **Roles, Permissions, Users, and Subscriptions**
 */
const AdminService = {
  // 🆕 Create a new role
  createRole: async (roleData: { name: string; permissions: string[] }) => {
    return api.post("/roles", roleData);
  },

  // 📜 Get all roles
  getAllRoles: async () => {
    return api.get("/roles");
  },

  // ✏️ Update role permissions
  updateRolePermissions: async (roleId: string, permissions: string[]) => {
    return api.put(`/roles/${roleId}`, { permissions });
  },

  // ❌ Delete a role
  deleteRole: async (roleId: string) => {
    return api.delete(`/roles/${roleId}`);
  },

  // 🔑 Assign role to a user
  assignRoleToUser: async (userId: string, roleId: string) => {
    return api.post("/users/assign-role", { userId, roleId });
  },

  // 🚫 Remove role from a user
  removeRoleFromUser: async (userId: string, roleId: string) => {
    return api.post("/users/remove-role", { userId, roleId });
  },

  // 🚀 Assign permission to a role
  assignPermissionToRole: async (roleId: string, permission: string) => {
    return api.post("/roles/assign-permission", { roleId, permission });
  },

  // 🔄 Remove permission from a role
  removePermissionFromRole: async (roleId: string, permission: string) => {
    return api.post("/roles/remove-permission", { roleId, permission });
  },

  // ✅ **Fetch all users (Admin Only)**
  getAllUsers: async () => {
    return api.get("/users");
  },

  // 👤 **Fetch a single user by ID**
  getUserById: async (userId: string) => {
    return api.get(`/users/${userId}`);
  },

  // ✅ **Create a new user (Admin Only)**
  createUser: async (userData: { name: string; email: string; password: string }) => {
    return api.post("/users", userData);
  },

  // 🔄 **Update user details (Admin Only)**
  updateUser: async (userId: string, updateData: Partial<{ name: string; email: string; roles: string[] }>) => {
    return api.put(`/users/${userId}`, updateData);
  },

  // ❌ **Delete user (Admin Only)**
  deleteUser: async (userId: string) => {
    return api.delete(`/users/${userId}`);
  },

  // 🛠️ **Update user roles (Admin Only)**
  updateUserRoles: async (userId: string, roles: string[]) => {
    return api.put(`/users/${userId}/roles`, { roles });
  },

  // 📊 **Fetch system statistics (Example)**
  getSystemStats: async () => {
    return api.get("/stats");
  },

  /**
   * 🔥 **Subscription Management APIs (New)**
   */
  // 📜 Get all subscriptions (Admin Only)
  getAllSubscriptions: async () => {
    return api.get("/subscriptions");
  },

  // 🔄 **Update a subscription (change status)**
  updateSubscriptionStatus: async (subscriptionId: string, status: "active" | "canceled" | "expired") => {
    return api.put(`/subscriptions/${subscriptionId}`, { status });
  },

  // 🆕 **Manually create a subscription for a user**
  createSubscription: async (userId: string, toolId: string, plan: string, billingCycle: string) => {
    return api.post("/subscriptions", { userId, toolId, plan, billingCycle });
  },

  // ❌ **Cancel a subscription (Admin Only)**
  cancelSubscription: async (subscriptionId: string) => {
    return api.delete(`/subscriptions/${subscriptionId}`);
  },
};

export default AdminService;
