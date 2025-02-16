import React, { useState, useEffect } from "react";
import {
  Container, Typography, Button, Paper, TextField, Dialog, DialogActions, 
  DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, CircularProgress, Select, MenuItem, Chip
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import { getLeads, createLead, updateLead, deleteLead } from "../services/leadService";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLead, setCurrentLead] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "New",
  });
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Available statuses
  const statusOptions = ["New", "In Progress", "Closed"];

  // Colors for Status
  const statusColors = {
    New: "primary",
    "In Progress": "warning",
    Closed: "error",
  };

  // Fetch leads from backend
  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const data = await getLeads();
      setLeads(data.map(lead => ({ ...lead, id: lead.id || lead._id }))); // Ensure consistent `id`
    } catch (error) {
      toast.error("Failed to fetch leads.");
      console.error("Error fetching leads:", error);
    } finally {
      setFetching(false);
    }
  };

  // Open Add/Edit Lead Dialog
  const handleOpen = (lead = null) => {
    console.log("🔍 Debug: Opening Lead Dialog", lead);

    if (lead) {
      setCurrentLead({
        id: lead.id || lead._id || "", 
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        company: lead.company || "",
        status: lead.status || "New",
      });
      setIsEditing(true);
    } else {
      setCurrentLead({
        id: "",
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "New",
      });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentLead({
      id: "",
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "New",
    });
  };

  // Handle input changes
  const handleChange = (e) => {
    setCurrentLead({ ...currentLead, [e.target.name]: e.target.value });
  };

  // Save Lead (Add or Update)
  const handleSaveLead = async () => {
    if (!currentLead.name || !currentLead.email || !currentLead.phone || !currentLead.company) {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        if (!currentLead.id) {
          console.error("❌ Error: Lead ID is missing in edit mode");
          toast.error("Lead ID is required for updates.");
          setLoading(false);
          return;
        }

        console.log("🔍 Debug: Updating Lead ID:", currentLead.id);
        await updateLead(currentLead.id, currentLead);
        setLeads(leads.map((lead) => (lead.id === currentLead.id ? { ...lead, ...currentLead } : lead)));
        toast.success("Lead updated successfully!");
      } else {
        const newLead = await createLead(currentLead);
        setLeads([...leads, { ...newLead, id: newLead.id || newLead._id }]); // Ensure consistent `id`
        toast.success("Lead added successfully!");
      }
      handleClose();
    } catch (error) {
      console.error("❌ Error Saving Lead:", error);
      toast.error("Error saving lead.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Lead
  const handleDeleteLead = async (leadId) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      await deleteLead(leadId);
      setLeads(leads.filter((lead) => lead.id !== leadId));
      toast.success("Lead deleted successfully!");
    } catch (error) {
      toast.error("Error deleting lead.");
      console.error("Error:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Leads Management</Typography>

      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ marginBottom: 2 }}>
        Add New Lead
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
                <TableCell><strong>Company</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.length > 0 ? (
                leads.map((lead, index) => (
                  <TableRow key={lead.id || `lead-${index}`}>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>
                      <Chip label={lead.status} color={statusColors[lead.status] || "default"} />
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpen(lead)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteLead(lead.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">No leads available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? "Edit Lead" : "Add New Lead"}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="name" label="Name" fullWidth variant="outlined" value={currentLead.name} onChange={handleChange} />
          <TextField margin="dense" name="email" label="Email" fullWidth variant="outlined" value={currentLead.email} onChange={handleChange} />
          <TextField margin="dense" name="phone" label="Phone" fullWidth variant="outlined" value={currentLead.phone} onChange={handleChange} />
          <TextField margin="dense" name="company" label="Company" fullWidth variant="outlined" value={currentLead.company} onChange={handleChange} />
          <Select fullWidth variant="outlined" name="status" value={currentLead.status} onChange={handleChange}>
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSaveLead} color="primary" variant="contained" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update Lead" : "Add Lead"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Leads;
