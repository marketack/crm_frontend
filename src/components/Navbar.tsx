import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Badge,
  Typography,
  Button,
  Divider,
  Avatar,
  Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { userLogout } from "../redux/slices/authSlice";
import { toggleTheme } from "../redux/store";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";

import logo from "../assets/marketack-logo.png";
import NotificationService from "../api/notificationService";
import { getProfileImage } from "../utils/imageHelper"; // ✅ Global Image Handler
import { getUserProfile } from "../api/userService"; // ✅ Fetch User API
import { motion } from "framer-motion";

// ✅ TypeScript Interfaces
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  read: boolean;
}

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // ✅ State Management
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const token = useAppSelector((state) => state.auth.token) || "";

  // ✅ Get User from LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser?.id;
  
        if (userId) {
          getUserProfile(userId)
            .then((data) => {
              setUser({
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role.name || "user",
                profileImage: data.profileImage ?? "/default-profile.png",
              });
            })
            .catch((error) => console.error("❌ Error fetching user:", error));
        }
      } catch (error) {
        console.error("❌ Error parsing user data from localStorage:", error);
      }
    }
  }, []);
  

  // ✅ Fetch Notifications
  useEffect(() => {
    if (!token) return;
    NotificationService.getUserNotifications(token)
      .then((data: Notification[]) => {
        setNotifications(data);
        setUnreadCount(data.filter((notif) => !notif.read).length);
      })
      .catch((error) => console.error("❌ Error fetching notifications:", error));
  }, [user]);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: "rgba(26, 26, 46, 0.6)",
          backdropFilter: "blur(10px)",
          boxShadow: "none",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* ✅ Logo */}
          <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <motion.img
              src={logo}
              alt="Marketack Logo"
              style={{ height: "50px", marginRight: "10px" }}
              initial={{ scale: 1, rotate: 0 }}
              animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.2 }}
            />
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
              Marketack
            </Typography>
          </Box>

          {/* ✅ Icons & Actions */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* 🔔 Notifications */}
            <Box sx={{ position: "relative", cursor: "pointer" }} onMouseEnter={() => setShowNotifications(true)} onMouseLeave={() => setShowNotifications(false)}>
              <IconButton sx={{ color: "#ffffff" }}>
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              {showNotifications && (
                <Paper sx={{ position: "absolute", top: "40px", right: 0, width: "300px", bgcolor: "#2b2b40", boxShadow: 3, borderRadius: "8px", zIndex: 999 }}>
                  <Typography variant="h6" sx={{ p: 2, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    Notifications
                  </Typography>
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <Box key={notif._id} sx={{ p: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.1)", cursor: "pointer", "&:hover": { bgcolor: "#3a3a4d" } }}>
                        <Typography variant="body1" fontWeight="bold">
                          {notif.title}
                        </Typography>
                        <Typography variant="body2">{notif.message}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography sx={{ p: 2, textAlign: "center" }}>No new notifications</Typography>
                  )}
                </Paper>
              )}
            </Box>

            {/* 🌙 Dark Mode Toggle */}
            <IconButton sx={{ color: "#ffffff", ml: 1 }} onClick={() => dispatch(toggleTheme())}>
              <DarkModeIcon />
            </IconButton>

            {/* 👤 User Actions */}
            {!user ? (
              <Button component={Link} to="/login" variant="text" sx={{ color: "#fff" }}>
                <LoginIcon sx={{ mr: 1 }} /> Login
              </Button>
            ) : (
              <>
                {/* ✅ Profile Avatar with Image Fix */}
                <Avatar
                  src={getProfileImage(user?.profileImage)}
                  sx={{ width: 40, height: 40, cursor: "pointer", mx: 1 }}
                  onClick={(event) => setMenuAnchorEl(event.currentTarget)}
                />
                <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={() => setMenuAnchorEl(null)}>
                  <MenuItem component={Link} to={`/user/profile/${user._id}`} onClick={() => setMenuAnchorEl(null)}>
                    <AccountCircleIcon sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                  {user.role === "owner" && (
                    <MenuItem component={Link} to="/crm/dashboard" onClick={() => setMenuAnchorEl(null)}>
                      <AdminPanelSettingsIcon sx={{ mr: 1 }} />
                      CRM
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={() => { dispatch(userLogout()); navigate("/"); }}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
