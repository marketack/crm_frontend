import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getTickets, createTicket, updateTicket, deleteTicket, Ticket } from "../../../api/ticketService";

const Tickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" | "warning" }>({
    open: false,
    message: "",
    severity: "info",
  });

  // ✅ Dynamic Form State
  const [formData, setFormData] = useState<Partial<Ticket>>({
    title: "",
    description: "",
    priority: "low",
    status: "open",
    assignedTo: "",
  });

  // ✅ Fetch Tickets
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await getTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading tickets:", error);
    }
  };

  // ✅ Handle Form Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Open Dialog for Adding or Editing
  const handleOpenDialog = (ticket?: Ticket) => {
    if (ticket) {
      setSelectedTicket(ticket);
      setFormData(ticket);
    } else {
      setSelectedTicket(null);
      setFormData({ title: "", description: "", priority: "low", status: "open", assignedTo: "" });
    }
    setDialogOpen(true);
  };

  // ✅ Handle Create or Update Ticket
  const handleSubmit = async () => {
    try {
      if (selectedTicket) {
        await updateTicket(selectedTicket._id, formData);
        setSnackbar({ open: true, message: "Ticket updated successfully!", severity: "success" });
      } else {
        await createTicket(formData as Ticket);
        setSnackbar({ open: true, message: "Ticket added successfully!", severity: "success" });
      }

      setDialogOpen(false);
      setFormData({ title: "", description: "", priority: "low", status: "open", assignedTo: "" });
      setSelectedTicket(null);
      fetchTickets(); // ✅ Refresh list
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to save ticket", severity: "error" });
    }
  };

  // ✅ Handle Delete Ticket
  const handleDelete = async (ticketId: string) => {
    try {
      await deleteTicket(ticketId);
      setTickets(tickets.filter((t) => t._id !== ticketId));
      setSnackbar({ open: true, message: "Ticket deleted successfully!", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to delete ticket", severity: "error" });
    }
  };

  // ✅ MUI DataGrid Columns
  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "priority", headerName: "Priority", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <Button variant="outlined" color="primary" size="small" onClick={() => handleOpenDialog(params.row)}>
            Edit
          </Button>
          <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(params.row._id)} sx={{ marginLeft: 1 }}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Ticket Management
      </Typography>

      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ marginBottom: 2 }}>
        Add New Ticket
      </Button>

      <DataGrid rows={tickets} columns={columns} pageSizeOptions={[5, 10, 20]} autoHeight getRowId={(row) => row._id} />

      {/* ✅ Add/Edit Ticket Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{selectedTicket ? "Edit Ticket" : "Add New Ticket"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Title" name="title" variant="outlined" value={formData.title} onChange={handleChange} sx={{ marginTop: 2 }} />
          <TextField fullWidth multiline rows={3} label="Description" name="description" variant="outlined" value={formData.description} onChange={handleChange} sx={{ marginTop: 2 }} />
          <TextField select fullWidth label="Priority" name="priority" variant="outlined" value={formData.priority} onChange={handleChange} sx={{ marginTop: 2 }}>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField>
          <TextField select fullWidth label="Status" name="status" variant="outlined" value={formData.status} onChange={handleChange} sx={{ marginTop: 2 }}>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </TextField>
          <TextField fullWidth label="Assigned To" name="assignedTo" variant="outlined" value={formData.assignedTo} onChange={handleChange} sx={{ marginTop: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {selectedTicket ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Snackbar for Notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Tickets;
