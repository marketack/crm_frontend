import React, { useEffect, useState } from "react";
import { Container, Typography, Button, List, ListItem, ListItemText, Paper, IconButton } from "@mui/material";
import { getTasks, createTask, deleteTask } from "../services/taskService";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import TaskFormDialog from "../components/TaskFormDialog";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      fetchTasks();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create task.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      toast.error("Failed to delete task.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Tasks</Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Task</Button>
      <TaskFormDialog open={open} onClose={() => setOpen(false)} onSave={handleCreateTask} />
      
      <List>
        {tasks.map((task) => (
          <Paper key={task._id} sx={{ marginBottom: 2, padding: 2 }}>
            <ListItem>
              <ListItemText primary={task.title} secondary={task.description} />
              <IconButton onClick={() => handleDeleteTask(task._id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Container>
  );
};

export default Tasks;

