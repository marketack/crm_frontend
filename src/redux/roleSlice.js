import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all roles
export const fetchRoles = createAsyncThunk("roles/fetchRoles", async () => {
  const response = await axios.get("http://localhost:3001/api/roles");
  return response.data;
});

// Fetch all permissions
export const fetchPermissions = createAsyncThunk("roles/fetchPermissions", async () => {
  const response = await axios.get("http://localhost:3001/api/permissions");
  return response.data;
});

// Add a new role
export const addRole = createAsyncThunk("roles/addRole", async (roleData, { rejectWithValue }) => {
  try {
    const response = await axios.post("http://localhost:3001/api/roles", roleData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to add role");
  }
});

// Modify an existing role
export const modifyRole = createAsyncThunk("roles/modifyRole", async ({ roleId, roleData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`http://localhost:3001/api/roles/${roleId}`, roleData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to modify role");
  }
});

// Remove a role
export const removeRole = createAsyncThunk("roles/removeRole", async (roleId, { rejectWithValue }) => {
  try {
    await axios.delete(`http://localhost:3001/api/roles/${roleId}`);
    return roleId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to remove role");
  }
});

const roleSlice = createSlice({
  name: "roles",
  initialState: {
    roles: [],
    permissions: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Roles
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Fetch Permissions
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.permissions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Add Role
      .addCase(addRole.fulfilled, (state, action) => {
        state.roles.push(action.payload);
      })
      .addCase(addRole.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Modify Role
      .addCase(modifyRole.fulfilled, (state, action) => {
        const index = state.roles.findIndex((role) => role._id === action.payload._id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      })
      .addCase(modifyRole.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Remove Role
      .addCase(removeRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter((role) => role._id !== action.payload);
      })
      .addCase(removeRole.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default roleSlice.reducer;
