import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, CardActionArea, useTheme } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; // Ensure correct API import
import Chart from "chart.js/auto";

const Dashboard = ({ darkMode }) => {
  const [data, setData] = useState({ leads: 0, customers: 0, tasks: 0 });
  const navigate = useNavigate();
  const theme = useTheme(); // ✅ Get the current theme (dark or light)

  useEffect(() => {
    API.get("/dashboard") // ✅ Updated API endpoint
      .then((res) => setData(res.data))
      .catch((err) => console.error("Dashboard API Error:", err));
  }, []);

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: 3, textAlign: "center", color: theme.palette.text.primary }}>
        Dashboard Overview
      </Typography>
      
      {/* Clickable Cards */}
      <Grid container spacing={3}>
        {[
          { label: "Leads", value: data.leads, route: "/leads", color: "#3f51b5" },
          { label: "Customers", value: data.customers, route: "/customers", color: "#ff9800" },
          { label: "Tasks", value: data.tasks, route: "/tasks", color: "#4caf50" },
        ].map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card
              sx={{
                cursor: "pointer",
                backgroundColor: darkMode ? "#1E1E1E" : "#F5F5F5", // ✅ Changes background based on dark mode
                color: darkMode ? "#FFFFFF" : "#000000", // ✅ Adjusts text color
                transition: "background-color 0.3s",
              }}
            >
              <CardActionArea onClick={() => handleCardClick(item.route)}>
                <CardContent>
                  <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold" }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h4" sx={{ textAlign: "center", color: item.color }}>
                    {item.value}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bar Chart */}
      <Typography variant="h5" sx={{ marginTop: 4, textAlign: "center", color: theme.palette.text.primary }}>
        Performance Overview
      </Typography>
      <Bar
        data={{
          labels: ["Leads", "Customers", "Tasks"],
          datasets: [
            {
              label: "Count",
              data: [data.leads, data.customers, data.tasks],
              backgroundColor: ["#3f51b5", "#ff9800", "#4caf50"],
              borderRadius: 5,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              ticks: {
                color: darkMode ? "#FFFFFF" : "#000000", // ✅ X-axis text color adapts
              },
            },
            y: {
              ticks: {
                color: darkMode ? "#FFFFFF" : "#000000", // ✅ Y-axis text color adapts
              },
            },
          },
        }}
      />
    </Container>
  );
};

export default Dashboard;
