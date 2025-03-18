import apiClient from "./apiClient";

// ✅ Define Ticket Type
export interface Ticket {
  _id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "closed";
  assignedTo?: string;
  messages?: { message: string; createdAt: string; sender: string }[];
}

/** ✅ Get All Tickets */
export const getTickets = async (): Promise<Ticket[]> => {
  try {
    const response = await apiClient.get<Ticket[]>("/tickets");
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
};

/** ✅ Create a Ticket */
export const createTicket = async (ticketData: Omit<Ticket, "_id" | "messages">) => {
  try {
    const response = await apiClient.post("/tickets", ticketData);
    return response.data;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

/** ✅ Update a Ticket */
export const updateTicket = async (ticketId: string, updatedData: Partial<Ticket>) => {
  try {
    const response = await apiClient.patch(`/tickets/${ticketId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error;
  }
};

/** ✅ Add a Message to a Ticket */
export const addTicketMessage = async (ticketId: string, messageData: { message: string }) => {
  try {
    const response = await apiClient.post(`/tickets/${ticketId}/message`, messageData);
    return response.data;
  } catch (error) {
    console.error("Error adding message to ticket:", error);
    throw error;
  }
};

/** ✅ Delete a Ticket */
export const deleteTicket = async (ticketId: string) => {
  try {
    const response = await apiClient.delete(`/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting ticket:", error);
    throw error;
  }
};
