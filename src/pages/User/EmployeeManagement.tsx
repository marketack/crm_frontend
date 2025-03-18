import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Paper,
  Snackbar,
  Alert,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../../api/employeeService";
import { getAllRoles } from "../../api/roleService";
import { useSelector } from "react-redux";
import { store } from "../../redux/store";

interface Employee {
  _id: string;
  name: string;
  email: string;
  position: string;
  department: { _id: string; name: string } | string;
  company: { _id: string; name: string } | string;
  user: string;
  salary: number;
  reportsTo?: { _id: string; name: string } | string;
  createdAt?: Date;
  updatedAt?: Date;
  role?: { _id: string; name: string };
}

interface Role {
  _id: string;
  name: string;
}

interface EmployeeManagementProps {
  companyId: string;
  departmentId: string;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ companyId, departmentId }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Partial<Employee> | null>(null);
  const [alert, setAlert] = useState<{ message: string; severity: "success" | "error" }>({
    message: "",
    severity: "success",
  });

  const darkMode = useSelector((state: any) => state.theme.darkMode);
  const paperBgColor = darkMode ? "#252525" : "#FFFFFF";
  const textColor = darkMode ? "#FFFFFF" : "#000000";
  const [companyEmployees, setCompanyEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetchEmployees();
    fetchRoles();
  }, [companyId, departmentId]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await getEmployees();
      console.log("📡 Fetched Employees:", response);

      if (Array.isArray(response)) {
        const departmentEmployees = response.filter(
          (emp) =>
            typeof emp.company === "object" &&
            emp.company._id === companyId &&
            (typeof emp.department === "object" ? emp.department._id : emp.department) === departmentId
        );
        setEmployees(departmentEmployees);

        console.log("📌 Filtered Employees:", departmentEmployees);

        const allCompanyEmployees = response.filter(
          (emp) => typeof emp.company === "object" && emp.company._id === companyId
        );
        setCompanyEmployees(allCompanyEmployees);
      } else {
        setAlert({ message: `❌ ${response.message || "Failed to load employees"}`, severity: "error" });
        setEmployees([]);
        setCompanyEmployees([]);
      }
    } catch (error: any) {
      console.error("❌ Fetch Employees Error:", error);
      setAlert({ message: "❌ Failed to load employees", severity: "error" });
      setEmployees([]);
      setCompanyEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const rolesData = await getAllRoles();
      if (Array.isArray(rolesData)) {
        setRoles(rolesData);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error: any) {
      console.error("❌ Error fetching roles:", error);
      setRoles([]);
    }
  };

  const handleSaveEmployee = async () => {
    if (!editEmployee || !editEmployee.name?.trim() || !editEmployee.email?.trim() || !editEmployee.position?.trim()) {
      setAlert({ message: "⚠️ Name, email, and position are required", severity: "error" });
      return;
    }

    try {
      const storedUser = store.getState()?.auth?.user || JSON.parse(localStorage.getItem("user") || "{}");
      const userId = storedUser?._id || storedUser?.id || localStorage.getItem("userId");

      if (!userId || userId === "undefined" || userId === null) {
        console.error("❌ User ID is missing or invalid:", userId);
        setAlert({ message: "❌ User ID is missing. Please log in again.", severity: "error" });
        return;
      }

      const employeePayload: Omit<Employee, "_id"> = {
        name: editEmployee.name.trim(),
        email: editEmployee.email.trim(),
        position: editEmployee.position.trim(),
        department: departmentId, // ✅ Use the departmentId from props
        company: companyId,
        user: userId,
        salary: editEmployee.salary || 0,
        reportsTo: typeof editEmployee.reportsTo === "object" ? editEmployee.reportsTo._id : editEmployee.reportsTo,
      };

      console.log("📡 Sending Employee Data:", employeePayload);

      let response;

      if (editEmployee._id) {
        response = await updateEmployee(editEmployee._id, employeePayload);
        console.log("✅ Employee Updated:", response);
        setAlert({ message: "✅ Employee updated successfully!", severity: "success" });
      } else {
        response = await createEmployee(employeePayload);
        console.log("✅ Employee Created:", response);

        if ("success" in response && !response.success) {
          setAlert({ message: `❌ Failed: ${response.message || "Unknown error"}`, severity: "error" });
          return;
        }

        setAlert({ message: "✅ Employee added successfully!", severity: "success" });
      }

      fetchEmployees();
      setOpenDialog(false);
    } catch (error: any) {
      console.error("❌ Error saving employee:", error);
      setAlert({ message: `❌ Failed to save employee: ${error.message || error}`, severity: "error" });
    }
  };

  return (
    <Container maxWidth="md">
      <Snackbar open={!!alert.message} autoHideDuration={3000} onClose={() => setAlert({ message: "", severity: "success" })}>
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>

      <Paper sx={{ p: 3, mt: 3, boxShadow: 3, borderRadius: 2, bgcolor: paperBgColor, color: textColor }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2", mb: 2 }}>
          👥 Employee Management
        </Typography>
        <List>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <ListItem
                key={employee._id}
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
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                      {employee.name} - {employee.position ?? "Not Assigned"}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2">
                        📧 <strong>Email:</strong> {employee.email}
                      </Typography>
                      <Typography variant="body2">
                        🏢 <strong>Company:</strong> {typeof employee.company === "object" ? employee.company.name : "Unknown Company"}
                      </Typography>
                      <Typography variant="body2">
                        🛠 <strong>Role:</strong> {employee.role?.name ?? "Not Assigned"}
                      </Typography>
                      <Typography variant="body2">
                        💰 <strong>Salary:</strong> {employee.salary ? `${employee.salary.toLocaleString()}` : "Not Available"}
                      </Typography>
                      <Typography variant="body2">
                        📅 <strong>Joined On:</strong> {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : "Unknown"}
                      </Typography>
                      <Typography variant="body2">
                        📌 <strong>Department:</strong> {typeof employee.department === "object" ? employee.department.name : "Not Assigned"}
                      </Typography>
                      <Typography variant="body2">
                        👤 <strong>Reports To:</strong> {typeof employee.reportsTo === "object" ? employee.reportsTo.name : "None"}
                      </Typography>
                    </>
                  }
                />
                <Box>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setEditEmployee(employee);
                      setOpenDialog(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={async () => {
                      try {
                        await deleteEmployee(employee._id);
                        setAlert({ message: "✅ Employee deleted successfully!", severity: "success" });
                        fetchEmployees();
                      } catch (error) {
                        setAlert({ message: "❌ Failed to delete employee", severity: "error" });
                      }
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </ListItem>
            ))
          ) : (
            <Typography>No employees found for this department.</Typography>
          )}
        </List>
        <Button
          variant="contained"
          sx={{ bgcolor: "#1976d2", width: "100%", mt: 2 }}
          onClick={() => {
            setEditEmployee({ position: "", salary: 0, name: "", email: "" });
            setOpenDialog(true);
          }}
        >
          ➕ Add Employee
        </Button>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editEmployee?._id ? "Edit Employee" : "Add Employee"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            sx={{ mt: 2 }}
            value={editEmployee?.name || ""}
            onChange={(e) => setEditEmployee({ ...editEmployee, name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            sx={{ mt: 2 }}
            value={editEmployee?.email || ""}
            onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })}
          />
          <TextField
            label="Position"
            fullWidth
            sx={{ mt: 2 }}
            value={editEmployee?.position || ""}
            onChange={(e) => setEditEmployee({ ...editEmployee, position: e.target.value })}
          />
          <TextField
            label="Salary"
            fullWidth
            type="number"
            sx={{ mt: 2 }}
            value={editEmployee?.salary || 0}
            onChange={(e) => setEditEmployee({ ...editEmployee, salary: parseFloat(e.target.value) })}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Reports To</InputLabel>
            <Select
              value={editEmployee?.reportsTo || ""}
              onChange={(e) => setEditEmployee({ ...editEmployee, reportsTo: e.target.value })}
            >
              <MenuItem value="">None</MenuItem>
              {companyEmployees.map((emp) => (
                <MenuItem key={emp._id} value={emp._id}>
                  {emp.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEmployee}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmployeeManagement;