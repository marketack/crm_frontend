import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Leads from "./pages/Leads";
import Tasks from "./pages/Tasks";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Role from "./pages/RoleManagement";

import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  const { user } = useSelector((state) => state.auth);

  // Load dark mode preference from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"; // Convert to boolean
  });

  // Update dark mode in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Dynamic Theme Switching
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#1976D2" },
      secondary: { main: "#D32F2F" },
      background: {
        default: darkMode ? "#121212" : "#F5F5F5",
        paper: darkMode ? "#1E1E1E" : "#FFFFFF",
      },
      text: {
        primary: darkMode ? "#FFFFFF" : "#000000",
        secondary: darkMode ? "#B0B0B0" : "#444444",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={user ? <Navigate to="/" /> : <Home />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />

          {/* Protected Routes (Wrapped inside MainLayout) */}
          <Route element={<MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}>
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/role" element={<PrivateRoute element={<Role />} />} />

            <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
            <Route path="/customers" element={<PrivateRoute element={<Customers />} />} />
            <Route path="/leads" element={<PrivateRoute element={<Leads />} />} />
            <Route path="/tasks" element={<PrivateRoute element={<Tasks />} />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
