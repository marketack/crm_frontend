import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, CardActionArea } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; // Ensure correct API import
import Chart from "chart.js/auto";

const Dashboard = () => {
  const [data, setData] = useState({ leads: 0, customers: 0, tasks: 0 });
  const navigate = useNavigate();

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
      <Typography variant="h4" sx={{ marginBottom: 3, textAlign: "center" }}>
        Dashboard Overview
      </Typography>
      
      {/* Clickable Cards */}
      <Grid container spacing={3}>
        {[
          { label: "Leads", value: data.leads, route: "/leads" },
          { label: "Customers", value: data.customers, route: "/customers" },
          { label: "Tasks", value: data.tasks, route: "/tasks" }
        ].map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card sx={{ cursor: "pointer", backgroundColor: "#f5f5f5" }}>
              <CardActionArea onClick={() => handleCardClick(item.route)}>
                <CardContent>
                  <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold" }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h4" sx={{ textAlign: "center", color: "#3f51b5" }}>
                    {item.value}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bar Chart */}
      <Typography variant="h5" sx={{ marginTop: 4, textAlign: "center" }}>
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
        }}
      />
    </Container>
  );
};

export default Dashboard;
