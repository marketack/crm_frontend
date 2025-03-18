import React, { useEffect, useState } from "react";
import { Box, Button, Snackbar, Alert, AlertColor } from "@mui/material"; // Import AlertColor
import { getDeals, createDeal, updateDeal, deleteDeal, Deal } from "../../../api/dealService";
import ReusableTable from "../../../components/ReusableTable";
import ReusableModal from "../../../components/ReusableModal";
import { Edit, Delete, Add } from "@mui/icons-material";
import { getEmployees } from "../../../api/employeeService";

const Deals: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [employees, setEmployees] = useState<{ _id: string; name: string }[]>([]);

  // Update the type of severity to AlertColor
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false,
    message: "",
    severity: "info", // Default to "info"
  });

  const [formData, setFormData] = useState<Partial<Deal>>({
    title: "",
    customer: "",
    amount: 0,
    status: "open",
    stage: "",
    probability: 50,
    notes: "",
    assignedTo:"",
  });

  useEffect(() => {
    fetchDeals();
    fetchEmployees();
  }, []);

  const fetchDeals = async () => {
    try {
      const data = await getDeals();
      setDeals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading deals:", error);
    }
  };

   const fetchEmployees = async () => {
      try {
        const employeeData = await getEmployees();
        if (Array.isArray(employeeData)) {
          setEmployees(employeeData);
        } else {
          console.error("Error fetching employees:", employeeData);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

  const handleDelete = async (dealId: string) => {
    try {
      await deleteDeal(dealId);
      setDeals(deals.filter((deal) => deal._id !== dealId));
      setSnackbar({ open: true, message: "Deal deleted successfully!", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to delete deal", severity: "error" });
    }
  };
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Validate Step 1: Basic Info
        return (
          !!formData.title?.trim() && // Title is required
          !!formData.customer?.trim() && // Customer is required
          (formData.amount !== undefined && formData.amount >= 0) // Amount must be a non-negative number
        );
      case 1: // Validate Step 2: Deal Status & Stage
        return (
          !!formData.status?.trim() && // Status is required
          !!formData.stage?.trim() && // Stage is required
          (formData.probability !== undefined && formData.probability >= 0 && formData.probability <= 100) // Probability must be between 0 and 100
        );
      case 2: // Validate Step 3: Additional Notes
        return true; // Notes are optional, so no validation needed
      default:
        return false;
    }
  };
  
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    } else {
      setSnackbar({ open: true, message: "Please fill out all required fields correctly.", severity: "error" });
    }
  };
  const handleEdit = (deal: Deal) => {
    setSelectedDeal(deal);
    setFormData(deal);
    setOpenModal(true);
    setActiveStep(0);
  };
 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddNew = () => {
    setSelectedDeal(null);
    setFormData({ title: "", customer: "", amount: 0, status: "open", stage: "", probability: 50, notes: "" });
    setOpenModal(true);
    setActiveStep(0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // ✅ Validate required fields
    if (!formData.title || !formData.amount || !formData.stage || !formData.customer || !formData.assignedTo) {
      setSnackbar({ open: true, message: "Missing required fields", severity: "error" });
      return;
    }
  
    // ✅ Ensure customer and assignedTo are valid ObjectId strings
    if (!/^[0-9a-fA-F]{24}$/.test(formData.customer)) {
      setSnackbar({ open: true, message: "Invalid customer ID format", severity: "error" });
      return;
    }
    
    if (!/^[0-9a-fA-F]{24}$/.test(formData.assignedTo)) {
      setSnackbar({ open: true, message: "Invalid assignedTo ID format", severity: "error" });
      return;
    }
  
    try {
      if (selectedDeal) {
        await updateDeal(selectedDeal._id, formData);
        setSnackbar({ open: true, message: "Deal updated successfully!", severity: "success" });
      } else {
        await createDeal(formData as Deal);
        setSnackbar({ open: true, message: "Deal created successfully!", severity: "success" });
      }
  
      setOpenModal(false);
      setSelectedDeal(null);
      fetchDeals();
    } catch (error) {
      console.error("Failed to save deal:", error);
      setSnackbar({ open: true, message: "Failed to save deal", severity: "error" });
    }
  };
  
  return (
    <Box sx={{ padding: 3 }}>
      <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddNew} sx={{ marginBottom: 2 }}>
        Add New Deal
      </Button>

      {/* Reusable Table for Deals */}
      <ReusableTable
        title="Deals Management"
        columns={[
          { id: "title", label: "Title", sortable: true },
          { id: "customer", label: "Customer", sortable: true },
          { id: "amount", label: "Amount ($)", sortable: true },
          { id: "status", label: "Status", sortable: true },
          { id: "stage", label: "Stage", sortable: true },
          { id: "probability", label: "Probability (%)", sortable: true },
          { id: "notes", label: "Notes", sortable: false },
        ]}
        data={deals}
        setData={setDeals}
        actions={[
          { icon: <Edit />, tooltip: "Edit Deal", onClick: (row) => handleEdit(row) },
          { icon: <Delete />, tooltip: "Delete Deal", onClick: (row) => handleDelete(row._id) },
        ]}
        selectable={true}
        searchPlaceholder="Search Deals..."
      />

      {/* Reusable Modal for Adding/Editing Deals */}
      <ReusableModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  title={selectedDeal ? "Edit Deal" : "New Deal"}
  steps={["Basic Info", "Deal Status & Stage", "Additional Notes"]}
  activeStep={activeStep}
  handleNext={handleNext} // Updated handleNext function
  handleBack={() => setActiveStep((prev) => prev - 1)}
  fields={[
    ...(activeStep === 0
      ? [
          { label: "Title", name: "title", type: "text" as const, value: formData.title, onChange: handleChange, required: true },
          { label: "Customer", name: "customer", type: "text" as const, value: formData.customer, onChange: handleChange, required: true },
          { label: "Amount ($)", name: "amount", type: "number" as const, value: formData.amount, onChange: handleChange, required: true },
        ]
      : []),
    ...(activeStep === 1
      ? [
          {
            label: "Status",
            name: "status",
            type: "select" as const,
            value: formData.status,
            onChange: handleChange,
            options: [
              { label: "Open", value: "open" },
              { label: "Negotiation", value: "negotiation" },
              { label: "Closed Won", value: "closed_won" },
              { label: "Closed Lost", value: "closed_lost" },
            ],
            required: true,
          },
          { label: "Stage", name: "stage", type: "text" as const, value: formData.stage, onChange: handleChange, required: true },
          { label: "Probability (%)", name: "probability", type: "number" as const, value: formData.probability, onChange: handleChange, required: true },
        ]
      : []),
    ...(activeStep === 2
      ? [{ label: "Notes", name: "notes", type: "text" as const, value: formData.notes, onChange: handleChange },
        { 
          label: "Assigned To", 
          name: "assignedTo", 
          type: "select" as const, 
          value: formData.assignedTo || "", 
          onChange: handleInputChange, 
          options: [{ label: "Unassigned", value: "" }, ...employees.map(emp => ({ label: emp.name, value: emp._id }))]
        },
      ]

      : []),
  ]}
  actions={[
    activeStep > 0 && { label: "Back", onClick: () => setActiveStep((prev) => prev - 1), color: "secondary" },
    activeStep < 2 && {
      label: "Next",
      onClick: handleNext,
      color: "primary",
      disabled: !validateStep(activeStep), // Disable Next button if validation fails
    },
    activeStep === 2 && { label: selectedDeal ? "Update Deal" : "Create Deal", onClick: handleSubmit, color: "primary" },
  ]}
/>

      {/* Snackbar for Notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Deals;