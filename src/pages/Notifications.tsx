import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Typography,
  IconButton,
  Divider,
  Box,
  CircularProgress,
  Menu,
  Badge,
} from "@mui/material";
import { CheckCircle, Notifications as NotificationsIcon, Delete } from "@mui/icons-material";
import NotificationService from "../api/notificationService";
import io from "socket.io-client";
import { useAppSelector } from "../redux/store";

// ✅ WebSocket Connection
const socket = io("http://localhost:5000");

// ✅ Define NotificationData Interface
interface NotificationData {
  _id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  isRead: boolean;
  createdAt: string;
}

// ✅ Ensure User Type has `_id`
interface User {
  _id: string;
  name: string;
  email: string;
  roles: string[];
}

const Notifications: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user) as User | null;
  const token = useAppSelector((state) => state.auth.token) || "";

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (user?._id) fetchNotifications();

    socket.on(`notification-${user?._id}`, (newNotification: Partial<NotificationData>) => {
      if (newNotification._id) {
        setNotifications((prev) => [
          {
            _id: newNotification._id ?? "", // ✅ Ensure `_id` is always a string
            title: newNotification.title ?? "No Title",
            message: newNotification.message ?? "No Message",
            type: newNotification.type || "info",
            isRead: newNotification.isRead ?? false,
            createdAt: newNotification.createdAt ?? new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    });

    return () => {
      socket.off(`notification-${user?._id}`);
    };
  }, [user]);

  // ✅ Fetch notifications from API & Fix Missing Properties
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data: Partial<NotificationData>[] = await NotificationService.getUserNotifications(token);

      // 🔧 Ensure data matches `NotificationData`
      const transformedData: NotificationData[] = data
        .filter((notif) => notif._id) // ✅ Ensure `_id` is defined
        .map((notif) => ({
          _id: notif._id ?? "", // ✅ Fix _id being possibly undefined
          title: notif.title ?? "No Title",
          message: notif.message ?? "No Message",
          type: notif.type || "info", // ✅ Default to "info" if missing
          isRead: notif.isRead ?? false, // ✅ Default to false if missing
          createdAt: notif.createdAt ?? new Date().toISOString(),
        }));

      setNotifications(transformedData);
    } catch (error) {
      console.error("Error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark notification as read
  const markAsRead = async (id: string) => {
    if (!token) return;
    await NotificationService.markNotificationAsRead(id, token);
    setNotifications((prev) =>
      prev.map((notif) => (notif._id === id ? { ...notif, isRead: true } : notif))
    );
  };

  // ✅ Delete notification
  const deleteNotification = async (id: string) => {
    if (!token) return;
    await NotificationService.deleteNotification(id, token);
    setNotifications((prev) => prev.filter((notif) => notif._id !== id));
  };

  return (
    <Container>
      {/* 🔔 Notification Bell */}
      <IconButton color="primary" onClick={(event) => setAnchorEl(event.currentTarget)}>
        <Badge badgeContent={notifications.filter((n) => !n.isRead).length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} sx={{ mt: 2 }}>
        <Box sx={{ width: 350, maxHeight: 400, overflowY: "auto", p: 2 }}>
          <Typography variant="h6">Notifications</Typography>
          <Divider sx={{ mb: 2 }} />

          {loading ? (
            <CircularProgress sx={{ display: "block", mx: "auto" }} />
          ) : notifications.length === 0 ? (
            <Typography>No new notifications</Typography>
          ) : (
            notifications.map((notification) => (
              <Card key={notification._id} sx={{ p: 2, m: 1, backgroundColor: notification.isRead ? "#f0f0f0" : "white" }}>
                <Typography variant="h6">{notification.title}</Typography>
                <Typography variant="body2">{notification.message}</Typography>
                <IconButton color="success" onClick={() => markAsRead(notification._id)}>
                  <CheckCircle />
                </IconButton>
                <IconButton color="error" onClick={() => deleteNotification(notification._id)}>
                  <Delete />
                </IconButton>
              </Card>
            ))
          )}
        </Box>
      </Menu>
    </Container>
  );
};

export default Notifications;
