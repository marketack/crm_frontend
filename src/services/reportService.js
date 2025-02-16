import API from "./api";

// Get All Reports
export const getAllReports = async () => {
  const response = await API.get("/reports");
  return response.data;
};

// Generate Report
export const generateReport = async (reportData) => {
  const response = await API.post("/reports", reportData);
  return response.data;
};
