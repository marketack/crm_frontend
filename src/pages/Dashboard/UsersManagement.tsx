import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Button } from "@mui/material";
import AdminService from "../../api/adminService";
import { toast } from "react-toastify";

interface User {
  _id: string;
  name: string;
  roles: string[];
}

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await AdminService.getAllUsers();
      setUsers(response.data as User[]);
    } catch {
      toast.error("Error fetching users");
    }
  };

  return (
    <Container>
      <Typography variant="h6">Manage Users</Typography>
      <TableContainer sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Roles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.roles.length > 0 ? user.roles.join(", ") : "No roles assigned"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default UsersManagement;
