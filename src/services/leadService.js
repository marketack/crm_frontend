import API from "./api";
import { toast } from "react-toastify";

// ✅ Get All Leads
export const getLeads = async () => {
  try {
    const response = await API.get("/leads");
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch leads.");
    throw error;
  }
};

// Create a New Lead
export const createLead = async (leadData) => {
  const response = await API.post("/leads", leadData);
  return response.data;
};

// Update Lead
export const updateLead = async (leadId, leadData) => {
  const response = await API.put(`/leads/${leadId}`, leadData);
  return response.data;
};

// Delete Lead
export const deleteLead = async (leadId) => {
  const response = await API.delete(`/leads/${leadId}`);
  return response.data;
};
