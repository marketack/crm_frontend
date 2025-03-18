import React, { useState, useEffect } from "react";
import { Outlet, useLocation, Link as RouterLink } from "react-router-dom";
import { Box, Typography, Breadcrumbs, Link, Divider } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import Comments from "./components/Comments";

// ✅ Sidebar Sections
const sections = [
  { label: "Dashboard", icon: "📊", value: "dashboard", path: "/dashboard" },

  { label: "Leads", icon: "📞", value: "leads", path: "/leads" },
  { label: "Deals", icon: "💰", value: "deals", path: "/deals" },
  { label: "Projects", icon: "📂", value: "projects", path: "/projects" },
  { label: "Tasks", icon: "✅", value: "tasks", path: "/tasks" },
  { label: "Invoices", icon: "🧾", value: "invoices", path: "/invoices" },
  { label: "Transactions", icon: "💳", value: "transactions", path: "/transactions" },
  { label: "Tickets", icon: "🎟️", value: "tickets", path: "/tickets" },
  { label: "Files", icon: "📁", value: "files", path: "/files" },
  { label: "Logs", icon: "📜", value: "logs", path: "/logs" },
  { label: "Contacts", icon: "📇", value: "contacts", path: "/contacts" },
  { label: "Feedback", icon: "📝", value: "feedback", path: "/feedback" },

  // ✅ Admin Management Section inside CRM
  { label: "Manage Roles", icon: "⚙️", value: "roles", path: "/roles" },
  { label: "Manage Users", icon: "👤", value: "users", path: "/users" },
  { label: "Manage Subscriptions", icon: "💼", value: "subscriptions", path: "/subscriptions" },
  { label: "Manage CMS", icon: "📰", value: "cms", path: "/cms" },
];

const MainCrm: React.FC = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("dashboard");

  // ✅ Automatically detect and set active section based on URL
  useEffect(() => {
    const matchedSection = sections.find((section) => location.pathname.includes(section.value));
    if (matchedSection) setActiveSection(matchedSection.value);
  }, [location.pathname]);

  // ✅ Breadcrumbs Logic (Home > Section)
  const breadcrumbItems = [
    <Link key="home" underline="hover" color="inherit" component={RouterLink} to="/">
      CRM
    </Link>,
    <Typography key="current" color="text.primary">
      {sections.find((s) => s.value === activeSection)?.label || "CRM"}
    </Typography>,
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* ✅ Sidebar Navigation */}
      <Sidebar sections={sections} activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* ✅ Main Content */}
      <Box sx={{ flexGrow: 1, padding: { xs: "16px", md: "24px" }, marginLeft: { xs: 0, md: "100px" } }}>
        
        {/* ✅ Breadcrumb Navigation */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 2 }}>
          {breadcrumbItems}
        </Breadcrumbs>

        <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          {sections.find((s) => s.value === activeSection)?.label || "CRM"}
        </Typography>

        <Divider sx={{ marginBottom: 3 }} />

        <Outlet /> {/* ✅ Renders the correct subpage */}

        {/* ✅ Attach Comments only for relevant pages */}
        {["projects", "leads", "deals", "tasks"].includes(activeSection) && <Comments relatedTo={location.pathname} />}
      </Box>
    </Box>
  );
};

export default MainCrm;
