import apiClient from "./apiClient";

// ✅ Define Log Type
export interface Log {
  _id: string;
  action: string;
  user: string;
  timestamp: string;
}

/** ✅ Get All Logs */
export const getLogs = async (): Promise<Log[]> => {
  try {
    const response = await apiClient.get<Log[]>("/logs");
    return response.data;
  } catch (error) {
    console.error("Error fetching logs:", error);
    return [];
  }
};

/** ✅ Clear Logs */
export const clearLogs = async (): Promise<{ message: string }> => {
  try {
    const response = await apiClient.delete<{ message: string }>("/logs");
    return response.data;
  } catch (error) {
    console.error("Error clearing logs:", error);
    throw error;
  }
};
