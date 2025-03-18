import React, { useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";

// ✅ Define Types for Tasks, Invoices, and Projects
interface Task {
  title: string;
  dueDate?: string;
  endDate?: string;
}

interface CalendarProps {
  tasks: Task[];
  invoices: Task[];
  projects: Task[];
}

const CalendarComponent: React.FC<CalendarProps> = ({ tasks, invoices, projects }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // ✅ Filter Events for Selected Date
  const selectedEvents = [...tasks, ...invoices, ...projects].filter((event) => {
    const eventDate = event.dueDate ? new Date(event.dueDate) : event.endDate ? new Date(event.endDate) : null;
    return eventDate && format(eventDate, "yyyy-MM-dd") === format(selectedDate!, "yyyy-MM-dd");
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Task & Invoice Deadlines
      </Typography>

      {/* ✅ MUI Date Picker */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
        />
      </LocalizationProvider>

      {/* ✅ Display Events for Selected Date */}
      <Box sx={{ width: "100%", mt: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Events on {selectedDate ? format(selectedDate, "PPP") : "this day"}
        </Typography>
        <Divider />
        {selectedEvents.length === 0 ? (
          <Typography sx={{ textAlign: "center", color: "gray", mt: 1 }}>No events</Typography>
        ) : (
          <List>
            {selectedEvents.map((event, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={event.title}
                  secondary={`Due: ${
                    event.dueDate ? format(new Date(event.dueDate), "PPP") : format(new Date(event.endDate!), "PPP")
                  }`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default CalendarComponent;
