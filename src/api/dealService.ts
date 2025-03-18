import apiClient from "./apiClient";

// ✅ Define Deal Type
export interface Deal {
  _id: string;
  title: string;
  customer: string;
  amount: number;
  status: "open" | "negotiation" | "closed_won" | "closed_lost";
  stage?: string;
  probability?: number;
  notes?: string;
  createdAt: string;
  assignedTo:string;
}

// ✅ Create Deal Data Type
type DealData = Omit<Deal, "_id" | "createdAt">;

/** ✅ Get All Deals */
export const getDeals = async (): Promise<Deal[]> => {
  try {
    const response = await apiClient.get<Deal[]>("/deals");
    return response.data;
  } catch (error) {
    console.error("Error fetching deals:", error);
    return [];
  }
};

/** ✅ Create a Deal */
export const createDeal = async (dealData: DealData): Promise<Deal> => {
  try {
    const response = await apiClient.post<Deal>("/deals", dealData);
    return response.data;
  } catch (error) {
    console.error("Error creating deal:", error);
    throw error;
  }
};

/** ✅ Update a Deal */
export const updateDeal = async (dealId: string, updatedData: Partial<DealData>): Promise<Deal> => {
  try {
    const response = await apiClient.patch<Deal>(`/deals/${dealId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating deal:", error);
    throw error;
  }
};

/** ✅ Delete a Deal */
export const deleteDeal = async (dealId: string): Promise<{ message: string }> => {
  try {
    const response = await apiClient.delete<{ message: string }>(`/deals/${dealId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting deal:", error);
    throw error;
  }
};
