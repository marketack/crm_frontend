import apiClient from "./apiClient";

interface Expense {
  amount: number;
  category: string;
  description?: string;
  incurredAt?: string;
}

interface Milestone {
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  progress: number;
  assignedTo?: string;
}

export interface TeamMember {
  user: string;  // User ID
  name: string;  // User Name (Added for Display)
  role: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  budget: number;
  expenses: Expense[];
  deadline?: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "planned" | "in_progress" | "completed" | "on_hold" | "paused" | "archived" | "canceled";
  teamMembers: TeamMember[];
  milestones: Milestone[];
  attachments: string[];
  dependencies: string[];
  createdBy?: string; // ✅ Made Optional
}


/** ✅ Get All Projects */
export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await apiClient.get<Project[]>("/projects");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching projects:", error.response?.data || error.message);
    return [];
  }
};

/** ✅ Get a Single Project by ID */
export const getProjectById = async (projectId: string): Promise<Project | null> => {
  try {
    const response = await apiClient.get<Project>(`/projects/${projectId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching project:", error.response?.data || error.message);
    return null;
  }
};

/** ✅ Create a Project */
export const createProject = async (projectData: Omit<Project, "_id">): Promise<Project> => {
  try {
    // Add `createdBy` if missing (e.g., fetch user ID from auth)
    const finalProjectData = {
      ...projectData,
      createdBy: projectData.createdBy || "system", // ✅ Default if missing
    };

    const response = await apiClient.post<Project>("/projects", finalProjectData);
    return response.data;
  } catch (error: any) {
    console.error("Error creating project:", error.response?.data || error.message);
    throw error;
  }
};

/** ✅ Update a Project */
export const updateProject = async (projectId: string, updatedData: Partial<Project>): Promise<Project> => {
  try {
    const response = await apiClient.patch<Project>(`/projects/${projectId}`, updatedData);
    return response.data;
  } catch (error: any) {
    console.error("Error updating project:", error.response?.data || error.message);
    throw error;
  }
};

/** ✅ Delete a Project */
export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    await apiClient.delete(`/projects/${projectId}`);
  } catch (error: any) {
    console.error("Error deleting project:", error.response?.data || error.message);
    throw error;
  }
};

/** ✅ Add Expense to a Project */
export const addExpense = async (projectId: string, expenseData: Expense): Promise<Project> => {
  try {
    const response = await apiClient.post<Project>(`/projects/${projectId}/expenses`, expenseData);
    return response.data;
  } catch (error: any) {
    console.error("Error adding expense:", error.response?.data || error.message);
    throw error;
  }
};

/** ✅ Update an Expense */
export const updateExpense = async (projectId: string, expenseId: string, expenseData: Expense): Promise<Project> => {
  try {
    const response = await apiClient.patch<Project>(`/projects/${projectId}/expenses/${expenseId}`, expenseData);
    return response.data;
  } catch (error: any) {
    console.error("Error updating expense:", error.response?.data || error.message);
    throw error;
  }
};

/** ✅ Delete Expense for a Project */
export const deleteExpense = async (projectId: string, expenseId: string): Promise<Project> => {
  try {
    const response = await apiClient.delete<Project>(`/projects/${projectId}/expenses/${expenseId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting expense:", error.response?.data || error.message);
    throw error;
  }
};

/** ✅ Add a Milestone */
export const addMilestone = async (projectId: string, milestoneData: Milestone): Promise<Project> => {
  try {
    const response = await apiClient.post<Project>(`/projects/${projectId}/milestones`, milestoneData);
    return response.data;
  } catch (error: any) {
    console.error("Error adding milestone:", error.response?.data || error.message);
    throw error;
  }
};

/** ✅ Update a Milestone */
export const updateMilestone = async (projectId: string, milestoneId: string, milestoneData: Milestone): Promise<Project> => {
  try {
    const response = await apiClient.patch<Project>(`/projects/${projectId}/milestones/${milestoneId}`, milestoneData);
    return response.data;
  } catch (error: any) {
    console.error("Error updating milestone:", error.response?.data || error.message);
    throw error;
  }
};

/** ✅ Delete Milestone for a Project */
export const deleteMilestone = async (projectId: string, milestoneId: string): Promise<Project> => {
  try {
    const response = await apiClient.delete<Project>(`/projects/${projectId}/milestones/${milestoneId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting milestone:", error.response?.data || error.message);
    throw error;
  }
};
