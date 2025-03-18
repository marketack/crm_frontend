import apiClient from "./apiClient";

// ✅ Define Transaction Type
export interface Transaction {
  _id: string;
  amount: number;
  type: "deposit" | "withdrawal" | "expense" | "revenue";
  status: "pending" | "completed" | "failed";
  reference?: string;
  date?: string;
}

/** ✅ Get All Transactions */
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await apiClient.get<Transaction[]>("/transactions");
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

/** ✅ Create a Transaction */
export const createTransaction = async (transactionData: Omit<Transaction, "_id">) => {
  try {
    const response = await apiClient.post("/transactions", transactionData);
    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

/** ✅ Update a Transaction */
export const updateTransaction = async (transactionId: string, updatedData: Partial<Transaction>) => {
  try {
    const response = await apiClient.patch(`/transactions/${transactionId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

/** ✅ Delete a Transaction */
export const deleteTransaction = async (transactionId: string) => {
  try {
    const response = await apiClient.delete(`/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};
