import apiBase from "./apiBase"; // ✅ Use centralized API base

const COMPANY_API_URL = "/company";

/**
 * ✅ Define TypeScript Interfaces
 */
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

export interface Department {
  _id: string;
  name: string;
  employees: string[];
  budget?: number;
  objectives?: string[];
}

export interface AddStaffRequest {
  companyId: string;
  userId: string;
}
interface ErrorResponse {
  success: false; // ✅ Explicitly mark as `false`
  message: string;
  error?: any;
}


/**
 * ✅ Get the authenticated user and token
 */
const getAuthHeaders = () => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  let user: any = null;
  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("⚠️ Error parsing user data from localStorage:", error);
    return { headers: {}, userId: null };
  }

  if (!user || !user.id) {
    console.error("❌ User authentication error: No valid user ID found.");
    return { headers: {}, userId: null };
  }

  const headers = storedToken ? { Authorization: `Bearer ${storedToken}` } : {};
  return { headers, userId: user.id };
};

/**
 * ✅ Helper Function for API Requests
 */
const sendRequest = async <T>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any
): Promise<T | ErrorResponse> => {
  try {
    const { headers, userId } = getAuthHeaders();

    if (!userId) {
      return { success: false, message: "User authentication error. Please log in again." };
    }

    const response = await apiBase({ method, url, data, headers });

    return response.data;
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "API request failed", error };
  }
};

// 🔵 Create a New Company with User ID
export const createCompany = async (data: Omit<Company, "_id" | "createdAt" | "updatedAt">): Promise<Company | ErrorResponse> => {
  try {
    const { headers, userId } = getAuthHeaders();

    if (!userId) {
      console.error("❌ User authentication error: No valid user ID found.");
      return { success: false, message: "User authentication error. Please log in again." };
    }

    const requestData = {
      ...data,
      createdBy: userId,
      updatedBy: userId,
      contactUs: {
        phone: data.phone,
        email: data.email,
      },
    };

    console.log("📡 Sending Create Company Request:", requestData);

    const response = await apiBase.post<Company>(COMPANY_API_URL, requestData, { headers });

    console.log("✅ Company Created Successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error creating company:", error.response?.data || error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create company",
      error: error.response?.data || error,
    };
  }
};


// 🔵 Get All Companies
export const getAllCompanies = async (): Promise<Company | ErrorResponse> => {
  try {
    const { data } = await apiBase.get<{ success: boolean; company?: Company }>("/company");

    console.log("✅ API Response:", data);

    if (data.success && data.company) {
      return data.company; // ✅ Return the company object directly
    } else {
      return { success: false, message: "Unexpected API response format" };
    }
  } catch (error: any) {
    console.error("❌ API Error:", error.response?.data || error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch company", error };
  }
};

// 🔵 Delete Company
export const deleteCompany = async (companyId: string): Promise<{ success: boolean; message: string } | ErrorResponse> =>
  sendRequest("delete", `${COMPANY_API_URL}/${companyId}`);

// 🔵 Update Company Details
export const updateCompany = async (
  companyId: string,
  data: Partial<Company>
): Promise<Company | ErrorResponse> => sendRequest("put", `${COMPANY_API_URL}/${companyId}`, data);

// 🔵 Get All Departments for a Company
export const getCompanyDepartments = async (companyId: string): Promise<Department[] | ErrorResponse> => {
  try {
    console.log(`📡 Sending API Request: GET /company/${companyId}/departments`);

    const response = await sendRequest<{ success: boolean; departments?: Department[] }>(
      "get",
      `${COMPANY_API_URL}/${companyId}/departments`
    );

    console.log("✅ API Response:", response);

    if ("success" in response && response.success) {
      return response.departments ?? []; // ✅ Return empty array if `departments` is missing
    } else {
      console.error("❌ Unexpected API Response Format:", response);
      return { success: false, message: "Unexpected API response format", error: response };
    }
  } catch (error: any) {
    console.error("❌ API Error:", error.response?.data || error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch departments", error };
  }
};


// 🔵 Add a New Department to a Company
export const addDepartmentToCompany = async (
  companyId: string,
  data: Omit<Department, "_id">
): Promise<Department | ErrorResponse> => sendRequest("post", `${COMPANY_API_URL}/${companyId}/departments`, data);

// 🔵 Update Department Details
export const updateDepartment = async (
  companyId: string,
  departmentId: string,
  data: Partial<Department>
): Promise<Department | ErrorResponse> => sendRequest("put", `${COMPANY_API_URL}/${companyId}/departments/${departmentId}`, data);

// 🔵 Delete Department
export const deleteDepartment = async (
  companyId: string,
  departmentId: string
): Promise<{ success: boolean; message: string } | ErrorResponse> => sendRequest("delete", `${COMPANY_API_URL}/${companyId}/departments/${departmentId}`);

/**
 * ✅ Export all functions
 */
export default {
  createCompany,
  getAllCompanies,
  updateCompany,
  deleteCompany,
  getCompanyDepartments,
  addDepartmentToCompany,
  updateDepartment,
  deleteDepartment,
};
