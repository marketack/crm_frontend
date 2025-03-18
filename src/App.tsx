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
import UserProfile from "./pages/User/MainDashboard";
import Courses from "./pages/Courses/Courses";
import CourseDetail from "./pages/Courses/CourseDetail";
import SaasTools from "./pages/SaaS/SaasTools";
import MainCrm from "./pages/crm/MainCrm";

// ✅ CRM Pages
import Dashboard from "./pages/crm/components/Dashboard";

import Leads from "./pages/crm/components/Leads";
import Deals from "./pages/crm/components/Deals";
import Projects from "./pages/crm/components/Projects";

import Tasks from "./pages/crm/components/Tasks";
import Invoices from "./pages/crm/components/Invoices";
import Transactions from "./pages/crm/components/Transactions";
import Tickets from "./pages/crm/components/Tickets";
import Files from "./pages/crm/components/Files";
import Logs from "./pages/crm/components/Logs";
import Contacts from "./pages/crm/components/Contacts";
import Feedback from "./pages/crm/components/Feedback";

// ✅ Admin Dashboard Subpages (Moved under CRM)
import RolesManagement from "./pages/crm/components/RolesManagement";

import SubscriptionsManagement from "./pages/crm/components/SubscriptionsManagement";
import CmsManagement from "./pages/crm/components/CmsManagement";

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
              {/* ✅ Navbar with Fixed Bottom Margin */}
              <Box sx={{ height: "64px", width: "100%", mb: 2 }}> 
                <Navbar />
              </Box>

              {/* ✅ Page Content with Top Padding to Avoid Overlap */}
              <Box sx={{ flexGrow: 1, paddingTop: "20px", overflowY: "auto" }}>
                <Routes>
                  {/* ✅ Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />

                  {/* ✅ SaaS Tools */}
                  <Route
                    path="/saas-tools"
                    element={
                        <SaasTools />
                    }
                  />

                  {/* ✅ User Profile */}
                  <Route
                    path="/user/profile/:userId"
                    element={
                      <ProtectedRoute requiredRoles={["admin", "owner","customer","staff"]}>
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />

                  {/* ✅ Courses */}
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:courseId" element={<CourseDetail />} />
                  <Route
                    path="/admin/courses"
                    element={
                      <ProtectedRoute requiredRoles={["admin", "staff","owner"]}>
                        <Courses />
                      </ProtectedRoute>
                    }
                  />

                  {/* ✅ CRM Main Page with Sidebar */}
                  <Route
                    path="/crm"
                    element={
                      <ProtectedRoute requiredRoles={["admin", "staff","owner"]}>
                        <MainCrm />
                      </ProtectedRoute>
                    }
                  >
                    {/* ✅ CRM Subpages */}
                    <Route path="dashboard" element={<Dashboard />} />

                    <Route path="leads" element={<Leads />} />
                    <Route path="deals" element={<Deals />} />
                   <Route path="projects" element={<Projects />} />
                    <Route path="tasks" element={<Tasks />} />
                    <Route path="invoices" element={<Invoices />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="tickets" element={<Tickets />} />
                    <Route path="files" element={<Files />} />
                    <Route path="logs" element={<Logs />} />
                    <Route path="contacts" element={<Contacts />} />
                    <Route path="feedback" element={<Feedback />} />

                    {/* ✅ Admin Subsections under CRM */}
                    <Route path="roles" element={<RolesManagement />} />

                    <Route path="subscriptions" element={<SubscriptionsManagement />} />
                    <Route path="cms" element={<CmsManagement />} />
                  </Route>
                </Routes>
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
