import React, { useState, useEffect } from "react";
import {
  Container, Typography, Button, Paper, Dialog, DialogActions, DialogContent, 
  DialogTitle, TextField, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, CircularProgress, Select, MenuItem, Chip
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "../services/customerService";
import { useNavigate } from "react-router-dom";


const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "New",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Available statuses
  const statusOptions = ["New", "Active", "Inactive", "Closed"];

  // Colors for Status
  const statusColors = {
    New: "primary",
    Active: "success",
    Inactive: "warning",
    Closed: "error",
  };

  // Fetch customers from backend
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data.map(customer => ({ ...customer, id: customer.id || customer._id })));
    } catch (error) {
      toast.error("Failed to fetch customers.");
      console.error("Error fetching customers:", error);
    } finally {
      setFetching(false);
    }
  };

  // Open Add/Edit Customer Dialog
  const handleOpen = (customer = null) => {
    console.log("🔍 Debug: Opening Customer Dialog", customer);

    if (customer) {
      setCurrentCustomer({
        id: customer.id || customer._id || "", 
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        status: customer.status || "New",
      });
      setIsEditing(true);
    } else {
      setCurrentCustomer({
        id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        status: "New",
      });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentCustomer({
      id: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "New",
    });
  };

  // Handle input changes
  const handleChange = (e) => {
    setCurrentCustomer({ ...currentCustomer, [e.target.name]: e.target.value });
  };

  // Save Customer (Add or Update)
  const handleSaveCustomer = async () => {
    if (!currentCustomer.name || !currentCustomer.email || !currentCustomer.phone || !currentCustomer.address) {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        if (!currentCustomer.id) {
          console.error("❌ Error: Customer ID is missing in edit mode");
          toast.error("Customer ID is required for updates.");
          setLoading(false);
          return;
        }

        console.log("🔍 Debug: Updating Customer ID:", currentCustomer.id);
        await updateCustomer(currentCustomer.id, currentCustomer);
        setCustomers(customers.map((customer) => 
          customer.id === currentCustomer.id ? { ...customer, ...currentCustomer } : customer
        ));
        toast.success("Customer updated successfully!");
      } else {
        const newCustomer = await createCustomer(currentCustomer);
        setCustomers([...customers, { ...newCustomer, id: newCustomer.id || newCustomer._id }]);
        toast.success("Customer added successfully!");
      }
      handleClose();
    } catch (error) {
      console.error("❌ Error Saving Customer:", error);
      toast.error("Error saving customer.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Customer
  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      await deleteCustomer(customerId);
      setCustomers(customers.filter((customer) => customer.id !== customerId));
      toast.success("Customer deleted successfully!");
    } catch (error) {
      toast.error("Error deleting customer.");
      console.error("Error:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Customers Management</Typography>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => handleOpen()} 
        sx={{ marginBottom: 2 }}
      >
        Add New Customer
      </Button>

      {fetching ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
                <TableCell><strong>Address</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.length > 0 ? (
                customers.map((customer, index) => (
                  <TableRow key={customer.id || `customer-${index}`}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell>
                      <Chip label={customer.status} color={statusColors[customer.status] || "default"} />
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpen(customer)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteCustomer(customer.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">No customers available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? "Edit Customer" : "Add New Customer"}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="name" label="Name" fullWidth variant="outlined" value={currentCustomer.name} onChange={handleChange} />
          <TextField margin="dense" name="email" label="Email" fullWidth variant="outlined" value={currentCustomer.email} onChange={handleChange} />
          <TextField margin="dense" name="phone" label="Phone" fullWidth variant="outlined" value={currentCustomer.phone} onChange={handleChange} />
          <TextField margin="dense" name="address" label="Address" fullWidth variant="outlined" value={currentCustomer.address} onChange={handleChange} />
          <Select fullWidth variant="outlined" name="status" value={currentCustomer.status} onChange={handleChange}>
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSaveCustomer} color="primary" variant="contained" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update Customer" : "Add Customer"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Customers;
