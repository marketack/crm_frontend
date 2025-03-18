import apiClient from "./apiClient";

// ✅ Define Invoice Type (Matches Backend)
export interface Invoice {
  _id: string;
  invoiceNumber: string;
  customer: string;
  items: {
    description: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  taxes?: { name: string; rate: number; amount: number }[];
  discount?: { type: "percentage" | "fixed"; value: number };
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  dueDate: string;
  status: "pending" | "paid" | "overdue" | "partially_paid";
  currency: "USD" | "EUR" | "GBP" | "AED" | "JOD";
  payments: { date: string; amount: number; method: string; transactionId?: string }[];
  notes?: string;
  terms?: string;
  createdBy: string;
}

/** ✅ Get All Invoices */
export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const response = await apiClient.get<Invoice[]>("/invoices");
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
};

/** ✅ Create an Invoice */
export const createInvoice = async (invoiceData: Omit<Invoice, "_id">) => {
  try {
    const response = await apiClient.post("/invoices", invoiceData);
    return response.data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

/** ✅ Update an Invoice */
export const updateInvoice = async (invoiceId: string, updatedData: Partial<Invoice>) => {
  try {
    const response = await apiClient.patch(`/invoices/${invoiceId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

/** ✅ Record a Payment for an Invoice */
export const recordPayment = async (
  invoiceId: string,
  paymentData: { amountPaid: number; paymentMethod: string; transactionId?: string }
) => {
  try {
    const response = await apiClient.post(`/invoices/${invoiceId}/pay`, paymentData);
    return response.data;
  } catch (error) {
    console.error("Error recording payment:", error);
    throw error;
  }
};

/** ✅ Delete an Invoice */
export const deleteInvoice = async (invoiceId: string) => {
  try {
    const response = await apiClient.delete(`/invoices/${invoiceId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};
