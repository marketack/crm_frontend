import React, { useState, useMemo } from "react";
import { Grid, Container, Typography, CssBaseline, ThemeProvider } from "@mui/material";
import { motion } from "framer-motion";
import Sidebar from "../../components/Sidebar";
import RolesManagement from "./RolesManagement";
import UsersManagement from "./UsersManagement";
import SubscriptionsManagement from "./SubscriptionsManagement";
import CmsManagement from "./CmsManagement";
import { Settings, Group, Subscriptions, Article } from "@mui/icons-material";
import { useAppSelector } from "../../redux/store"; // ✅ Redux for dark mode
import { darkTheme, lightTheme } from "../../styles/theme"; // ✅ Theme import

interface Section {
  label: string;
  icon: React.ReactNode;
  value: string;
  component: React.ReactNode;
}

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("roles");
  const darkMode = useAppSelector((state) => state.theme.darkMode); // ✅ Use Redux dark mode
  const theme = darkMode ? darkTheme : lightTheme; // ✅ Apply Redux theme

  const sections: Section[] = useMemo(
    () => [
      { label: "Manage Roles", icon: <Settings />, value: "roles", component: <RolesManagement /> },
      { label: "Manage Users", icon: <Group />, value: "users", component: <UsersManagement /> },
      { label: "Manage Subscriptions", icon: <Subscriptions />, value: "subscriptions", component: <SubscriptionsManagement /> },
      { label: "Manage CMS", icon: <Article />, value: "cms", component: <CmsManagement /> },
    ],
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container sx={{ height: "100vh", overflow: "hidden" }}>
        {/* Sidebar */}
        <Sidebar sections={sections} activeSection={activeSection} setActiveSection={setActiveSection} />

        {/* Main Content */}
        <Grid
          item
          xs={12}
          sm={9}
          md={10}
          sx={{
            ml: "280px", // Adjusted to fit new sidebar width
            padding: "40px",
            minHeight: "100vh",
            transition: "all 0.3s ease-in-out",
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
        >
          <Container>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
              🔧 Admin Dashboard
            </Typography>

            {/* Smooth Section Transition */}
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{
                background: theme.palette.background.paper,
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
              }}
            >
              {sections.find((section) => section.value === activeSection)?.component}
            </motion.div>
          </Container>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default AdminDashboard;
