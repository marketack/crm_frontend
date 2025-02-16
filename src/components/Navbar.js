import React from "react";
import { AppBar, Toolbar, IconButton, Box, Typography, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = ({ darkMode, toggleDarkMode, setSidebarOpen, sidebarOpen }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" sx={{ width: `calc(100% - ${sidebarOpen ? 260 : 80}px)`, ml: `${sidebarOpen ? 260 : 80}px`, transition: "width 0.3s", background: darkMode ? "#1F1F1F" : "#FFFFFF", color: darkMode ? "#FFF" : "#006994" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Sidebar Toggle */}
        <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: darkMode ? "#FFF" : "#333" }}>
        </IconButton>

        {/* Title */}
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          CRM System
        </Typography>

        {/* Theme Toggle */}
        <Tooltip title="Toggle Theme">
          <IconButton sx={{ color: darkMode ? "#FFF" : "#333" }} onClick={toggleDarkMode}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
