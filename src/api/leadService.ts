import apiClient from "./apiClient";

// ✅ Define Lead Type

export interface Lead {
  _id: string;
  name: string;
  position?: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  website?: string;
  priority?: string;
  leadValue: number;
  defaultLanguage: string;
  status: "new" | "contacted" | "proposal_sent" | "closed_won" | "closed_lost" | "in_progress";
  source: "LinkedIn" | "Google Ads" | "Referral" | "Cold Call" | "Other";
  assignedTo?: string | { _id: string; name: string; email: string };
  assignedEmployee?: string; // This is derived from assignedTo.name
  tags: string[];
  engagementScore: number;
  leadScore: number;
  createdBy?: { _id: string; name: string; email: string };
  createdAt?: Date;
  updatedAt?: Date;

}

/** ✅ Get All Leads */
/** ✅ Get All Leads */
export const getLeads = async (): Promise<Lead[]> => {
  try {
    const response = await apiClient.get<{ message: string; leads: Lead[] }>("/leads"); // ✅ Define response structure
    return response.data.leads; // ✅ Return only the leads array
  } catch (error) {
    console.error("Error fetching leads:", error);
    return [];
  }
};
export const convertLeadToCustomer = async (leadId: string) => {
  try {
    const response = await fetch(`/api/leads/${leadId}/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return await response.json();
  } catch (error) {
    console.error("Error converting lead to customer:", error);
  }
};


/** ✅ Create a Lead */
export const createLead = async (leadData: Omit<Lead, "_id">) => {
  try {
    const response = await apiClient.post("/leads", leadData);
    return response.data;
  } catch (error) {
    console.error("Error creating lead:", error);
    throw error;
  }
};

/** ✅ Update a Lead */
export const updateLead = async (leadId: string, updatedData: Partial<Lead>) => {
  try {
    const response = await apiClient.patch(`/leads/${leadId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating lead:", error);
    throw error;
  }
};

/** ✅ Delete a Lead */
export const deleteLead = async (leadId: string) => {
  try {
    const response = await apiClient.delete(`/leads/${leadId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting lead:", error);
    throw error;
  }
};
