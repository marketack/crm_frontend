import apiClient from "./apiClient";

// ✅ Define Feedback Type
export interface Feedback {
  _id: string;
  user: string;
  message: string;
  rating?: number;
  submittedAt: string;
}

/** ✅ Submit Feedback */
export const submitFeedback = async (feedbackData: Omit<Feedback, "_id" | "submittedAt">) => {
  try {
    const response = await apiClient.post<Feedback>("/feedback", feedbackData);
    return response.data;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};

/** ✅ Get All Feedback */
export const getFeedback = async (): Promise<Feedback[]> => {
  try {
    const response = await apiClient.get<Feedback[]>("/feedback");
    return response.data;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return [];
  }
};
