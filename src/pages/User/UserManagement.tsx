import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getUserProfile, updateUserProfile, getUserActivityLogs, deactivateUser, deleteUser } from "../../api/userService";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  subscriptionPlan: string;
  roles: { _id: string; name: string }[];
}

const UserManagement: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) {
      setError("User ID is required.");
      setLoading(false);
      return;
    }

    getUserProfile(userId)
      .then((response) => {
        setUser(response.data as User); // ✅ Ensure Type Safety
        setEditedUser(response.data as User);
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to fetch user profile"));

    getUserActivityLogs()
      .then((response) => setLogs(response.data as string[])) // ✅ Ensure Type Safety
      .catch(() => setLogs([]));

    setLoading(false);
  }, [userId]);

  const handleUpdate = () => {
    if (!editedUser) return;
    updateUserProfile(userId!, editedUser)
      .then(() => {
        setUser(editedUser);
        setEditing(false);
      })
      .catch((err) => setError(err.response?.data?.message || "Update failed"));
  };

  if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {/* User Profile */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>User Profile</Typography>
              {editing ? (
                <>
                  <TextField label="Name" value={editedUser?.name} fullWidth onChange={(e) => setEditedUser({ ...editedUser!, name: e.target.value })} />
                  <TextField label="Phone" value={editedUser?.phone || ""} fullWidth sx={{ mt: 2 }} onChange={(e) => setEditedUser({ ...editedUser!, phone: e.target.value })} />
                  <Button onClick={handleUpdate} variant="contained" fullWidth sx={{ mt: 2 }}>Save Changes</Button>
                  <Button onClick={() => setEditing(false)} fullWidth sx={{ mt: 2 }}>Cancel</Button>
                </>
              ) : (
                <>
                  <Typography>Email: {user?.email}</Typography>
                  <Typography>Phone: {user?.phone || "N/A"}</Typography>
                  <Typography>Status: {user?.status}</Typography>
                  <Typography>Subscription: {user?.subscriptionPlan}</Typography>
                  <Typography>Role: {user?.roles.map((role) => role.name).join(", ")}</Typography>
                  <Button onClick={() => setEditing(true)} variant="outlined" fullWidth sx={{ mt: 2 }}>Edit Profile</Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Logs */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Activity Logs</Typography>
            {logs.length > 0 ? (
              <List>
                {logs.map((log, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={log} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No logs found</Typography>
            )}
          </Paper>

          {/* Account Actions */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Account Actions</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button variant="contained" color="warning" fullWidth onClick={() => deactivateUser()}>
                  Deactivate Account
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained" color="error" fullWidth onClick={() => deleteUser()}>
                  Delete Account
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserManagement;
