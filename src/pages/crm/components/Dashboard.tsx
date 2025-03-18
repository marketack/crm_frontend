import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, CircularProgress } from "@mui/material";
import { getDashboardStats } from "../../../api/dashboardService";
import { useAppSelector } from "../../../redux/store";
import CalendarComponent from "./Calendar";
import RecentActivities from "./RecentActivities";
import EmployeePerformanceChart from "./EmployeePerformanceChart";
import RevenueChart from "./RevenueChart";
import LeadConversionChart from "./LeadConversionChart";

// Define the type for the dashboard data
interface DashboardStats {
  stats: {
    totalEmployees: number;
    totalProjects: number;
    totalDeals: number;
    totalInvoices: number;
    totalTasks: number;
    totalLeads?: number; // Optional
    leadConversionRate?: string; // Optional
    revenue?: number; // Optional
    pendingInvoices?: number; // Optional
    overdueInvoices?: number; // Optional
  };
  performance?: {
    topEmployees: any[]; // Adjust the type as needed
  };
  upcoming: {
    tasks: any[];
    invoices: any[];
    projects: any[];
  };
  activityLogs?: any[]; // Optional
  employees?: any[]; // Optional
}

const Dashboard: React.FC = () => {
  const token = useAppSelector((state) => state.auth.token);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardStats>({
    stats: {
      totalEmployees: 0,
      totalProjects: 0,
      totalDeals: 0,
      totalInvoices: 0,
      totalTasks: 0,
      totalLeads: 0,
      leadConversionRate: "0%",
      revenue: 0,
      pendingInvoices: 0,
      overdueInvoices: 0,
    },
    upcoming: {
      tasks: [],
      invoices: [],
      projects: [],
    },
    performance: { topEmployees: [] },
    activityLogs: [],
    employees: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state
    
        const data = await getDashboardStats(token);
        if (!data || !data.stats) {
          throw new Error("Invalid dashboard data received.");
        }
    
        setDashboardData({
          stats: {
            totalEmployees: data.stats.totalEmployees || 0,
            totalProjects: data.stats.totalProjects || 0,
            totalDeals: data.stats.totalDeals || 0,
            totalInvoices: data.stats.totalInvoices || 0,
            totalTasks: data.stats.totalTasks || 0,
            totalLeads: data.stats.totalLeads || 0,
            leadConversionRate: data.stats.leadConversionRate || "0%",
            revenue: data.stats.revenue || 0,
            pendingInvoices: data.stats.pendingInvoices || 0,
            overdueInvoices: data.stats.overdueInvoices || 0,
          },
          upcoming: {
            tasks: data.upcoming?.tasks || [],
            invoices: data.upcoming?.invoices || [],
            projects: data.upcoming?.projects || [],
          },
          performance: data.performance || { topEmployees: [] },
          activityLogs: data.activityLogs || [],
          employees: data.employees || [],
        });
    
      } catch (err) {
        console.error("❌ Error loading dashboard:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        CRM Dashboard
      </Typography>

      {/* Dashboard Stats */}
      <Grid container spacing={3}>
        {Object.entries(dashboardData.stats).map(([key, value]) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
              <Typography variant="h6">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Typography>
              <Typography variant="h4">{value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Employee Performance
            </Typography>
            <EmployeePerformanceChart data={dashboardData.performance?.topEmployees || []} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Revenue Insights
            </Typography>
            <RevenueChart revenue={dashboardData.stats.revenue || 0} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Lead Conversion Rate
            </Typography>
            <LeadConversionChart conversionRate={dashboardData.stats.leadConversionRate || "0%"} />
          </Paper>
        </Grid>
      </Grid>

      {/* Calendar for Due Dates */}
      <Box mt={4}>
        <Typography variant="h5">Upcoming Deadlines</Typography>
        <CalendarComponent 
          tasks={dashboardData.upcoming.tasks} 
          invoices={dashboardData.upcoming.invoices} 
          projects={dashboardData.upcoming.projects} 
        />
      </Box>

      {/* Recent Activities */}
      <Box mt={4}>
        <Typography variant="h5">Recent Activities</Typography>
        <RecentActivities activities={dashboardData.activityLogs || []} />
      </Box>
    </Box>
  );
};

export default Dashboard;