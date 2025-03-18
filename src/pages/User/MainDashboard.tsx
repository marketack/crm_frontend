import React, { useState } from "react";
import { Container, Paper, Tabs, Tab, Box, Typography, Button } from "@mui/material";
import UserManagement from "./UserManagement";
import CompanyManagement from "./CompanyManagement";
import DepartmentManagement from "./DepartmentManagement";
import EmployeeManagement from "./EmployeeManagement"; // ✅ Import EmployeeManagement

const MainDashboard: React.FC = () => {
  const [tabIndex, setTabIndex] = useState<number>(1); // ✅ Default to "Company Management"
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);

  console.log("📌 Current Tab Index:", tabIndex);
  console.log("📌 Selected Company ID:", selectedCompanyId);
  console.log("📌 Selected Department ID:", selectedDepartmentId);

  // ✅ Handle Company Selection (Stay in "Company Management")
  const handleCompanySelect = (companyId: string) => {
    console.log("📌 Selected Company ID:", companyId);
    setSelectedCompanyId(companyId);
    setSelectedDepartmentId(null); // ✅ Reset department selection
    setTabIndex(1); // ✅ Stay in "Company Management"
  };

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h3"
        sx={{ textAlign: "center", my: 3, fontWeight: "bold", cursor: "pointer" }}
      >
        🏢 Main Dashboard
      </Typography>

      <Paper sx={{ p: 3, mt: 3, boxShadow: 4 }}>
        {/* ✅ Tabs Section */}
        <Tabs 
          value={tabIndex} 
          onChange={(_event, newIndex) => {
            console.log("📌 Changing tab to:", newIndex);

            // ✅ Prevent clicking "Employees" without a department
            if (newIndex === 3 && (!selectedCompanyId || !selectedDepartmentId)) return;

            setTabIndex(newIndex);
          }}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="User Management" sx={{ fontWeight: "bold", fontSize: "16px" }} />
          <Tab label="Company Management" sx={{ fontWeight: "bold", fontSize: "16px" }} />
          <Tab 
            label="Departments" 
            sx={{ fontWeight: "bold", fontSize: "16px", cursor: selectedCompanyId ? "pointer" : "not-allowed" }} 
            disabled={!selectedCompanyId} 
          />
          <Tab 
            label="Employees" 
            sx={{ fontWeight: "bold", fontSize: "16px", cursor: selectedDepartmentId ? "pointer" : "not-allowed" }} 
            disabled={!selectedDepartmentId} 
          />
        </Tabs>

        {/* ✅ Content Section */}
        <Box sx={{ mt: 3 }}>
          {tabIndex === 0 && <UserManagement />}
          {tabIndex === 1 && <CompanyManagement onCompanySelect={handleCompanySelect} />}
          {tabIndex === 2 && selectedCompanyId && (
            <DepartmentManagement 
              companyId={selectedCompanyId} 
              onDepartmentSelect={(departmentId) => {
                setSelectedDepartmentId(departmentId);
                setTabIndex(3); // ✅ Automatically switch to "Employees" tab
              }} 
            />
          )}
          {tabIndex === 3 && selectedCompanyId && selectedDepartmentId && (
            <EmployeeManagement 
              companyId={selectedCompanyId} 
              departmentId={selectedDepartmentId} 
            />
          )}
        </Box>
      </Paper>

      {/* ✅ Reset Selection Button */}
      {selectedCompanyId && (
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button variant="outlined" color="warning" onClick={() => {
            console.log("📌 Resetting selections");
            setSelectedCompanyId(null);
            setSelectedDepartmentId(null);
            setTabIndex(1); // ✅ Stay on Company Management tab
          }}>
            Reset Selections
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default MainDashboard;