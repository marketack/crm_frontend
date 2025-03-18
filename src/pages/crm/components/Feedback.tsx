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
import { getFeedback, submitFeedback, Feedback as FeedbackType } from "../../../api/feedbackService";
const Feedback: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<FeedbackType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" | "warning" }>({
    open: false,
    message: "",
    severity: "info",
  });

  const [formData, setFormData] = useState<Omit<FeedbackType, "_id" | "submittedAt">>({
    user: "",
    message: "",
    rating: 5,
  });
  
  // ✅ Fetch Feedback
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const data = await getFeedback();
        setFeedbackList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading feedback:", error);
      }
    };
    fetchFeedback();
  }, []);

  // ✅ Handle Form Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Submit Feedback
  const handleSubmit = async () => {
    try {
      const response = await submitFeedback(formData);
      setSnackbar({ open: true, message: "Feedback submitted successfully!", severity: "success" });
      setFeedbackList([...feedbackList, response]);
      setOpenDialog(false);
      setFormData({ user: "", message: "", rating: 5 });
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to submit feedback", severity: "error" });
    }
  };

  // ✅ MUI DataGrid Columns
  const columns: GridColDef[] = [
    { field: "user", headerName: "User", flex: 1 },
    { field: "message", headerName: "Message", flex: 2 },
    { field: "rating", headerName: "Rating", flex: 1 },
    { field: "submittedAt", headerName: "Submitted At", flex: 1 },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Feedback
      </Typography>

      <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)} sx={{ marginBottom: 2 }}>
        Submit Feedback
      </Button>

      <DataGrid rows={feedbackList} columns={columns} pageSizeOptions={[5, 10, 20]} autoHeight getRowId={(row) => row._id} />

      {/* ✅ Dialog for Submitting Feedback */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Submit Feedback</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="User" name="user" fullWidth value={formData.user} onChange={handleChange} required />
          <TextField margin="dense" label="Message" name="message" fullWidth value={formData.message} onChange={handleChange} multiline required />
          <TextField
            margin="dense"
            label="Rating"
            name="rating"
            select
            fullWidth
            value={formData.rating}
            onChange={handleChange}
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <MenuItem key={rating} value={rating}>
                {rating}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
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

export default Feedback;
