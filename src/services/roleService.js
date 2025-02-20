import API from "./api"; // Base Axios Config

// ✅ Fetch all roles
export const getRoles = async () => {
  const response = await API.get("/roles");
  return response.data;
};

// ✅ Create a new role
export const createRole = async (roleData) => {
  const response = await API.post("/roles", roleData);
  return response.data;
};

// ✅ Update role permissions
export const updateRole = async (roleId, roleData) => {
  const response = await API.put(`/roles/${roleId}`, roleData);
  return response.data;
};

// ✅ Delete a role
export const deleteRole = async (roleId) => {
  const response = await API.delete(`/roles/${roleId}`);
  return response.data;
};

// ✅ Fetch all permissions
export const getPermissions = async () => {
  const response = await API.get("/permissions");
  return response.data;
};

// ✅ Create a new permission
export const createPermission = async (permissionData) => {
  const response = await API.post("/permissions", permissionData);
  return response.data;
};

// ✅ Delete a permission
export const deletePermission = async (permissionId) => {
  const response = await API.delete(`/permissions/${permissionId}`);
  return response.data;
};
