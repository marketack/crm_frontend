import axios from "axios";
import API_BASE_URL from "./apiConfig";

const COMPANY_API_URL = `${API_BASE_URL}/company`;

/**
 * ✅ Axios Instance with Token Handling
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Attach Token Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  }
  return config;
});

/**
 * ✅ Define TypeScript Interfaces
 */
// ✅ Define Company Interface (Ensure it matches API response)
export interface Company {
  _id: string;
  name: string;
  industry: string;
  email: string;
  phone: string;
  aboutUs: string;
  website?: string;
  address?: string;
  createdBy: string;
  updatedBy: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  createdAt?: string;
  updatedAt?: string;
}



export interface AddStaffRequest {
  companyId: string;
  userId: string;
}

/**
 * ✅ Error Response Type (Ensures consistent API error handling)
 */
interface ErrorResponse {
  success: boolean;
  message: string;
  error?: any;
}

/**
 * ✅ API Functions
 */

// 🔵 Create a New Company
export const createCompany = async (
  data: Omit<Company, "_id" | "createdAt" | "updatedAt">
): Promise<Company | ErrorResponse> => {
  try {
    console.log(`🟢 Creating Company: ${COMPANY_API_URL}`);
    const response = await api.post<Company>(`${COMPANY_API_URL}`, data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error creating company:", error.response?.data?.message || error);
    return { success: false, message: error.response?.data?.message || "Failed to create company", error };
  }
};

// 🔵 Fetch All Companies
export const getAllCompanies = async (): Promise<{ success: boolean; companies: Company[] }> => {
  try {
    console.log(`🔵 Fetching Companies from ${COMPANY_API_URL}`);

    const response = await api.get<{ success: boolean; companies: Company[] }>(`${COMPANY_API_URL}`);

    console.log("✅ Received Companies:", response.data); // Debugging response

    return response.data; // ✅ Ensure correct structure
  } catch (error) {
    console.error("❌ Error fetching companies:", error);
    return { success: false, companies: [] }; // ✅ Return empty array on error
  }
};


// 🟡 Add Staff to a Company
export const addStaffToCompany = async (data: AddStaffRequest): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(`🟡 Adding Staff to Company: ${COMPANY_API_URL}/add-staff`);
    await api.post(`${COMPANY_API_URL}/add-staff`, data);
    return { success: true, message: "Staff added successfully" };
  } catch (error: any) {
    console.error("❌ Error adding staff to company:", error.response?.data?.message || error);
    return { success: false, message: "Failed to add staff" };
  }
};

// 🟠 Update a Company
export const updateCompany = async (
  companyId: string,
  data: Partial<Company>
): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(`🟠 Updating Company: ${COMPANY_API_URL}/${companyId}`);
    await api.put(`${COMPANY_API_URL}/${companyId}`, data);
    return { success: true, message: "Company updated successfully" };
  } catch (error: any) {
    console.error("❌ Error updating company:", error.response?.data?.message || error);
    return { success: false, message: "Failed to update company" };
  }
};

// ❌ Delete a Company
export const deleteCompany = async (companyId: string): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(`❌ Deleting Company: ${COMPANY_API_URL}/${companyId}`);
    await api.delete(`${COMPANY_API_URL}/${companyId}`);
    return { success: true, message: "Company deleted successfully" };
  } catch (error: any) {
    console.error("❌ Error deleting company:", error.response?.data?.message || error);
    return { success: false, message: "Failed to delete company" };
  }
};

export default {
  createCompany,
  getAllCompanies,
  addStaffToCompany,
  updateCompany,
  deleteCompany,
};
