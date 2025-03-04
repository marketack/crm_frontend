import React, { useState, useRef } from "react";
import { Container, Grid, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { People, ContactMail, Article, Build, School, BusinessCenter, Language } from "@mui/icons-material";
import logo from "../assets/marketack-logo.png";

// ✅ Import CMS Components
import AboutUs from "./cms/AboutUs";
import Blogs from "./cms/Blogs";
import Contact from "./cms/Contact";
import Services from "./cms/Services";
import Team from "./cms/Team";

// ✅ Sidebar Sections with Refs
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

  // ✅ Create references for each section
  const sectionRefs: { [key: string]: React.RefObject<HTMLDivElement> } = {
    about: useRef(null),
    blogs: useRef(null),
    team: useRef(null),
    services: useRef(null),
    contact: useRef(null),
  };

  // ✅ Scroll to the selected section
  const handleScrollToSection = (section: string) => {
    setActiveSection(section);
    sectionRefs[section]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Box display="flex" width="100vw" height="100vh">
      {/* ✅ Sidebar with Section Navigation */}
      <Sidebar
        sections={sections}
        activeSection={activeSection}
        setActiveSection={handleScrollToSection} // ✅ Scrolls when clicked
      />

      {/* ✅ Page Content */}
      <Box sx={{ flexGrow: 1, overflowX: "hidden", paddingLeft: { xs: 0, md: "80px" } }}>
        {/* ✅ Hero Section */}
        <Box
          sx={{
            textAlign: "center",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #4b4da0 30%, #222437 90%)",
            color: "white",
            px: 3,
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <img src={logo} alt="Marketack CRM" style={{ height: "80px", marginBottom: "20px" }} />
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Empowering Businesses with Marketack
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: "600px", margin: "auto", color: "#ddd" }}>
              The all-in-one platform for Learning, Networking, and SaaS solutions.
            </Typography>

            {/* ✅ Navigation Buttons */}
            <Grid container spacing={2} sx={{ mt: 4, justifyContent: "center" }}>
              <Grid item>
                <Button variant="contained" color="secondary" size="large" startIcon={<School />} onClick={() => navigate("/courses")}>
                  Courses
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" size="large" startIcon={<BusinessCenter />} onClick={() => navigate("/saas-tools")}>
                  SaaS Tools
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="success" size="large" startIcon={<Language />} onClick={() => navigate("/networking")}>
                  Networking
                </Button>
              </Grid>
            </Grid>
          </motion.div>
        </Box>

        {/* ✅ CMS Sections with Refs */}
        {[
          { title: "About Us", ref: sectionRefs.about, component: <AboutUs readOnly /> },
          { title: "Latest Blogs", ref: sectionRefs.blogs, component: <Blogs /> },
          { title: "Our Team", ref: sectionRefs.team, component: <Team readOnly /> },
          { title: "Our Services", ref: sectionRefs.services, component: <Services readOnly /> },
          { title: "Contact Us", ref: sectionRefs.contact, component: <Contact readOnly /> },
        ].map(({ title, ref, component }, index) => (
          <Container key={index} maxWidth="lg" sx={{ mt: 10 }} ref={ref}>
            <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
              {title}
            </Typography>
            {component}
          </Container>
        ))}
      </Box>
    </Box>
  );
};

export default Home;
