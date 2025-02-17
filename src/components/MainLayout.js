import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { handleLogout } from "../services/authService";

const MainLayout = ({ darkMode, toggleDarkMode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // ✅ Automatically redirect to "/" if no token
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.log("🔄 No token found, redirecting to main page...");
      navigate("/");
    }
  }, [navigate]);

  // ✅ Logout and ensure token is cleared before redirect
  const logout = async () => {
    await handleLogout(navigate);
  };

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <CssBaseline />

      {/* Sidebar is Fixed and does NOT overlap content */}
      <Sidebar darkMode={darkMode} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={logout} />

      {/* Main Content Wrapper */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          ml: `${sidebarOpen ? 260 : 80}px`,
          transition: "margin-left 0.3s",
        }}
      >
        {/* Fixed Navbar at the Top */}
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />

        {/* Scrollable Content Area */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
