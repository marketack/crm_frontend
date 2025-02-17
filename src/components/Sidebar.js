import React from "react";
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, IconButton, Toolbar, Typography, Box, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const Sidebar = ({ darkMode, sidebarOpen, setSidebarOpen, onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, route: "/dashboard" },
    { text: "Leads", icon: <PeopleIcon />, route: "/leads" },
    { text: "Customers", icon: <PeopleIcon />, route: "/customers" },
    { text: "Tasks", icon: <AssignmentIcon />, route: "/tasks" },
    { text: "Support", icon: <SupportAgentIcon />, route: "/support" },
    { text: "Settings", icon: <SettingsIcon />, route: "/profile" },
  ];

  return (
    <Drawer
      variant="permanent"
      open={sidebarOpen}
      sx={{
        width: sidebarOpen ? 260 : 80,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: sidebarOpen ? 260 : 80,
          transition: "width 0.3s",
          backgroundColor: darkMode ? "#121212" : "#FFFFFF",
          color: darkMode ? "#E0E0E0" : "#1E1E2F",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
        },
      }}
    >
      {/* Sidebar Header */}
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
        {sidebarOpen && (
          <Typography variant="h6" sx={{ color: darkMode ? "#E0E0E0" : "#1E1E2F" }}>
            CRM System
          </Typography>
        )}
        <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ color: darkMode ? "#E0E0E0" : "#1E1E2F" }}>
          {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>

      <Divider sx={{ backgroundColor: darkMode ? "#555" : "#DDD" }} />

      {/* Sidebar Menu */}
      <List>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            component={Link}
            to={item.route}
            sx={{
              margin: "6px",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: location.pathname === item.route ? (darkMode ? "#333333" : "#1976D2") : "transparent",
              color: location.pathname === item.route ? "#FFFFFF" : darkMode ? "#E0E0E0" : "#1E1E2F",
              "&:hover": { backgroundColor: darkMode ? "#555555" : "#1976D2", color: "#FFFFFF" },
            }}
          >
            <ListItemIcon sx={{ color: darkMode ? "#E0E0E0" : "#1E1E2F" }}>{item.icon}</ListItemIcon>
            {sidebarOpen && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>

      {/* Logout Button */}
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Button fullWidth variant="contained" color="error" startIcon={<ExitToAppIcon />} onClick={onLogout}>
          {sidebarOpen ? "Logout" : ""}
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
