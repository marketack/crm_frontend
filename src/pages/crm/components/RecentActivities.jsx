import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Paper } from "@mui/material";

const RecentActivities = ({ activities }) => {
  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <List>
        {activities.map((activity, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={activity.description}
              secondary={`${activity.timestamp} - ${activity.userId.name}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default RecentActivities;