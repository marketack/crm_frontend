import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Chip,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Search as SearchIcon, AddCircleOutline } from "@mui/icons-material";
import RoleService from "../../../api/roleService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// ✅ Role Interface
interface Role {
  _id: string;
  name: string;
  permissions: string[];
}

// ✅ Permission List (Expandable)
const PERMISSIONS_LIST = [
  "manage_users",
  "manage_roles",
  "manage_courses",
  "view_reports",
  "manage_saas_tools",
  "send_notifications",
  "manage_api_keys",
  "edit_settings",
];

const RolesManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState({ name: "", permissions: [] });
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Theme Handling
  const darkMode = useSelector((state: any) => state.theme.darkMode);
  const themeStyles = {
    bg: darkMode ? "#252525" : "#FFFFFF",
    text: darkMode ? "#FFFFFF" : "#000000",
    button: darkMode ? "#1976d2" : "#0288d1",
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await RoleService.getAllRoles();
      if ("success" in response && !response.success) {
        toast.error(`Error fetching roles: ${response.message}`);
        setRoles([]);
        return;
      }
      setRoles(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("❌ Error fetching roles:", error);
      toast.error("Failed to fetch roles");
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    if (!newRole.name.trim()) {
      toast.error("⚠️ Role name is required!");
      return;
    }
    try {
      const response = await RoleService.createRole(newRole);
      if ("success" in response && !response.success) {
        toast.error(`Error creating role: ${response.message}`);
        return;
      }
      fetchRoles();
      setNewRole({ name: "", permissions: [] });
      toast.success("✅ Role created successfully!");
    } catch (error) {
      toast.error("❌ Failed to create role");
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;

    try {
      const response = await RoleService.deleteRole(roleId);
      if ("success" in response && !response.success) {
        toast.error(`Error deleting role: ${response.message}`);
        return;
      }
      fetchRoles();
      toast.success("✅ Role deleted successfully!");
    } catch (error) {
      toast.error("❌ Failed to delete role");
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setOpenDialog(true);
  };

  const handleUpdateRolePermissions = async () => {
    if (!editingRole) return;
    try {
      const response = await RoleService.updateRolePermissions(editingRole._id, editingRole.permissions);
      if ("success" in response && !response.success) {
        toast.error(`Error updating permissions: ${response.message}`);
        return;
      }
      fetchRoles();
      setOpenDialog(false);
      toast.success("✅ Role permissions updated!");
    } catch (error) {
      toast.error("❌ Failed to update role permissions");
    }
  };

  return (
    <Container>
      <Typography variant="h5" sx={{ fontWeight: "bold", color: themeStyles.button, mb: 2 }}>
        🔑 Advanced Role Management
      </Typography>

      {/* 🔍 Search Roles */}
      <TextField
        fullWidth
        placeholder="Search roles..."
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
      />

      {/* ➕ Create New Role */}
      <Paper sx={{ p: 3, bgcolor: themeStyles.bg, color: themeStyles.text, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h6">Create Role</Typography>
        <TextField
          fullWidth
          label="Role Name"
          value={newRole.name}
          onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
          sx={{ mt: 2 }}
        />
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleCreateRole}>
          <AddCircleOutline sx={{ mr: 1 }} /> Create Role
        </Button>
      </Paper>

      {/* 📌 Roles Table */}
      <TableContainer sx={{ mt: 3 }}>
        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role Name</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles
                .filter((role) => role.name.toLowerCase().includes(searchQuery))
                .map((role) => (
                  <TableRow key={role._id}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>
                      {role.permissions.length > 0 ? (
                        role.permissions.map((perm) => <Chip key={perm} label={perm} sx={{ mr: 1 }} />)
                      ) : (
                        <Typography color="textSecondary">No permissions</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditRole(role)}>
                        <EditIcon color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteRole(role._id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* 🛠 Edit Permissions Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Role Permissions</DialogTitle>
        <DialogContent>
          {editingRole && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Permissions</InputLabel>
              <Select
                multiple
                value={editingRole.permissions}
                onChange={(e) => setEditingRole({ ...editingRole, permissions: e.target.value as string[] })}
              >
                {PERMISSIONS_LIST.map((perm) => (
                  <MenuItem key={perm} value={perm}>
                    {perm}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateRolePermissions}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RolesManagement;
