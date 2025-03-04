import React, { useState } from "react";
import { Container, Paper, Tabs, Tab, Box, Typography } from "@mui/material";
import UserManagement from "./UserManagement";
import CompanyManagement from "./CompanyManagement";

const MainDashboard: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Container maxWidth="lg">
      <Typography variant="h3" sx={{ textAlign: "center", my: 3, fontWeight: "bold" }}>
        Admin Dashboard
      </Typography>

      <Paper sx={{ p: 3, mt: 3, boxShadow: 4 }}>
        <Tabs 
          value={tabIndex} 
          onChange={(_event, newIndex) => setTabIndex(newIndex)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="User Management" sx={{ fontWeight: "bold", fontSize: "16px" }} />
          <Tab label="Company Management" sx={{ fontWeight: "bold", fontSize: "16px" }} />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {tabIndex === 0 && <UserManagement />}
          {tabIndex === 1 && <CompanyManagement />}
        </Box>
      </Paper>
    </Container>
  );
};

export default MainDashboard;
