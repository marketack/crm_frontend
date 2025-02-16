import API from "./api";
import { toast } from "react-toastify";

// ✅ Get All Customers
export const getCustomers = async () => {
  try {
    const response = await API.get("/customers");
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch customers.");
    throw error;
  }
};

// Create a New Customer
export const createCustomer = async (customerData) => {
  const response = await API.post("/customers", customerData);
  return response.data;
};

// Update Customer
export const updateCustomer = async (customerId, customerData) => {
  const response = await API.put(`/customers/${customerId}`, customerData);
  return response.data;
};

// Delete Customer
export const deleteCustomer = async (customerId) => {
  const response = await API.delete(`/customers/${customerId}`);
  return response.data;
};
