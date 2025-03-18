import React, { useEffect, useState } from "react";
import { Container, Typography, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import { getActivityLogs } from "../api/activityLog.service";

interface ActivityLog {
  _id: string;
  userId: { name: string; email: string };
  action: string;
  timestamp: string;
}

const ActivityLogComponent: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivityLogs()
      .then(setLogs)
      .catch(() => alert("Error fetching logs"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 3 }} />;

  return (
    <Container>
      <Typography variant="h5" sx={{ mb: 2 }}>Activity Logs</Typography>
      <List>
        {logs.map((log) => (
          <ListItem key={log._id}>
            <ListItemText primary={`${log.userId.name} (${log.userId.email})`} secondary={`${log.action} - ${new Date(log.timestamp).toLocaleString()}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ActivityLogComponent;
