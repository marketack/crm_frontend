export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: "info" | "warning" | "success" | "error";
    isRead: boolean;
    createdAt: string;
  }
  