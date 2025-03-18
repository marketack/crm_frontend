import apiBase from "./apiBase";

export interface ActivityLog {
  _id: string;
  userId: { _id: string; name: string; email: string };
  action: string;
  timestamp: string;
  ipAddress?: string;
}

/** ✅ Fetch all activity logs (Admin & Instructor Only) */
export const getActivityLogs = async (): Promise<ActivityLog[]> => {
  try {
    const response = await apiBase.get<{ logs: ActivityLog[] }>("/activity-logs");
    return response.data.logs;
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }
};

/** ✅ Fetch activity logs for a specific user */
export const getUserActivityLogs = async (userId: string): Promise<ActivityLog[]> => {
  try {
    const response = await apiBase.get<ActivityLog[]>(`/activity-logs/user/${userId}`); // ✅ Corrected return type
    return response.data || []; // ✅ Ensure it's an array
  } catch (error) {
    console.error("Error fetching user activity logs:", error);
    return [];
  }
};


/** ✅ Fetch activity logs for a specific entity (Lead, Customer, etc.) */
export const getEntityActivityLogs = async (entityType: string, entityId: string): Promise<ActivityLog[]> => {
  try {
    const response = await apiBase.get<{ logs: ActivityLog[] }>(`/activity-logs/entity/${entityType}/${entityId}`);
    return response.data.logs;
  } catch (error) {
    console.error(`Error fetching ${entityType} activity logs:`, error);
    return [];
  }
};

/** ✅ Log a new activity */
export const logActivity = async (userId: string, action: string, ipAddress?: string): Promise<boolean> => {
  try {
    await apiBase.post("/activity-logs", { userId, action, ipAddress });
    return true;
  } catch (error) {
    console.error("Error logging activity:", error);
    return false;
  }
};

