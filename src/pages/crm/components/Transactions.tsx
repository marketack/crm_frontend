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
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from "../../../api/transactionService";

// ✅ Define Transaction Type
interface Transaction {
  _id: string;
  amount: number;
  type: "deposit" | "withdrawal" | "expense" | "revenue";
  status: "pending" | "completed" | "failed";
  reference?: string;
  date?: string;
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" | "warning" }>({
    open: false,
    message: "",
    severity: "info",
  });

  const [formData, setFormData] = useState<Partial<Transaction>>({
    amount: 0,
    type: "deposit",
    status: "pending",
    reference: "",
    date: new Date().toISOString().split("T")[0], // Default to today
  });

  // ✅ Fetch Transactions
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  };

  // ✅ Handle Form Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Open Dialog for Adding or Editing
  const handleOpenDialog = (transaction?: Transaction) => {
    if (transaction) {
      setSelectedTransaction(transaction);
      setFormData(transaction);
    } else {
      setSelectedTransaction(null);
      setFormData({ amount: 0, type: "deposit", status: "pending", reference: "", date: new Date().toISOString().split("T")[0] });
    }
    setDialogOpen(true);
  };

  // ✅ Handle Create or Update Transaction
  const handleSubmit = async () => {
    try {
      if (selectedTransaction) {
        await updateTransaction(selectedTransaction._id, formData);
        setSnackbar({ open: true, message: "Transaction updated successfully!", severity: "success" });
      } else {
        await createTransaction(formData as Transaction);
        setSnackbar({ open: true, message: "Transaction added successfully!", severity: "success" });
      }

      setDialogOpen(false);
      setFormData({ amount: 0, type: "deposit", status: "pending", reference: "", date: new Date().toISOString().split("T")[0] });
      setSelectedTransaction(null);
      fetchTransactions(); // ✅ Refresh list
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to save transaction", severity: "error" });
    }
  };

  // ✅ Handle Delete Transaction
  const handleDelete = async (transactionId: string) => {
    try {
      await deleteTransaction(transactionId);
      setTransactions(transactions.filter((t) => t._id !== transactionId));
      setSnackbar({ open: true, message: "Transaction deleted successfully!", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to delete transaction", severity: "error" });
    }
  };

  // ✅ MUI DataGrid Columns
  const columns: GridColDef[] = [
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "reference", headerName: "Reference", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
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
        Transactions Management
      </Typography>

      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ marginBottom: 2 }}>
        Add New Transaction
      </Button>

      <DataGrid rows={transactions} columns={columns} pageSizeOptions={[5, 10, 20]} autoHeight getRowId={(row) => row._id} />

      {/* ✅ Add/Edit Transaction Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{selectedTransaction ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth type="number" label="Amount" name="amount" variant="outlined" value={formData.amount} onChange={handleChange} sx={{ marginTop: 2 }} />
          <TextField select fullWidth label="Type" name="type" variant="outlined" value={formData.type} onChange={handleChange} sx={{ marginTop: 2 }}>
            <MenuItem value="deposit">Deposit</MenuItem>
            <MenuItem value="withdrawal">Withdrawal</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
            <MenuItem value="revenue">Revenue</MenuItem>
          </TextField>
          <TextField select fullWidth label="Status" name="status" variant="outlined" value={formData.status} onChange={handleChange} sx={{ marginTop: 2 }}>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
          </TextField>
          <TextField fullWidth label="Reference" name="reference" variant="outlined" value={formData.reference} onChange={handleChange} sx={{ marginTop: 2 }} />
          <TextField fullWidth type="date" label="Date" name="date" variant="outlined" value={formData.date} onChange={handleChange} sx={{ marginTop: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {selectedTransaction ? "Update" : "Create"}
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

export default Transactions;
