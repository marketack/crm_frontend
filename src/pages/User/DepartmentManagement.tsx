import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import {
  getCompanyDepartments,
  addDepartmentToCompany,
  updateDepartment,
  deleteDepartment,
} from "../../api/companyService";
import EmployeeManagement from "./EmployeeManagement";
import { useSelector } from "react-redux";

// ✅ Define TypeScript Interfaces
interface Department {
  _id: string;
  name: string;
  employees: string[];
  budget?: number;
  objectives?: string[];
}

interface DepartmentManagementProps {
  companyId: string;
  onDepartmentSelect: (departmentId: string) => void;
}

const DepartmentManagement: React.FC<DepartmentManagementProps> = ({ companyId, onDepartmentSelect }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDepartment, setNewDepartment] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [editDepartment, setEditDepartment] = useState<Partial<Department> | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [alert, setAlert] = useState<{ message: string; severity: "success" | "error" }>({
    message: "",
    severity: "success",
  });

  // ✅ Dark Mode Handling
  const darkMode = useSelector((state: any) => state.theme.darkMode);
  const paperBgColor = darkMode ? "#252525" : "#FFFFFF";
  const textColor = darkMode ? "#FFFFFF" : "#000000";

  useEffect(() => {
    fetchDepartments();
  }, [companyId]);

  // ✅ Fetch Departments with Proper Error Handling
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      console.log("📡 Fetching Departments for Company ID:", companyId);
      
      const response = await getCompanyDepartments(companyId);
  
      console.log("✅ API Response:", response);
  
      if (Array.isArray(response)) {
        setDepartments(response);
      } else if (response.success && "departments" in response && Array.isArray(response.departments)) {
        setDepartments(response.departments as Department[]);
      } else {
        throw new Error(response.message || "Unexpected API response format");
      }
    } catch (error: any) {
      console.error("❌ Error fetching departments:", error.message || error);
      setAlert({ message: `❌ Error: ${error.message || "Failed to load departments"}`, severity: "error" });
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };
  

  // ✅ Add a New Department
  const handleAddDepartment = async () => {
    if (!newDepartment.trim()) {
      setAlert({ message: "⚠️ Department name is required", severity: "error" });
      return;
    }

    try {
      await addDepartmentToCompany(companyId, { name: newDepartment.trim(), employees: [], budget: 0, objectives: [] });
      setNewDepartment("");
      fetchDepartments();
      setAlert({ message: "✅ Department added successfully!", severity: "success" });
    } catch (error) {
      console.error("❌ Failed to add department:", error);
      setAlert({ message: "❌ Failed to add department", severity: "error" });
    }
  };

  // ✅ Update Department
  const handleUpdateDepartment = async () => {
    if (!editDepartment || !editDepartment._id || !editDepartment.name) return;

    try {
      await updateDepartment(companyId, editDepartment._id, editDepartment);
      fetchDepartments();
      setAlert({ message: "✅ Department updated successfully!", severity: "success" });
      setOpenDialog(false);
    } catch (error) {
      console.error("❌ Failed to update department:", error);
      setAlert({ message: "❌ Failed to update department", severity: "error" });
    }
  };

  // ✅ Delete Department
  const handleDeleteDepartment = async (departmentId: string) => {
    try {
      await deleteDepartment(companyId, departmentId);
      fetchDepartments();
      setAlert({ message: "✅ Department deleted successfully!", severity: "success" });
    } catch (error) {
      console.error("❌ Failed to delete department:", error);
      setAlert({ message: "❌ Failed to delete department", severity: "error" });
    }
  };

  return (
    <Container maxWidth="md">
      {/* ✅ Snackbar for Alerts */}
      <Snackbar open={!!alert.message} autoHideDuration={3000} onClose={() => setAlert({ message: "", severity: "success" })}>
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>

      {/* ✅ Paper Container */}
      <Paper sx={{ p: 3, mt: 3, boxShadow: 3, borderRadius: 2, bgcolor: paperBgColor, color: textColor }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2", mb: 2 }}>
          📂 Manage Departments
        </Typography>

        {loading ? (
          <CircularProgress sx={{ display: "block", margin: "auto", mt: 2 }} />
        ) : departments.length > 0 ? (
          <List sx={{ mb: 3 }}>
            {departments.map((dept) => (
              <ListItem
                key={dept._id}
                sx={{
                  borderBottom: "1px solid #ddd",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <ListItemText primary={dept.name} />
                <Box>
                  <IconButton color="primary" onClick={() => { setEditDepartment(dept); setOpenDialog(true); }}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteDepartment(dept._id)}>
                    <Delete />
                  </IconButton>
                  <Button
                    variant="contained"
                    color={selectedDepartmentId === dept._id ? "secondary" : "primary"}
                    onClick={() => {
                      setSelectedDepartmentId(dept._id);
                      onDepartmentSelect(dept._id);
                    }}
                  >
                    {selectedDepartmentId === dept._id ? "Selected" : "Manage Employees"}
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography sx={{ color: "#888" }}>No departments found.</Typography>
        )}

        {/* ✅ Add Department Form */}
        <Grid container spacing={2} alignItems="center" sx={{ mt: 3 }}>
          <Grid item xs={8}>
            <TextField label="New Department" value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" sx={{ bgcolor: "#1976d2", width: "100%" }} onClick={handleAddDepartment}>
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* ✅ Show Employee Management Section */}
      {selectedDepartmentId && <Box sx={{ mt: 3 }}><EmployeeManagement departmentId={selectedDepartmentId} companyId={companyId} /></Box>}

      {/* ✅ Edit Department Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Department</DialogTitle>
        <DialogContent>
          <TextField label="Department Name" fullWidth value={editDepartment?.name || ""} onChange={(e) => setEditDepartment({ ...editDepartment, name: e.target.value })} sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateDepartment}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DepartmentManagement;