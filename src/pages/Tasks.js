import React, { useEffect, useState } from "react";
import {
  Container, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, CircularProgress, Select, MenuItem, Chip
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import { getTasks, createTask, updateTask, deleteTask } from "../services/taskService";
import { getStaff } from "../services/staffService";
import AddIcon from "@mui/icons-material/Add";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [staff, setStaff] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [currentTask, setCurrentTask] = useState({
    id: "",
    title: "",
    description: "",
    status: "Pending",
    assignedTo: "",
  });

  const statusOptions = ["Pending", "In Progress", "Completed", "Cancelled"];
  const statusColors = {
    Pending: "warning",
    "In Progress": "primary",
    Completed: "success",
    Cancelled: "error",
  };

  useEffect(() => {
    loadStaff(); // Load staff before tasks
  }, []);

  useEffect(() => {
    if (staff.length > 0) {
      loadTasks();
    }
  }, [staff]); // Ensure staff is loaded before tasks are mapped

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      console.log("✅ Debug - Tasks Loaded:", data);
      setTasks(data.map(task => ({
        ...task,
        id: task.id || task._id,
        assignedTo: task.assignedTo?._id || task.assignedTo || "", // Ensure correct format
      })));
    } catch (error) {
      toast.error("Failed to load tasks.");
    } finally {
      setFetching(false);
    }
  };

  const loadStaff = async () => {
    try {
      const data = await getStaff();
      console.log("✅ Debug - Staff Loaded:", data);
      setStaff(data);
    } catch (error) {
      toast.error("Failed to load staff.");
    }
  };

  const handleOpen = (task = null) => {
    setCurrentTask({
      id: task?.id || task?._id || "",
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || "Pending",
      assignedTo: task?.assignedTo?._id || task?.assignedTo || "", // Ensure correct format
    });
    setIsEditing(!!task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentTask({
      id: "",
      title: "",
      description: "",
      status: "Pending",
      assignedTo: "",
    });
  };

  const handleChange = (e) => {
    setCurrentTask({ ...currentTask, [e.target.name]: e.target.value });
  };

  const handleSaveTask = async () => {
    if (!currentTask.title || !currentTask.description) {
      toast.error("All fields are required.");
      return;
    }
  
    setLoading(true);
    try {
      let updatedTask;
      
      if (isEditing) {
        if (!currentTask.id) {
          toast.error("Task ID is missing.");
          return;
        }
        
        updatedTask = await updateTask(currentTask.id, {
          title: currentTask.title,
          description: currentTask.description,
          status: currentTask.status,
          assignedTo: currentTask.assignedTo || null, // ✅ Send assignedTo
        });
        
        setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
      } else {
        updatedTask = await createTask({
          title: currentTask.title,
          description: currentTask.description,
          status: currentTask.status,
          assignedTo: currentTask.assignedTo || null, // ✅ Send assignedTo
        });
        
        setTasks([...tasks, updatedTask]);
      }
  
      toast.success(`Task ${isEditing ? "updated" : "added"} successfully!`);
      handleClose();
    } catch (error) {
      toast.error("Failed to save task.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      toast.error("Failed to delete task.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Task Management</Typography>

      <Button 
        variant="contained" 
        startIcon={<AddIcon />} 
        onClick={() => handleOpen()} 
        sx={{ marginBottom: 2 }}
      >
        Add Task
      </Button>

      {fetching ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Assigned To</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <TableRow key={task.id || `task-${index}`}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>
  {task.assignedTo
    ? `${task.assignedTo.name} (${task.assignedTo.email})`
    : "Unassigned"}
</TableCell>

                    <TableCell>
                      <Chip label={task.status} color={statusColors[task.status] || "default"} />
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpen(task)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteTask(task.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">No tasks available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}



      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? "Edit Task" : "Add New Task"}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" name="title" label="Title" fullWidth variant="outlined" value={currentTask.title} onChange={handleChange} />
          <TextField margin="dense" name="description" label="Description" fullWidth variant="outlined" value={currentTask.description} onChange={handleChange} />
          <Select fullWidth variant="outlined" name="status" value={currentTask.status} onChange={handleChange}>
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
          <Select fullWidth variant="outlined" name="assignedTo" value={currentTask.assignedTo || ""} onChange={handleChange}>
            <MenuItem value="">Unassigned</MenuItem>
            {staff.map((member) => (
              <MenuItem key={member.id} value={member.id}>{member.name} ({member.email})</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSaveTask} color="primary" variant="contained" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update Task" : "Add Task"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Tasks;
