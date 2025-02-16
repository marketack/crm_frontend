import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";

const TaskFormDialog = ({ open, onClose, onSave }) => {
  const [taskData, setTaskData] = useState({ title: "", description: "", assignedTo: "", status: "Pending" });

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(taskData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Task</DialogTitle>
      <DialogContent>
        <TextField label="Title" name="title" fullWidth margin="normal" onChange={handleChange} />
        <TextField label="Description" name="description" fullWidth margin="normal" onChange={handleChange} />
        <TextField label="Assigned To" name="assignedTo" fullWidth margin="normal" onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskFormDialog;
