import API from "./api";
import { toast } from "react-toastify";

export const getTasks = async () => {
  try {
    const response = await API.get("/tasks");
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch tasks.");
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await API.post("/tasks", taskData);
    toast.success("Task created successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to create task.");
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await API.put(`/tasks/${taskId}`, {
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      assignedTo: taskData.assignedTo,  // ✅ Ensure this is sent
    });

    toast.success("Task updated successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to update task.");
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    await API.delete(`/tasks/${taskId}`);
    toast.success("Task deleted successfully!");
  } catch (error) {
    toast.error("Failed to delete task.");
    throw error;
  }
};
