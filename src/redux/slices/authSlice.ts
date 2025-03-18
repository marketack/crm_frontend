import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login, logout, register, verifyEmail } from "../../api/authService";
import apiClient from "../../api/apiClient"; // ✅ Used for API calls

// ✅ Load user & tokens from localStorage
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");
const storedRefreshToken = localStorage.getItem("refreshToken");
const storedUserId = localStorage.getItem("userId"); // ✅ Store userId separately

// ✅ Define User Interface
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  userId: string | null;
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

// ✅ Initial State
const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  userId: storedUserId || null, // ✅ Load userId from storage
  isAuthenticated: !!storedUser,
  token: storedToken || null,
  refreshToken: storedRefreshToken || null,
  loading: false,
  error: null,
};

// 🔑 Async Thunk: Login
export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password, keepMeSignedIn }: { email: string; password: string; keepMeSignedIn: boolean }, { rejectWithValue }) => {
    try {
      const data = await login({ email, password }); // ✅ Directly return `data` without response.data

      // ✅ Store Access Token & User Info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userId", data.user._id); // ✅ Store userId separately

      // ✅ Store Refresh Token (Only if received)
      if (data.refreshToken && keepMeSignedIn) {
        localStorage.setItem("refreshToken", data.refreshToken);
      } else {
        localStorage.removeItem("refreshToken");
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

// 🔄 Async Thunk: Refresh Token (Auto-Renewal)
export const refreshAccessToken = createAsyncThunk("auth/refresh-token", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<{ token: string }>("/auth/refresh-token", { refreshToken: localStorage.getItem("refreshToken") });

    const { token } = response.data; // ✅ Access `data.token` instead of `response.token`

    // ✅ Update Access Token in Storage
    localStorage.setItem("token", token);

    return token;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Token refresh failed");
  }
});

// 🔑 Async Thunk: Register
export const userRegister = createAsyncThunk(
  "auth/register",
  async (userData: { name: string; email: string; password: string; phone: string }, { rejectWithValue }) => {
    try {
      const data = await register(userData); // ✅ Directly use `data`
      toast.success("✅ Registration successful! Verify your email.");
      return data;
    } catch (error: any) {
      const errorMessage = error.message || "❌ Registration failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// 📧 Async Thunk: Verify Email
export const verifyEmailAction = createAsyncThunk(
  "auth/verifyEmail",
  async (data: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await verifyEmail(data); // ✅ Directly use `response`
      toast.success("✅ Email verified successfully!");
      return response;
    } catch (error: any) {
      const errorMessage = error.message || "❌ Verification failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔐 Async Thunk: Logout
export const userLogout = createAsyncThunk("auth/logout", async (_, { rejectWithValue, getState }) => {
  try {
    const state: any = getState(); // ✅ Get Redux state
    const token = state.auth.token || localStorage.getItem("token"); // ✅ Use stored token if Redux state is empty

    if (token) {
      await apiClient.post("auth/logout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    // ✅ Clear all stored tokens after successful logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId"); // ✅ Remove stored userId
    localStorage.removeItem("refreshToken");

    toast.info("✅ Logged out successfully!");
    return true;
  } catch (error: any) {
    console.error("🔥 Logout failed:", error);

    // ✅ Clear tokens even if logout fails
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("refreshToken");

    return rejectWithValue(error.message || "❌ Logout failed");
  }
});

// ✅ Create Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
      
    },
    
  },
  extraReducers: (builder) => {
    builder
      // 🔑 Login
      .addCase(userLogin.fulfilled, (state, action: PayloadAction<{ token: string; refreshToken?: string; user: User }>) => {
        state.user = action.payload.user;
        state.userId = action.payload.user._id; // ✅ Store userId in state
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null; // ✅ Handle missing refreshToken safely
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔄 Refresh Token
      .addCase(refreshAccessToken.fulfilled, (state, action: PayloadAction<string>) => {
        state.token = action.payload;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.user = null;
        state.userId = null; // ✅ Clear userId on token failure
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })

      // 🔑 Register
      .addCase(userRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 📧 Email Verification
      .addCase(verifyEmailAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔐 Logout
      .addCase(userLogout.fulfilled, (state) => {
        state.user = null;
        state.userId = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(userLogout.rejected, (state) => {
        state.user = null;
        state.userId = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  },
});

// ✅ Export Actions & Reducer
export const { resetError } = authSlice.actions;
export default authSlice.reducer;
