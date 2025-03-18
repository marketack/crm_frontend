import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { motion } from "framer-motion";
import { useAppSelector } from "../redux/store";

// ✅ Define TypeScript Props
interface SidebarProps {
  sections: { label: string; icon: React.ReactNode; value: string }[];
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sections, activeSection, setActiveSection }) => {
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  const navigate = useNavigate(); // ✅ React Router Hook for navigation
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          width: 80,
          height: "100vh",
          backdropFilter: "blur(10px)", // ✅ Transparent but blurred effect
          backgroundColor: "rgba(0, 0, 0, 0.05)", // ✅ Keeps the sidebar visible subtly
          color: darkMode ? "#fff" : "#333",
          position: "fixed",
          left: 0,
          top: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
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
          {sections.map((item, index) => (
            <motion.div
              key={item.value}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.1 }}
              style={{ position: "relative" }}
            >
              <ListItemButton
                onClick={() => {
                  setActiveSection(item.value);
                  navigate(`/crm/${item.value}`); // ✅ Navigate to the correct path
                }}
                selected={activeSection === item.value}
                sx={{
                  display: "flex",
                  justifyContent: "center",
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
                    backgroundColor: "rgba(255,255,255,0.1)", // ✅ Light transparent hover effect
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
              </ListItemButton>

              {/* ✅ Tooltip Hover Effect (Fixed Duplicate Issue) */}
              {hoveredIndex === index && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  style={{
                    position: "absolute",
                    left: 80,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: darkMode ? "#222" : "#fff",
                    color: darkMode ? "#fff" : "#000",
                    padding: "6px 12px",
                    borderRadius: "5px",
                    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                    whiteSpace: "nowrap",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {item.label}
                </motion.div>
              )}
            </motion.div>
          ))}
        </List>
      </Box>
    </motion.div>
  );
};

export default Sidebar;
