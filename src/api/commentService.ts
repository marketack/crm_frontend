import axios from "axios";
import API_BASE_URL from "./apiConfig";

// ✅ Define API endpoint
const COMMENT_API = `${API_BASE_URL}/comments`;

// ✅ Define Comment Type
export interface Comment {
  _id: string;
  relatedTo: string; // ✅ Can be any CRM section (dynamic)
  type?: string; // ✅ Now supports any type dynamically
  message: string;
  createdAt: string;
}

/** ✅ Create a Comment (Supports Any Section) */
export const createComment = async (token: string, commentData: {
  relatedTo: string;
  type?: string; // ✅ Type is optional to support any page
  message: string;
}) => {
  try {
    const response = await axios.post(COMMENT_API, commentData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

/** ✅ Get Comments (Supports Any Section Dynamically) */
export const getComments = async (token: string, relatedTo: string): Promise<Comment[]> => {
  try {
    const response = await axios.get<Comment[]>(`${COMMENT_API}`, { // ✅ Use query parameter instead of path param
      headers: { Authorization: `Bearer ${token}` },
      params: { relatedTo }, // ✅ Query parameter
    });

    return response.data || [];
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    return []; // ✅ Return empty array instead of undefined
  }
};
/** ✅ Update a Comment */
export const updateComment = async (token: string, commentId: string, updatedMessage: string) => {
  try {
    const response = await axios.patch(`${COMMENT_API}/${commentId}`, { message: updatedMessage }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

/** ✅ Delete a Comment */
export const deleteComment = async (token: string, commentId: string) => {
  try {
    const response = await axios.delete(`${COMMENT_API}/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
