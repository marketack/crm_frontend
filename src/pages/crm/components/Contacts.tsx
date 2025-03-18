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
import { getContacts, createContact, updateContact, deleteContact, Contact } from "../../../api/contactService";

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" | "warning" }>({
    open: false,
    message: "",
    severity: "info",
  });

  // ✅ Form State
  const [formData, setFormData] = useState<Partial<Contact>>({
    name: "",
    company: "",
    email: "",
    phone: "",
    type: "lead",
    status: "new",
    source: "Other",
  });

  // ✅ Fetch Contacts on Load
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getContacts();
        setContacts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading contacts:", error);
      }
    };
    fetchContacts();
  }, []);

  // ✅ Handle Input Changes in Form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Open Dialog for Adding or Editing Contacts
  const handleOpenDialog = (contact?: Contact) => {
    if (contact) {
      setSelectedContact(contact);
      setFormData(contact);
    } else {
      setSelectedContact(null);
      setFormData({ name: "", company: "", email: "", phone: "", type: "lead", status: "new", source: "Other" });
    }
    setOpenDialog(true);
  };

  // ✅ Handle Create or Update Contact
  const handleSubmit = async () => {
    try {
      if (selectedContact) {
        await updateContact(selectedContact._id, formData);
        setSnackbar({ open: true, message: "Contact updated successfully!", severity: "success" });
      } else {
        const newContact = await createContact(formData as Contact);
        setContacts([...contacts, newContact]);
        setSnackbar({ open: true, message: "Contact added successfully!", severity: "success" });
      }

      setOpenDialog(false);
      setFormData({ name: "", company: "", email: "", phone: "", type: "lead", status: "new", source: "Other" });
      setSelectedContact(null);
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to save contact", severity: "error" });
    }
  };

  // ✅ Handle Delete Contact
  const handleDelete = async (contactId: string) => {
    try {
      await deleteContact(contactId);
      setContacts(contacts.filter((contact) => contact._id !== contactId));
      setSnackbar({ open: true, message: "Contact deleted successfully!", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to delete contact", severity: "error" });
    }
  };

  // ✅ MUI DataGrid Columns
  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "company", headerName: "Company", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "source", headerName: "Source", flex: 1 },
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
        Contacts Management
      </Typography>

      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ marginBottom: 2 }}>
        Add New Contact
      </Button>

      <DataGrid rows={contacts} columns={columns} pageSizeOptions={[5, 10, 20]} autoHeight getRowId={(row) => row._id} />

  
      {/* ✅ Contact Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{selectedContact ? "Edit Contact" : "Add New Contact"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Name" name="name" value={formData.name} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Company" name="company" value={formData.company} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Email" name="email" value={formData.email} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
          <TextField select fullWidth margin="dense" label="Type" name="type" value={formData.type} onChange={handleChange}>
            <MenuItem value="lead">Lead</MenuItem>
            <MenuItem value="client">Client</MenuItem>
            <MenuItem value="partner">Partner</MenuItem>
          </TextField>
          <TextField select fullWidth margin="dense" label="Status" name="status" value={formData.status} onChange={handleChange}>
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="contacted">Contacted</MenuItem>
            <MenuItem value="converted">Converted</MenuItem>
          </TextField>
          <TextField fullWidth margin="dense" label="Source" name="source" value={formData.source} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {selectedContact ? "Update" : "Create"}
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

export default Contacts;
