import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api"; // ✅ Import API instance

// 🔹 Async action for user login
export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await API.post("/auth/login", userData);

    // ✅ Store token & user data in localStorage
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

// 🔹 Async action for user logout
export const logoutUser = createAsyncThunk("auth/logout", async (_, { dispatch, rejectWithValue }) => {
  try {
    await API.post("/auth/logout", {}, { withCredentials: true });

    // ✅ Clear local storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    // ✅ Reset Redux state
    dispatch(clearAuthState());

    return true;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Logout failed");
  }
});

// 🔹 Async action for password reset
export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email, { rejectWithValue }) => {
  try {
    const response = await API.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to send reset email");
  }
});

// 🔹 Async action for refreshing token
export const refreshToken = createAsyncThunk("auth/refreshToken", async (_, { rejectWithValue }) => {
  try {
    const response = await API.post("/auth/refresh-token", {}, { withCredentials: true });

    // ✅ Store new access token
    localStorage.setItem("accessToken", response.data.accessToken);

    return response.data.accessToken;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Token refresh failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    error: null,
    loading: false,
    isAuthenticated: !!localStorage.getItem("accessToken"),
  },
  reducers: {
    clearAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Login Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Logout Cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      // 🔹 Forgot Password Cases
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 🔹 Refresh Token Cases
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
