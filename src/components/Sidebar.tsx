import React, { useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { toggleDarkMode } from "../redux/slices/themeSlice";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4 from "@mui/icons-material/Brightness4";
import Brightness7 from "@mui/icons-material/Brightness7";

// ✅ Define TypeScript Props
interface SidebarProps {
  sections: { label: string; icon: React.ReactNode; value: string }[];
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sections, activeSection, setActiveSection }) => {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          width: hovered ? 220 : 80,
          height: "100vh",
          backdropFilter: "blur(20px)",
          backgroundColor: darkMode ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)",
          color: darkMode ? "#fff" : "#333",
          position: "fixed",
          left: 0,
          top: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: hovered ? "flex-start" : "center",
          justifyContent: "space-between",
          padding: "16px",
          boxShadow: darkMode
            ? "4px 0px 20px rgba(0, 0, 0, 0.8)"
            : "4px 0px 15px rgba(0, 0, 0, 0.1)",
          borderRadius: "0px 16px 16px 0px",
          transition: "width 0.3s ease-in-out",
        }}
      >
     
        {/* 📌 Sidebar Menu Items */}
        <List sx={{ width: "100%", textAlign: "center" }}>
          {sections.map((item) => (
            <motion.div key={item.value} whileHover={{ scale: 1.1 }}>
              <Tooltip title={hovered ? "" : item.label} placement="right">
                <ListItemButton
                  onClick={() => setActiveSection(item.value)}
                  selected={activeSection === item.value}
                  sx={{
                    display: "flex",
                    justifyContent: hovered ? "flex-start" : "center",
                    borderRadius: "10px",
                    marginBottom: "8px",
                    padding: "12px",
                    color: activeSection === item.value ? "#fff" : darkMode ? "#bbb" : "#333",
                    backgroundColor: activeSection === item.value
                      ? darkMode
                        ? "#ffea00"
                        : "#6200ea"
                      : "transparent",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: darkMode ? "#3a3a4d" : "#f0f0f0",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
                  {hovered && <ListItemText primary={item.label} />}
                </ListItemButton>
              </Tooltip>
            </motion.div>
          ))}
        </List>

    
      </Box>
    </motion.div>
  );
};

export default Sidebar;
