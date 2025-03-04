import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Chip, Select, MenuItem, IconButton, FormControl, InputLabel } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminService from "../../api/adminService";
import { toast } from "react-toastify";

interface Role {
  _id: string;
  name: string;
  permissions: string[];
}

const RolesManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState({ name: "", permissions: [] });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await AdminService.getAllRoles();
      setRoles(response.data as Role[]);
    } catch {
      toast.error("Error fetching roles");
    }
  };

  const handleCreateRole = async () => {
    if (!newRole.name.trim()) return;
    try {
      await AdminService.createRole(newRole);
      fetchRoles();
      setNewRole({ name: "", permissions: [] });
      toast.success("Role created successfully!");
    } catch {
      toast.error("Failed to create role");
    }
  };

  return (
    <Container>
      <Typography variant="h6">Manage Roles</Typography>
      <TextField fullWidth label="Role Name" value={newRole.name} onChange={(e) => setNewRole({ ...newRole, name: e.target.value })} sx={{ mt: 2 }} />
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleCreateRole}>Create Role</Button>
      
      <TableContainer sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role Name</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role._id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>
                  {role.permissions.map((perm) => (
                    <Chip key={perm} label={perm} sx={{ mr: 1 }} />
                  ))}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => AdminService.deleteRole(role._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default RolesManagement;
