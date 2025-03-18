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
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getLogs, clearLogs, Log } from "../../../api/logsService";

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" | "warning" }>({
    open: false,
    message: "",
    severity: "info",
  });

  // ✅ Fetch Logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getLogs();
        setLogs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading logs:", error);
      }
    };
    fetchLogs();
  }, []);

  // ✅ Handle Clear Logs
  const handleClearLogs = async () => {
    try {
      await clearLogs();
      setLogs([]);
      setSnackbar({ open: true, message: "Logs cleared successfully!", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to clear logs", severity: "error" });
    }
    setOpenDialog(false);
  };

  // ✅ MUI DataGrid Columns
  const columns: GridColDef[] = [
    { field: "action", headerName: "Action", flex: 1 },
    { field: "user", headerName: "User", flex: 1 },
    { field: "timestamp", headerName: "Timestamp", flex: 1 },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        System Logs
      </Typography>

      <Button variant="contained" color="error" onClick={() => setOpenDialog(true)} sx={{ marginBottom: 2 }}>
        Clear Logs
      </Button>

      <DataGrid rows={logs} columns={columns} pageSizeOptions={[5, 10, 20]} autoHeight getRowId={(row) => row._id} />

      {/* ✅ Dialog for Confirming Log Clearance */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle>Clear Logs</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to clear all logs? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleClearLogs} variant="contained" color="error">
            Clear Logs
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

export default Logs;
