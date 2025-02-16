import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  useTheme,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getUserProfile, changeUserRole } from "../services/userService";
import { getStaff, createStaff, deleteStaff } from "../services/staffService";
import { Delete } from "@mui/icons-material";

const validRoles = ["admin", "manager", "sales", "support", "customer"];

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Admin fields
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  // Staff Management
  const [staff, setStaff] = useState([]);
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    getUserProfile()
      .then((data) => setUserData(data))
      .catch(() => toast.error("Error fetching profile"))
      .finally(() => setLoading(false));

    if (user?.role === "admin") {
      loadStaff();
    }
  }, [user]);

  const loadStaff = async () => {
    try {
      const staffData = await getStaff();
      setStaff(staffData);
    } catch (error) {
      toast.error("Failed to load staff.");
    }
  };

  const handleRoleChange = async () => {
    if (!searchEmail || !selectedRole) {
      toast.error("Please enter an email and select a role.");
      return;
    }

    try {
      await changeUserRole(searchEmail, selectedRole);
      setSearchEmail("");
      setSelectedRole("");
      toast.success("User role updated successfully.");
    } catch (error) {
      toast.error("Role change failed.");
    }
  };

  const handleAddStaff = async () => {
    if (!staffName || !staffEmail) {
      toast.error("Please enter staff name and email.");
      return;
    }

    try {
      const newStaff = await createStaff({ name: staffName, email: staffEmail });
      setStaff([...staff, newStaff]);
      toast.success("Staff member added successfully!");
      setStaffName("");
      setStaffEmail("");
    } catch (error) {
      toast.error("Failed to add staff.");
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;

    try {
      await deleteStaff(staffId);
      setStaff(staff.filter((s) => s.id !== staffId));
      toast.success("Staff member deleted.");
    } catch (error) {
      toast.error("Failed to delete staff.");
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container>
        <Typography variant="h5" sx={{ textAlign: "center", marginTop: 4 }}>
          No Profile Data Found
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ paddingBottom: 5 }}>
      {/* User Profile Details */}
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          maxWidth: 600,
          margin: "auto",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Profile Details
        </Typography>
        {["First Name", "Last Name", "Email", "Phone Number", "Username", "Role"].map((field, index) => (
          <Typography key={index} variant="body1">
            <strong>{field}:</strong> {userData[field.toLowerCase().replace(" ", "")]}
          </Typography>
        ))}
      </Paper>

      {/* Admin Only - Role Change Form */}
      {userData.role === "admin" && (
        <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, margin: "auto", marginTop: 3 }}>
          <Typography variant="h6" gutterBottom>
            Admin: Change User Role
          </Typography>
          <TextField
            fullWidth
            label="Search by Email"
            variant="outlined"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Select Role"
            variant="outlined"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            sx={{ marginBottom: 2 }}
          >
            {validRoles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" color="primary" onClick={handleRoleChange} fullWidth>
            Change Role
          </Button>
        </Paper>
      )}

      {/* Admin Only - Staff Management */}
      {userData.role === "admin" && (
        <Paper elevation={3} sx={{ padding: 3, maxWidth: "100%", marginTop: 3 }}>
          <Typography variant="h6" gutterBottom>
            Admin: Manage Staff
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              fullWidth
              label="Staff Name"
              variant="outlined"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Staff Email"
              variant="outlined"
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleAddStaff} fullWidth>
              Add Staff
            </Button>
          </Box>

          {/* Responsive Staff Table */}
          <TableContainer component={Paper} sx={{ marginTop: 3, overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staff.length > 0 ? (
                  staff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => handleDeleteStaff(member.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">No staff members available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default Profile;
