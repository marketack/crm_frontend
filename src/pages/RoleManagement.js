import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles, fetchPermissions, addRole, modifyRole, removeRole } from "../redux/roleSlice";
import API from "../services/api";

const RoleManagement = () => {
  const dispatch = useDispatch();
  const { roles = [], permissions = [] } = useSelector((state) => state.roles || {});
  const [open, setOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState({ name: "", permissions: [] });
  const [allPermissions, setAllPermissions] = useState([]);

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchPermissions());
    fetchAllPermissions();
  }, [dispatch]);

  const fetchAllPermissions = async () => {
    try {
      const data = await API.get("/permissions");
      setAllPermissions(data.data);
    } catch (error) {
      console.error("Failed to fetch permissions", error);
    }
  };

  const handleOpen = (role = null) => {
    setCurrentRole(role ? { ...role } : { name: "", permissions: [] });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    if (currentRole._id) {
      dispatch(modifyRole({ roleId: currentRole._id, roleData: currentRole }));
    } else {
      dispatch(addRole(currentRole));
    }
    handleClose();
  };

  const handlePermissionToggle = (permId) => {
    setCurrentRole((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter((id) => id !== permId)
        : [...prev.permissions, permId],
    }));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Role Management
      </Typography>

      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add New Role
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Role Name</strong></TableCell>
              <TableCell><strong>Permissions</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role._id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>
                  {role.permissions.map((perm) => (
                    <span key={perm._id} style={{ marginRight: "8px" }}>
                      {perm.name}
                    </span>
                  ))}
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" onClick={() => handleOpen(role)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="error" onClick={() => dispatch(removeRole(role._id))} sx={{ ml: 2 }}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentRole._id ? "Edit Role" : "Add New Role"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Role Name"
            value={currentRole.name}
            onChange={(e) => setCurrentRole({ ...currentRole, name: e.target.value })}
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Permissions:
          </Typography>
          {allPermissions.map((perm) => (
            <FormControlLabel
              key={perm._id}
              control={
                <Checkbox
                  checked={currentRole.permissions.includes(perm._id)}
                  onChange={() => handlePermissionToggle(perm._id)}
                />
              }
              label={perm.name}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoleManagement;
