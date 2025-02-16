import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getUserProfile, changeUserRole } from "../services/userService";

const validRoles = ["admin", "manager", "sales", "support", "customer"];

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Admin fields
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    getUserProfile()
      .then((data) => setUserData(data))
      .catch(() => toast.error("Error fetching profile"))
      .finally(() => setLoading(false));
  }, [user]);

  const handleRoleChange = async () => {
    if (!searchEmail || !selectedRole) {
      toast.error("Please enter an email and select a role.");
      return;
    }

    try {
      await changeUserRole(searchEmail, selectedRole);
      setSearchEmail("");
      setSelectedRole("");
    } catch (error) {
      toast.error("Role change failed.");
    }
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container>
        <Typography variant="h5">No Profile Data Found</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: 3, maxWidth: 500, margin: "auto" }}>
        <Typography variant="h5" gutterBottom>
          Profile Details
        </Typography>
        <Typography variant="body1"><strong>First Name:</strong> {userData.firstName}</Typography>
        <Typography variant="body1"><strong>Last Name:</strong> {userData.lastName}</Typography>
        <Typography variant="body1"><strong>Email:</strong> {userData.email}</Typography>
        <Typography variant="body1"><strong>Phone Number:</strong> {userData.phoneNumber}</Typography>
        <Typography variant="body1"><strong>Username:</strong> {userData.username}</Typography>
        <Typography variant="body1"><strong>Role:</strong> {userData.role}</Typography>
      </Paper>

      {/* Admin Only - Role Change Form */}
      {userData.role === "admin" && (
        <Paper elevation={3} sx={{ padding: 3, maxWidth: 500, margin: "auto", marginTop: 3 }}>
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
          <Button variant="contained" color="primary" onClick={handleRoleChange}>
            Change Role
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default Profile;
