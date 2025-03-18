import apiClient from "./apiClient";
import { store } from "../redux/store"; // ✅ Fix: Import `store` properly
// ✅ Define Employee Type
interface Employee {
  _id: string;
  name: string;
  email: string;
  position: string;
  department: { _id: string; name: string } | string; // ✅ Allow Object or ID
  company: { _id: string; name: string } | string;
  user: string;
  salary: number;
  reportsTo?: { _id: string; name: string } | string; // ✅ Allow Object or ID
  createdAt?: Date;
  updatedAt?: Date;
  role?: { _id: string; name: string }; // ✅ Role is now optional
}
// ✅ Define ErrorResponse
interface ErrorResponse {
  success: boolean;
  message: string;
  error?: any;
}

// ✅ API Base URL
const EMPLOYEE_API_URL = "/employees";

/** ✅ Get All Employees */
export const getEmployees = async (): Promise<Employee[] | ErrorResponse> => {
  try {
    console.log("📡 Fetching Employees...");

    const response = await apiClient.get<{ success: boolean; employees?: Employee[] }>(EMPLOYEE_API_URL);

    console.log("✅ API Response:", response.data);

    if (response.data.success && Array.isArray(response.data.employees)) {
      return response.data.employees;
    }

    return { success: false, message: "Unexpected API response format", error: response.data };
  } catch (error: any) {
    console.error("❌ Error fetching employees:", error.response?.data || error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch employees", error };
  }
};






// ✅ Create an Employee (Automatically Fetch User ID)
export const createEmployee = async (employeeData: Omit<Employee, "_id" | "user">): Promise<Employee | ErrorResponse> => {
  console.log("📡 Creating Employee:", employeeData);

  try {
    // ✅ Only send the email, backend will find user by email
    const newEmployeeData = {
      ...employeeData,
    };

    console.log("📡 Sending Employee Data:", newEmployeeData);

    // ✅ Make API Call
    const response = await apiClient.post<{ success: boolean; employee?: Employee; message?: string }>(
      "/employees/assign",
      newEmployeeData
    );

    console.log("✅ API Response:", response.data);

    if (response.data.success && response.data.employee) {
      return response.data.employee;
    }

    return { success: false, message: response.data.message || "Failed to create employee" };
  } catch (error: any) {
    console.error("❌ Error creating employee:", error.response?.data || error);
    return { success: false, message: error.response?.data?.message || "API request failed", error };
  }
};



/** ✅ Get Employee by ID */
export const getEmployeeById = async (employeeId: string): Promise<Employee | ErrorResponse> => {
  try {
    const response = await apiClient.get<{ success: boolean; employee?: Employee }>(
      `${EMPLOYEE_API_URL}/${employeeId}`
    );

    if (response.data.success && response.data.employee) {
      return response.data.employee;
    }

    return { success: false, message: "Employee not found" };
  } catch (error: any) {
    console.error("❌ Error fetching employee:", error.response?.data || error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch employee", error };
  }
};

/** ✅ Update an Employee */
export const updateEmployee = async (employeeId: string, updatedData: Partial<Employee>): Promise<Employee | ErrorResponse> => {
  if (!employeeId) {
    return { success: false, message: "Employee ID is required" };
  }

  try {
    const response = await apiClient.patch<{ success: boolean; employee?: Employee }>(
      `${EMPLOYEE_API_URL}/update/${employeeId}`,
      updatedData
    );

    if (response.data.success && response.data.employee) {
      return response.data.employee;
    }

    return { success: false, message: "Failed to update employee" };
  } catch (error: any) {
    console.error("❌ Error updating employee:", error.response?.data || error);
    return { success: false, message: error.response?.data?.message || "API request failed", error };
  }
};

/** ✅ Delete an Employee */
export const deleteEmployee = async (employeeId: string): Promise<{ success: boolean; message: string } | ErrorResponse> => {
  if (!employeeId) {
    return { success: false, message: "Employee ID is required" };
  }

  try {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `${EMPLOYEE_API_URL}/delete/${employeeId}`
    );

    if (response.data.success) {
      return response.data;
    }

    return { success: false, message: "Failed to delete employee" };
  } catch (error: any) {
    console.error("❌ Error deleting employee:", error.response?.data || error);
    return { success: false, message: error.response?.data?.message || "API request failed", error };
  }
};

/**
 * ✅ Export all functions
 */
export default {
  getEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
