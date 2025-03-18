import axios from "axios";
import API_BASE_URL from "./apiConfig";
import apiClient from "./apiClient";

// ✅ Define API Response Type
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


/** ✅ Fetch Dashboard Stats */
export const getDashboardStats = async (token: string) => {
  try {
    const response = await apiClient.get<DashboardStats>("/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("🚀 API Response:", response.data); // Debugging API response

    return response.data;
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    throw error;
  }
};
