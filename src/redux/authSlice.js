import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/api";

// Async action for login
export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/auth/login", userData);

    // Store access token and user in localStorage
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async action for logout
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
});

// Async action for forgot password
export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email, { rejectWithValue }) => {
  try {
    const response = await axios.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: { 
    user: JSON.parse(localStorage.getItem("user")) || null, // Persist user
    error: null, 
    loading: false 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = action.payload.message;
      });
  }
});

export default authSlice.reducer;
