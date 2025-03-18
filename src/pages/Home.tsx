import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import {
  People,
  ContactMail,
  Article,
  Build,
  School,
  BusinessCenter,
  Language,
} from "@mui/icons-material";
import logo from "../assets/marketack-logo.png";

// ✅ Import CMS Components
import AboutUs from "./crm/components/cms/AboutUs";
import Blogs from "./crm/components/cms/Blogs";
import Contact from "./crm/components/cms/Contact";
import Services from "./crm/components/cms/Services";
import Team from "./crm/components/cms/Team";

// ✅ Sidebar Sections
const sections = [
  { label: "About Us", icon: <People />, value: "about" },
  { label: "Latest Blogs", icon: <Article />, value: "blogs" },
  { label: "Our Team", icon: <People />, value: "team" },
  { label: "Our Services", icon: <Build />, value: "services" },
  { label: "Contact Us", icon: <ContactMail />, value: "contact" },
];

const Home = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("about");

  // ✅ Section References
  const sectionRefs = {
    about: useRef(null),
    blogs: useRef(null),
    team: useRef(null),
    services: useRef(null),
    contact: useRef(null),
  };

  // ✅ Scroll to section when clicked
  const handleScrollToSection = (section) => {
    setActiveSection(section);
    sectionRefs[section]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Box display="flex" flexDirection="column" width="100vw" height="100vh" bgcolor="#0D0D0D">
      {/* ✅ Sidebar Navigation */}
      <Sidebar
        sections={sections}
        activeSection={activeSection}
        setActiveSection={handleScrollToSection}
      />

      {/* ✅ Main Content */}
      <Box sx={{ flexGrow: 1, overflowX: "hidden", width: "100%" }}>
        {/* ✅ Hero Section */}
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(circle at top, #1e1e2e, #0b0b12)",
            color: "white",
            textAlign: "center",
            px: 3,
            py: 5,
          }}
        >
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
            <img src={logo} alt="Marketack CRM" style={{ height: "140px", marginBottom: "20px", filter: "drop-shadow(0px 4px 10px rgba(255, 255, 255, 0.2))" }} />
            <Typography variant="h2" fontWeight="bold">
              Marketack CRM
            </Typography>
            <Typography variant="h5" sx={{ maxWidth: "700px", margin: "auto", color: "#aaa" }}>
              Your all-in-one solution for Learning, Networking, and SaaS tools.
            </Typography>
            <Grid container spacing={3} sx={{ mt: 5, justifyContent: "center" }}>
              <Grid item>
                <Button variant="contained" color="secondary" sx={{ px: 5, py: 1.5, borderRadius: "20px" }} startIcon={<School />} onClick={() => navigate("/courses")}>
                  Courses
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" sx={{ px: 5, py: 1.5, borderRadius: "20px" }} startIcon={<BusinessCenter />} onClick={() => navigate("/saas-tools")}>
                  SaaS Tools
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="success" sx={{ px: 5, py: 1.5, borderRadius: "20px" }} startIcon={<Language />} onClick={() => navigate("/networking")}>
                  Networking
                </Button>
              </Grid>
            </Grid>
          </motion.div>
        </Box>

        {/* ✅ CMS Sections with Animations */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          {[
            { title: "About Us", ref: sectionRefs.about, component: <AboutUs readOnly /> },
            { title: "Latest Blogs", ref: sectionRefs.blogs, component: <Blogs /> },
            { title: "Our Team", ref: sectionRefs.team, component: <Team /> },
            { title: "Our Services", ref: sectionRefs.services, component: <Services readOnly /> },
            { title: "Contact Us", ref: sectionRefs.contact, component: <Contact readOnly /> },
          ].map(({ title, ref, component }, index) => (
            <motion.div
              key={index}
              ref={ref}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              style={{ width: "100%", marginBottom: "40px" }}
            >
              <Card
                sx={{
                  borderRadius: "16px",
                  boxShadow: 6,
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  p: 3,
                  width: "100%",
                }}
              >
                <CardContent>
                  <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
                    {title}
                  </Typography>
                  {component}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Container>

      </Box>
    </Box>
  );
};

export default Home;
