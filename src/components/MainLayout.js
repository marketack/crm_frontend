import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = ({ darkMode, toggleDarkMode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const handleLogout = () => {
    // Remove authentication token (adjust based on how you're handling auth)
    localStorage.removeItem("authToken"); // Example: Remove token
  
    // Redirect to login page
    window.location.href = "/login"; 
  };
  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <CssBaseline />

      {/* Sidebar is Fixed and does NOT overlap content */}
      <Sidebar darkMode={darkMode} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={handleLogout} />

      {/* Main Content Wrapper */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          ml: `${sidebarOpen ? 260 : 80}px`, // ✅ Adjust margin-left to prevent content from going behind sidebar
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
