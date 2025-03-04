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
  Drawer,
  List,
  ListItem,
  ListItemText,
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
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "../assets/marketack-logo.png";
import NotificationService from "../api/notificationService";

// ✅ TypeScript Interfaces
interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
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

  // ✅ User & Theme State
  const user = useAppSelector((state) => state.auth.user) as unknown as User | null;
  const token = useAppSelector((state) => state.auth.token) || "";
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const isAdmin = user?.roles?.includes("admin") || false;

  // ✅ Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // ✅ Menu Handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLDivElement>) =>
    setMenuAnchorEl(event.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);
  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

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
      {/* ✅ Navbar with Glassmorphism */}
      <AppBar
        position="fixed"
        sx={{
          background: darkMode
            ? "rgba(26, 26, 46, 0.6)"
            : "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(10px)",
          boxShadow: "none",
          borderBottom: darkMode
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* ✅ Logo */}
          <Box
            component={Link}
            to="/"
            sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
          >
            <img src={logo} alt="Logo" style={{ height: "50px", marginRight: "10px" }} />
            <Typography variant="h6" sx={{ fontWeight: "bold", color: darkMode ? "#fff" : "#333" }}>
              Marketack
            </Typography>
          </Box>

          {/* ✅ Icons & Actions */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* 🔔 Notifications with Hover */}
            <Box
              sx={{ position: "relative", cursor: "pointer" }}
              onMouseEnter={() => setShowNotifications(true)}
              onMouseLeave={() => setShowNotifications(false)}
            >
              <IconButton sx={{ color: darkMode ? "#ffffff" : "#333" }}>
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* 📩 Notifications Dropdown */}
              {showNotifications && (
                <Paper
                  sx={{
                    position: "absolute",
                    top: "40px",
                    right: 0,
                    width: "300px",
                    bgcolor: darkMode ? "#2b2b40" : "#ffffff",
                    boxShadow: 3,
                    borderRadius: "8px",
                    zIndex: 999,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      p: 2,
                      borderBottom: "1px solid",
                      borderColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    Notifications
                  </Typography>
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <Box
                        key={notif._id}
                        sx={{
                          p: 2,
                          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                          cursor: "pointer",
                          "&:hover": { bgcolor: darkMode ? "#3a3a4d" : "#f0f0f0" },
                        }}
                      >
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
            <IconButton sx={{ color: darkMode ? "#ffffff" : "#333", ml: 1 }} onClick={() => dispatch(toggleTheme())}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {/* 👤 User Actions */}
            {!user ? (
              <>
                <Button component={Link} to="/login" variant="text" sx={{ color: darkMode ? "#fff" : "#333" }}>
                  <LoginIcon sx={{ mr: 1 }} /> Login
                </Button>
              </>
            ) : (
              <>
                {/* ✅ Profile Avatar with Menu */}
                <Avatar
                  src={user?.profileImage || ""}
                  sx={{ width: 32, height: 32, cursor: "pointer", mx: 1 }}
                  onClick={(event) => handleMenuOpen(event)}
                />
                <Menu
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem component={Link} to={`/user/profile/${user.id}`} onClick={handleMenuClose}>
                    <AccountCircleIcon sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem component={Link} to="/admin" onClick={handleMenuClose}>
                      <AdminPanelSettingsIcon sx={{ mr: 1 }} />
                      Admin Panel
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={() => dispatch(userLogout())}>
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
