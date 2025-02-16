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

export const updateLead = async (leadId, leadData) => {
  console.log("🔍 Debug: Updating Lead ID:", leadId); // ✅ Debugging

  if (!leadId) {
    console.error("❌ Error: leadId is undefined in updateLead()");
    toast.error("Invalid Lead ID.");
    return Promise.reject(new Error("leadId is required for updating a lead"));
  }

  try {
    const response = await API.put(`/leads/${leadId}`, leadData);
    return response.data;
  } catch (error) {
    console.error("❌ Update Lead Error:", error);
    toast.error("Failed to update lead.");
    throw error;
  }
};


export const deleteLead = async (leadId) => {
  console.log("Deleting Lead ID:", leadId); // ✅ Debugging

  try {
    const response = await API.delete(`/leads/${leadId}`);
    return response.data;
  } catch (error) {
    console.error("Delete Lead Error:", error);
    toast.error("Failed to delete lead.");
    throw error;
  }
};
