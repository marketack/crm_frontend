import apiClient from "./apiClient";

// ✅ Define Task Type
export interface Task {
  _id: string;
  title: string;
  name:string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  dueDate?: string;
  assignedTo?: { _id: string; name: string; email: string }[] | string[]; // ✅ Support both ID & full object
  priority: "low" | "medium" | "high";
  project?: { _id: string; name: string } | string; // ✅ Support both populated and ID-only project
}


/** ✅ Get All Tasks */
export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await apiClient.get<Task[]>("/tasks");
    return response.data.map(task => ({
      ...task,
      assignedTo: Array.isArray(task.assignedTo) ? task.assignedTo : [], // Ensure array format
      project: task.project ? task.project : null,
    }));
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    return [];
  }
};

/** ✅ Create a Task */
export const createTask = async (taskData: Omit<Task, "_id">) => {
  try {
    const response = await apiClient.post("/tasks", taskData);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating task:", error);
    throw error;
  }
};

/** ✅ Update a Task */
export const updateTask = async (taskId: string, updatedData: Partial<Task>) => {
  try {
    const response = await apiClient.patch(`/tasks/${taskId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating task:", error);
    throw error;
  }
};

/** ✅ Delete a Task */
export const deleteTask = async (taskId: string) => {
  try {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting task:", error);
    throw error;
  }
};
