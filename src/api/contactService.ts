import apiClient from "./apiClient";

// ✅ Define Contact Type
export interface Contact {
  _id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  type: "lead" | "customer" | "partner";
  status: "new" | "contacted" | "qualified" | "proposal_sent" | "closed" | "active" | "inactive";
  source?: "Facebook" | "LinkedIn" | "Google Ads" | "Referral" | "Other";
}

/** ✅ Get All Contacts */
export const getContacts = async (): Promise<Contact[]> => {
  try {
    const response = await apiClient.get<Contact[]>("/contacts");
    return response.data;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
};

/** ✅ Create a Contact */
export const createContact = async (contactData: Omit<Contact, "_id">) => {
  try {
    const response = await apiClient.post<Contact>("/contacts", contactData);
    return response.data;
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
};

/** ✅ Update a Contact */
export const updateContact = async (contactId: string, updatedData: Partial<Contact>) => {
  try {
    const response = await apiClient.patch<Contact>(`/contacts/${contactId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating contact:", error);
    throw error;
  }
};

/** ✅ Delete a Contact */
export const deleteContact = async (contactId: string) => {
  try {
    const response = await apiClient.delete<{ message: string }>(`/contacts/${contactId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
};
