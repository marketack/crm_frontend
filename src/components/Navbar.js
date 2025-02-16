import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = !!user;

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: darkMode ? "#1F1F1F" : "#FFFFFF",
        boxShadow: "none",
        color: darkMode ? "#FFF" : "#006994",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo Section */}
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
          <HomeIcon sx={{ marginRight: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            CRM
          </Typography>
        </Box>

        {/* Navigation Icons */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isLoggedIn ? (
            <>
              {/* Profile */}
              <Tooltip title="Profile">
                <IconButton sx={{ color: darkMode ? "#FFF" : "#333" }} onClick={() => navigate("/profile")}>
                  <PersonIcon />
                </IconButton>
              </Tooltip>

              {/* Logout */}
              <Tooltip title="Logout">
                <IconButton sx={{ color: darkMode ? "#FFF" : "#333" }} onClick={handleLogout}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              {/* Signup */}
              <Tooltip title="Signup">
                <IconButton sx={{ color: darkMode ? "#FFF" : "#333" }} onClick={() => navigate("/signup")}>
                  <AppRegistrationIcon />
                </IconButton>
              </Tooltip>

              {/* Login */}
              <Tooltip title="Login">
                <IconButton sx={{ color: darkMode ? "#FFF" : "#333" }} onClick={() => navigate("/login")}>
                  <LoginIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

          {/* Theme Toggle */}
          <Tooltip title="Toggle Theme">
            <IconButton sx={{ color: darkMode ? "#FFF" : "#333" }} onClick={toggleDarkMode}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
