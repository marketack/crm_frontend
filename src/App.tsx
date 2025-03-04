import React, { useState, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Snackbar, Alert, Box } from "@mui/material";
import { useAppSelector } from "./redux/store";
import { lightTheme, darkTheme } from "./styles/theme";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Import Pages
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import UserProfile from "./pages/User/MainDashboard";
import Courses from "./pages/Courses/Courses";
import CourseDetail from "./pages/Courses/CourseDetail"; 
import SaasTools from "./pages/SaaS/SaasTools";

// ✅ Create Global Snackbar Context
const SnackbarContext = createContext<
  (message: string, severity: "success" | "error" | "info" | "warning") => void
>(() => {});

export const useSnackbar = () => useContext(SnackbarContext);

const App: React.FC = () => {
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const theme = darkMode ? darkTheme : lightTheme;

  const [snackbar, setSnackbar] = useState({
    message: "",
    severity: "info" as "success" | "error" | "info" | "warning",
    open: false,
  });

  // ✅ Function to show global notifications
  const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning") => {
    setSnackbar({ message, severity, open: true });
  };

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            {/* ✅ Layout Wrapper */}
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
              <Navbar />
              <Box sx={{ flexGrow: 1, mt: "64px", overflowY: "auto" }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />

                  {/* ✅ Admin Dashboard */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRoles={["admin"]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* ✅ SaaS Tools */}
                  <Route
                    path="/saas-tools"
                    element={
                      <ProtectedRoute requiredRoles={["admin", "staff"]}>
                        <SaasTools />
                      </ProtectedRoute>
                    }
                  />

                  {/* ✅ User Profile */}
                  <Route
                    path="/user/profile/:userId"
                    element={
                      <ProtectedRoute requiredRoles={["admin", "owner"]}>
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />

                  {/* ✅ Public Routes */}
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:courseId" element={<CourseDetail />} />

                  {/* ✅ Manage Courses */}
                  <Route
                    path="/admin/courses"
                    element={
                      <ProtectedRoute requiredRoles={["admin", "staff"]}>
                        <Courses />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Box>

              {/* ✅ Footer (Optional) */}
              <Box component="footer" sx={{ p: 2, textAlign: "center", bgcolor: "#f0f0f0" }}>
                © 2025 Marketack - All Rights Reserved.
              </Box>
            </Box>
          </Router>

          {/* ✅ Global Snackbar Notification */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert severity={snackbar.severity} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </ThemeProvider>
      </PersistGate>
    </SnackbarContext.Provider>
  );
};

export default App;
