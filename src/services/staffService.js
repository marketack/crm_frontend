import API from "./api";
import { toast } from "react-toastify";

// ✅ Get All Staff Members
export const getStaff = async () => {
  try {
    const response = await API.get("/staff");
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch staff.");
    throw error;
  }
};

// ✅ Create a New Staff Member (Admin Only)
export const createStaff = async (staffData) => {
  try {
    const response = await API.post("/staff", staffData);
    toast.success("Staff member added successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to add staff member.");
    throw error;
  }
};

// ✅ Update Staff Member (Admin Only)
export const updateStaff = async (staffId, staffData) => {
  try {
    const response = await API.put(`/staff/${staffId}`, staffData);
    toast.success("Staff member updated successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to update staff member.");
    throw error;
  }
};

// ✅ Delete Staff Member (Admin Only)
export const deleteStaff = async (staffId) => {
  try {
    await API.delete(`/staff/${staffId}`);
    toast.success("Staff member deleted successfully!");
  } catch (error) {
    toast.error("Failed to delete staff member.");
    throw error;
  }
};
