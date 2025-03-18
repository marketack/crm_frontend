import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Snackbar, Alert } from "@mui/material";
import { getTasks, createTask, updateTask, deleteTask, Task } from "../../../api/taskService";
import { getProjects} from "../../../api/projectService";
import { getEmployees } from "../../../api/employeeService";
import ReusableTable from "../../../components/ReusableTable";
import ReusableModal from "../../../components/ReusableModal";
import { Edit, Delete, Add } from "@mui/icons-material";

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<{ label: string; value: string }[]>([]);
  const [employees, setEmployees] = useState<{ label: string; value: string }[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" | "info" | "warning" }>({
    open: false,
    message: "",
    severity: "info",
  });

  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    description: "",
    priority: "low",
    status: "pending",
    dueDate: new Date().toISOString().split("T")[0], // Default to today
    assignedTo: [],
    project: "",
  });

  /** ✅ Fetch Tasks */
  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data.map((p) => ({ label: p.name, value: p._id })));
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      if (!Array.isArray(response)) {
        console.error("Unexpected response:", response);
        return;
      }
      setEmployees(response.map(emp => ({ label: emp.name, value: emp._id })));
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  /** ✅ Handle Input Change */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /** ✅ Handle Multi-Select Change */
  const handleSelectChange = (e: React.ChangeEvent<{ name: string; value: unknown }>) => {
    const selectedValues = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
    setFormData({ ...formData, [e.target.name]: selectedValues });
  };

  /** ✅ Handle Task Creation & Update */
  const handleSave = async () => {
    try {
      if (selectedTask) {
        await updateTask(selectedTask._id, formData);
        setSnackbar({ open: true, message: "Task updated successfully!", severity: "success" });
      } else {
        await createTask(formData as Task);
        setSnackbar({ open: true, message: "Task created successfully!", severity: "success" });
      }

      setOpenModal(false);
      fetchTasks();
      resetForm();
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to save task", severity: "error" });
    }
  };

  /** ✅ Reset Form */
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "low",
      status: "pending",
      dueDate: new Date().toISOString().split("T")[0],
      assignedTo: [],
      project: "",
    });
    setSelectedTask(null);
    setActiveStep(0);
  };

  /** ✅ Handle Edit Task */
  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      ...task,
      assignedTo: task.assignedTo
        ? task.assignedTo.map((user) => (typeof user === "string" ? user : user._id))
        : [],
      project: typeof task.project === "string" ? task.project : task.project?._id || "",
    });
  };
  

  /** ✅ Handle Delete Task */
  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((t) => t._id !== taskId));
      setSnackbar({ open: true, message: "Task deleted successfully!", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to delete task", severity: "error" });
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Task Management
      </Typography>

      <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => setOpenModal(true)} sx={{ marginBottom: 2 }}>
        Add New Task
      </Button>

      {/* ✅ Reusable Table for Tasks */}
      <ReusableTable
        title="Tasks"
        columns={[
          { id: "title", label: "Title", sortable: true },
          { id: "priority", label: "Priority", sortable: true },
          { id: "status", label: "Status", sortable: true },
          { id: "dueDate", label: "Due Date", sortable: true },

          {
            id: "assignedTo",
            label: "Assigned To",
            sortable: true,
            render: (row) => 
              row.assignedTo.length 
                ? row.assignedTo.map((u) => typeof u === "string" ? u : u.name).join(", ") 
                : "Unassigned",
          },
        ]}
        data={tasks}
        setData={setTasks}
        actions={[
          { icon: <Edit />, tooltip: "Edit Task", onClick: (row) => handleEdit(row) },
          { icon: <Delete />, tooltip: "Delete Task", onClick: (row) => handleDelete(row._id) },
        ]}
        selectable={true}
        searchPlaceholder="Search Tasks..."
      />


      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Tasks;