import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
  Collapse,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, ExpandMore, ExpandLess } from "@mui/icons-material";
import { createCompany, getAllCompanies, deleteCompany } from "../../api/companyService";

// ✅ Define Company Interface
export interface Company {
  _id: string;
  name: string;
  industry: string;
  email: string;
  phone: string;
  aboutUs: string;
  website?: string;
  address?: string;
  createdBy: string;
  updatedBy: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  createdAt?: string;
  updatedAt?: string;
}

const CompanyManagement: React.FC = () => {
  // ✅ Form Fields
  const [companyData, setCompanyData] = useState<Partial<Company>>({
    name: "",
    industry: "",
    email: "",
    phone: "",
    aboutUs: "We are a technology-driven company.",
    website: "",
    address: "",
  });

  // ✅ State for Companies
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null); // ✅ Expanded row for About Us
  const [alert, setAlert] = useState<{ message: string; severity: "success" | "error" | "warning" | "info" } | null>(
    null
  );

  useEffect(() => {
    fetchCompanies();
  }, []);

  // ✅ Fetch Companies
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await getAllCompanies();
      console.log("🔵 API Response:", response);

      if (response && "success" in response && Array.isArray(response.companies)) {
        setCompanies(response.companies);
      } else {
        setCompanies([]);
      }
    } catch (error) {
      console.error("❌ Error fetching companies:", error);
      setCompanies([]);
      setAlert({ message: "❌ Error fetching companies", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Input Change
  const handleInputChange = (field: keyof Company, value: string) => {
    setCompanyData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Create Company
  const handleCreateCompany = async () => {
    if (!companyData.name || !companyData.industry || !companyData.email || !companyData.phone || !companyData.aboutUs) {
      setAlert({ message: "⚠️ Please fill in all required fields.", severity: "warning" });
      return;
    }

    setCreating(true);
    try {
      await createCompany(companyData as Company);
      setAlert({ message: "✅ Company created successfully!", severity: "success" });
      setCompanyData({ name: "", industry: "", email: "", phone: "", aboutUs: "", website: "", address: "" });
      fetchCompanies();
    } catch (error) {
      setAlert({ message: "❌ Failed to create company", severity: "error" });
    } finally {
      setCreating(false);
    }
  };

  // ✅ Delete a Company
  const handleDeleteCompany = async (companyId: string) => {
    setDeleting(companyId);
    try {
      await deleteCompany(companyId);
      setAlert({ message: "✅ Company deleted successfully!", severity: "success" });
      fetchCompanies();
    } catch (error) {
      setAlert({ message: "❌ Failed to delete company", severity: "error" });
    } finally {
      setDeleting(null);
    }
  };

  // ✅ Toggle Expand for About Us
  const toggleExpand = (companyId: string) => {
    setExpandedRow(expandedRow === companyId ? null : companyId);
  };

  return (
    <Container maxWidth="lg">
      {/* ✅ Snackbar for Alerts */}
      <Snackbar open={!!alert} autoHideDuration={3000} onClose={() => setAlert(null)}>
  {alert ? <Alert severity={alert.severity}>{alert.message}</Alert> : <div />} 
</Snackbar>


      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
        🏢 Company Management
      </Typography>

      <Grid container spacing={3}>
        {/* ✅ Company Creation Form */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ p: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Create a New Company
              </Typography>
              {["name", "industry", "email", "phone", "aboutUs", "website", "address"].map((field) => (
                <TextField
                  key={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={companyData[field as keyof Company] || ""}
                  onChange={(e) => handleInputChange(field as keyof Company, e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  multiline={field === "aboutUs"}
                  required={["name", "industry", "email", "phone", "aboutUs"].includes(field)}
                />
              ))}
              <Button
                variant="contained"
                fullWidth
                startIcon={<AddIcon />}
                onClick={handleCreateCompany}
                sx={{ mt: 2, backgroundColor: "#1976d2", color: "#fff", "&:hover": { backgroundColor: "#115293" } }}
                disabled={creating}
              >
                {creating ? <CircularProgress size={24} /> : "Add Company"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* ✅ Company List Table */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Existing Companies
            </Typography>
            {loading ? (
              <CircularProgress sx={{ display: "block", margin: "auto" }} />
            ) : companies.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Company Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Industry</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>About Us</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {companies.map((company) => (
                      <React.Fragment key={company._id}>
                        <TableRow>
                          <TableCell>{company.name}</TableCell>
                          <TableCell>{company.industry}</TableCell>
                          <TableCell>{company.email}</TableCell>
                          <TableCell>
                            <Tooltip title={company.aboutUs} arrow>
                              <Typography sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200 }}>
                                {company.aboutUs.slice(0, 50)}...
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleDeleteCompany(company._id)} color="error">
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No companies found</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CompanyManagement;
