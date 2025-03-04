import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login, logout, register, verifyEmail } from "../../api/authService";

// ✅ Load user & token from localStorage (Ensure this is declared BEFORE initialState)
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

// ✅ Define Types for State and API Responses
// Define User Interface
interface User {
  _id: string; // ✅ Ensure `_id` is present
  name: string;
  email: string;
  roles: string[];
  profileImage?: string;
}


interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// ✅ Initial State (No duplicate declaration)
const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedUser,
  token: storedToken || null,
  loading: false,
  error: null,
};

// 🔑 Ensure user is set in Redux
export const userLogin = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      const data = response.data as { token: string; user: User };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// 🔑 Async Thunk: Register
export const userRegister = createAsyncThunk(
  "auth/register",
  async (userData: { name: string; email: string; password: string; phone: string }, { rejectWithValue }) => {
    try {
      const response = await register(userData);
      toast.success("✅ Registration successful! Verify your email.");
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data || "❌ Registration failed";
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
      const response = await verifyEmail(data);
      toast.success("✅ Email verified successfully!");
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data || "❌ Verification failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔐 Async Thunk: Logout
export const userLogout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("✅ Logged out successfully!");
    return true; // ✅ Ensure it returns something
  } catch (error: any) {
    const errorMessage = error.response?.data || "❌ Logout failed";
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
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
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔑 Register
      .addCase(userRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRegister.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 📧 Email Verification
      .addCase(verifyEmailAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailAction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyEmailAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔐 Logout
      .addCase(userLogout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ✅ Export Actions & Reducer
export const { resetError } = authSlice.actions;
export default authSlice.reducer;
