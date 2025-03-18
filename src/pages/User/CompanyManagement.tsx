import React, { useState, useEffect, useReducer } from "react";
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  Paper,
  Box,

} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline, Business, Apartment, Edit, Delete } from "@mui/icons-material";
import { getAllCompanies, createCompany, updateCompany, deleteCompany } from "../../api/companyService";
import { Company } from "../../api/companyService";
import { useSelector } from "react-redux";

const initialState = {
  name: "",
  industry: "",
  email: "",
  phone: "",
  website: "",
  aboutUs: "",
  address: "",
  employees: [],
  subscriptionPlan: "free",
  subscriptionStatus: "active",
};

const formReducer = (state: typeof initialState, action: { type: string; field?: string; value?: any }) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field!]: action.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

interface CompanyManagementProps {
  onCompanySelect: (companyId: string) => void;

}

const CompanyManagement: React.FC<CompanyManagementProps> = ({ onCompanySelect }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [alert, setAlert] = useState<{ message: string; severity: "success" | "error" }>({
    message: "",
    severity: "success",
  });
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [showAddCompany, setShowAddCompany] = useState<boolean>(false);
  const [editing, setEditing] = useState(false);

  const darkMode = useSelector((state: any) => state.theme.darkMode);
  const themeTextColor = darkMode ? "#FFFFFF" : "#000000";
  const cardBgColor = darkMode ? "#252525" : "#FFFFFF";

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await getAllCompanies();
  
      if ("success" in response && !response.success) {
        // ✅ Handle API errors correctly
        console.error("❌ Error fetching company:", response.message);
        setAlert({ message: response.message, severity: "error" });
        setCompanies([]); // ✅ Clear companies in case of error
        return;
      }
  
      // ✅ Ensure we have a valid company object
      console.log("✅ Company Fetched:", response);
      setCompanies([response as Company]); // ✅ Explicitly cast to Company for TypeScript
    } catch (error: any) {
      console.error("❌ Error fetching company:", error);
      setAlert({ message: `❌ Error: ${error.message || "Failed to load company"}`, severity: "error" });
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  const handleCompanySelect = (companyId: string) => {
    const company = companies.find((c) => c._id === companyId) || null;
    setSelectedCompany(company);
    onCompanySelect(companyId); // ✅ This ensures departments can be accessed after selection
  };

  const handleCreateCompany = async () => {
    if (!formState.name || !formState.industry || !formState.email || !formState.phone || !formState.address || !formState.website) {
      setAlert({ message: "⚠️ Please fill in all required fields", severity: "error" });
      return;
    }

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || !user.id) {
      setAlert({ message: "❌ User authentication error. Please log in again.", severity: "error" });
      return;
    }

    setCreating(true);
    try {
      const requestData = {
        ...formState,
        createdBy: user.id,
        updatedBy: user.id,
      };

      console.log("📡 Sending Create Company Request:", requestData);

      const response = await createCompany(requestData);
      if ("success" in response && response.success) {
        setAlert({ message: "✅ Company added successfully!", severity: "success" });
        dispatch({ type: "RESET" });
        fetchCompanies();
        setShowAddCompany(false);
      } else {
        throw new Error("Failed to create company");
      }
    } catch (error: any) {
      setAlert({ message: "❌ Failed to add company", severity: "error" });
    } finally {
      setCreating(false);
    }
  };

  const handleEditCompany = async () => {
    if (!selectedCompany) return;
    try {
      await updateCompany(selectedCompany._id, selectedCompany);
      setAlert({ message: "✅ Company updated successfully!", severity: "success" });
      fetchCompanies();
      setEditing(false);
    } catch (error) {
      setAlert({ message: "❌ Failed to update company.", severity: "error" });
    }
  };

  const handleDeleteCompany = async () => {
    if (!selectedCompany) return;
    try {
      await deleteCompany(selectedCompany._id);
      setAlert({ message: "✅ Company deleted successfully!", severity: "success" });
      setSelectedCompany(null);
      fetchCompanies();
    } catch (error) {
      setAlert({ message: "❌ Failed to delete company.", severity: "error" });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, color: themeTextColor }}>
      <Snackbar open={!!alert.message} autoHideDuration={3000} onClose={() => setAlert({ message: "", severity: "success" })}>
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>

      <Typography variant="h4" sx={{ textAlign: "center", my: 3, fontWeight: "bold" }}>
        🏢 Company Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={4} sx={{ p: 3, borderRadius: 2, bgcolor: cardBgColor }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                <Business sx={{ verticalAlign: "middle", mr: 1 }} />
                Select a Company
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Company</InputLabel>
                <Select
                  value={selectedCompany?._id || ""}
                  onChange={(e) => handleCompanySelect(e.target.value)}
                >
                  {companies.map((company) => (
                    <MenuItem key={company._id} value={company._id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={showAddCompany ? <RemoveCircleOutline /> : <AddCircleOutline />}
                fullWidth
                onClick={() => setShowAddCompany(!showAddCompany)}
              >
                {showAddCompany ? "Hide Form" : "Add New Company"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Collapse in={showAddCompany}>
            <Card elevation={4} sx={{ p: 3, borderRadius: 2, bgcolor: cardBgColor }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  <Apartment sx={{ verticalAlign: "middle", mr: 1 }} />
                  Add New Company
                </Typography>
                {Object.keys(initialState).slice(0, 7).map((field) => (
                  <TextField
                    key={field}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={formState[field as keyof typeof formState]}
                    onChange={(e) => dispatch({ type: "SET_FIELD", field, value: e.target.value })}
                    fullWidth
                    sx={{ mb: 2 }}
                    multiline={field === "aboutUs" || field === "address"}
                  />
                ))}
                <Button variant="contained" fullWidth onClick={handleCreateCompany} disabled={creating} sx={{ mt: 2 }}>
                  {creating ? <CircularProgress size={24} /> : "Add Company"}
                </Button>
              </CardContent>
            </Card>
          </Collapse>
        </Grid>

        {selectedCompany && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Company Details</Typography>
              
              {editing ? (
                Object.keys(initialState).slice(0, 7).map((field) => (
                  <TextField
                    key={field}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={selectedCompany[field as keyof Company] || ""}
                    onChange={(e) => setSelectedCompany({ ...selectedCompany, [field]: e.target.value })}
                    fullWidth
                    sx={{ mb: 2, mt: 1 }}
                  />
                ))
              ) : (
                <>
                  <Typography>Name: {selectedCompany.name}</Typography>
                  <Typography>Industry: {selectedCompany.industry}</Typography>
                  <Typography>Email: {selectedCompany.email}</Typography>
                  <Typography>Phone: {selectedCompany.phone}</Typography>
                  <Typography>Website: {selectedCompany.website}</Typography>
                  <Typography>Address: {selectedCompany.address}</Typography>
                  <Typography>About Us: {selectedCompany.aboutUs}</Typography>
                </>
              )}

              <Box sx={{ mt: 2 }}>
                {editing ? (
                  <>
                    <Button variant="contained" sx={{ mr: 2 }} onClick={handleEditCompany}>
                      Save Changes
                    </Button>
                    <Button variant="outlined" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button startIcon={<Edit />} sx={{ mr: 2 }} onClick={() => setEditing(true)}>
                      Edit
                    </Button>
                    <Button startIcon={<Delete />} color="error" onClick={handleDeleteCompany}>
                      Delete
                    </Button>
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};


export default CompanyManagement;




