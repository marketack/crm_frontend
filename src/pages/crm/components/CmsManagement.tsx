import React, { useState } from "react";
import { Container, Typography, Tabs, Tab, Box } from "@mui/material";
import AboutUs from "./cms/AboutUs";
import Blogs from "./cms/Blogs";

import Contact from "./cms/Contact";
import Newsletter from "./cms/Newsletter";
import Services from "./cms/Services"; // ✅ Import Services Component

const CmsManagement: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
        📊 CMS Management
      </Typography>

      <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} centered>
  <Tab label="About Us" />
  <Tab label="Manage Blogs" />

  <Tab label="Contact" />
  <Tab label="Newsletter" />
  <Tab label="Manage Services" />
</Tabs>

<Box sx={{ mt: 3 }}>
  {tabIndex === 0 && <AboutUs readOnly={false} />} {/* ✅ Editable for Admins */}
  {tabIndex === 1 && <Blogs readOnly={false} />}

  {tabIndex === 3 && <Contact />}
  {tabIndex === 4 && <Newsletter />}
  {tabIndex === 5 && <Services readOnly={false} />
}
</Box>

    </Container>
  );
};

export default CmsManagement;
