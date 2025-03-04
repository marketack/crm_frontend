import axios from "axios";
import API_BASE_URL from "./apiConfig";

// Define the Notification Type
interface Notification {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const api = axios.create({
  baseURL: `${API_BASE_URL}/notifications`,
  headers: { "Content-Type": "application/json" },
});

const NotificationService = {
  /**
   * ✅ Fetch notifications for the logged-in user
   * @param token - JWT token for authentication
   * @returns List of notifications
   */
  getUserNotifications: async (token: string): Promise<Notification[]> => {
    if (!token) return [];
    try {
      const response = await api.get<{ notifications: Notification[] }>("/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.notifications ?? [];
    } catch (error: any) {
      console.error(`❌ Error fetching notifications: ${error?.response?.data?.message || error.message}`);
      return [];
    }
  },

  /**
   * ✅ Mark a notification as read
   * @param notificationId - The ID of the notification to mark as read
   * @param token - JWT token for authentication
   */
  markNotificationAsRead: async (notificationId: string, token: string): Promise<boolean> => {
    if (!token) return false;
    try {
      const response = await api.patch(
        "/read",
        { notificationIds: [notificationId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.status === 200;
    } catch (error: any) {
      console.error(`❌ Error marking notification as read: ${error?.response?.data?.message || error.message}`);
      return false;
    }
  },

  /**
   * ✅ Delete a notification (FIXED)
   * @param notificationId - The ID of the notification to delete
   * @param token - JWT token for authentication
   */
  deleteNotification: async (notificationId: string, token: string): Promise<boolean> => {
    if (!token) return false;
    try {
      const response = await api.delete(`/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.status === 200;
    } catch (error: any) {
      console.error(`❌ Error deleting notification: ${error?.response?.data?.message || error.message}`);
      return false;
    }
  },
};

export default NotificationService;
