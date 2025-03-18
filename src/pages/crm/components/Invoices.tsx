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
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getInvoices, createInvoice, updateInvoice, deleteInvoice, Invoice } from "../../../api/invoiceService";

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState<Partial<Invoice>>({
    customer: "",
    items: [{ description: "", quantity: 1, price: 0 }],
    subtotal: 0,
    totalAmount: 0,
    amountPaid: 0,
    balanceDue: 0,
    dueDate: new Date().toISOString().split("T")[0],
    status: "pending",
    currency: "USD",
    notes: "",
  });
  

  // ✅ Fetch Invoices on Load
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getInvoices();
        setInvoices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading invoices:", error);
      }
    };
    fetchInvoices();
  }, []);

  // ✅ Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      status: event.target.value as "pending" | "paid" | "overdue" | "partially_paid",
    }));
  };
  // ✅ Open Dialog for Create/Edit
  const handleOpenDialog = (invoice?: Invoice) => {
    setSelectedInvoice(invoice || null);
    setFormData(
      invoice
        ? { ...invoice }
        : {
            customer: "",
            items: [{ description: "", quantity: 1, price: 0 }],
            subtotal: 0,
            totalAmount: 0,
            amountPaid: 0,
            balanceDue: 0,
            dueDate: new Date().toISOString().split("T")[0],
            status: "pending",
            currency: "USD",
            notes: "",
          }
    );
    setOpenDialog(true);
  };
  
  // ✅ Handle Form Submission (Create or Update)
  const handleSubmit = async () => {
    try {
      if (selectedInvoice) {
        await updateInvoice(selectedInvoice._id, formData);
        setSnackbar({ open: true, message: "Invoice updated successfully!", severity: "success" });
      } else {
        await createInvoice(formData as Invoice);
        setSnackbar({ open: true, message: "Invoice added successfully!", severity: "success" });
      }
      setOpenDialog(false);
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to save invoice", severity: "error" });
    }
  };

  // ✅ Handle Invoice Deletion
  const handleDelete = async (invoiceId: string) => {
    try {
      await deleteInvoice(invoiceId);
      setInvoices(invoices.filter((invoice) => invoice._id !== invoiceId));
      setSnackbar({ open: true, message: "Invoice deleted successfully!", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to delete invoice", severity: "error" });
    }
  };

  // ✅ MUI DataGrid Columns
  const columns: GridColDef[] = [
    { field: "customer", headerName: "Customer", flex: 1 },
    { field: "subtotal", headerName: "Subtotal", flex: 1 }, // ✅ Changed from `amount`
    { field: "totalAmount", headerName: "Total Amount", flex: 1 },
    { field: "amountPaid", headerName: "Paid", flex: 1 },
    { field: "balanceDue", headerName: "Balance Due", flex: 1 },
    { field: "dueDate", headerName: "Due Date", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "notes", headerName: "Notes", flex: 1 },
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
        Invoice Management
      </Typography>

      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ marginBottom: 2 }}>
        Add New Invoice
      </Button>

      <DataGrid rows={invoices} columns={columns} pageSizeOptions={[5, 10, 20]} autoHeight getRowId={(row) => row._id} />

      {/* ✅ Snackbar for Notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* ✅ Invoice Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{selectedInvoice ? "Edit Invoice" : "Add New Invoice"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Customer Name" name="customer" value={formData.customer} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Amount" name="amount" type="number" value={formData.subtotal} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Due Date" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} />
          
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select name="status" value={formData.status} onChange={handleSelectChange}>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="overdue">Overdue</MenuItem>
            </Select>
          </FormControl>

          <TextField fullWidth margin="dense" label="Notes" name="notes" multiline rows={3} value={formData.notes} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Invoices;
