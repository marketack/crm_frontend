import React, { useEffect, useState } from "react";
import { getLeads, deleteLead, createLead, updateLead ,convertLeadToCustomer} from "../../../api/leadService";
import ReusableTable from "../../../components/ReusableTable";
import ReusableModal from "../../../components/ReusableModal";
import { Edit, Delete, Add } from "@mui/icons-material";
import { Lead } from "../../../api/leadService";
import { getEmployees } from "../../../api/employeeService";
import {
  Button,
  Box,
} from "@mui/material";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";

// ✅ Define LeadWithPriority with optional priority
type LeadWithPriority = Lead & { 
  priority: string | undefined; 
  assignedTo?: string | { _id: string; name: string; email: string };
};

// ✅ Status & Source Options
const statusOptions: Lead["status"][] = ["new", "contacted", "proposal_sent", "closed_won", "closed_lost", "in_progress"];
const sourceOptions: Lead["source"][] = ["Other", "LinkedIn", "Google Ads", "Referral", "Cold Call"];
const priorityOptions = ["High", "Medium", "Low"];
const languageOptions = ["English", "Spanish", "French", "German", "Chinese"]; // ✅ Added missing languageOptions

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<LeadWithPriority[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadWithPriority | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [employees, setEmployees] = useState<{ _id: string; name: string }[]>([]);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false,
    message: "",
    severity: "info", // ✅ Fix: "info" is now correctly typed as AlertColor
  });
  
  const [formData, setFormData] = useState<Partial<LeadWithPriority>>({
    name: "",
    email: "",
    phone: "",
    source: "Other",
    assignedTo: "",
    status: "new",
    priority: "Medium",
    leadValue: 0,
    defaultLanguage: "English",
    tags: [],
    engagementScore: 50,
    leadScore: 50,
  });

  useEffect(() => {
    fetchLeads();
    fetchEmployees();
  }, []);

  const fetchLeads = async () => {
    try {
      const leadData = await getLeads();
      const leadsWithPriority = leadData.map((lead) => ({
        ...lead,
        priority: lead.priority || "Medium",
      }));
      setLeads(leadsWithPriority);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
  const handleConvertToCustomer = async (leadId: string) => {
    try {
      await convertLeadToCustomer(leadId);
      setSnackbar({ open: true, message: "Lead converted to customer!", severity: "success" });
      fetchLeads(); // ✅ Refresh leads after conversion
    } catch (error) {
      console.error("Error converting lead:", error);
      setSnackbar({ open: true, message: "Failed to convert lead", severity: "error" });
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

  const handleDelete = async (leadId: string) => {
    await deleteLead(leadId);
    fetchLeads();
  };

  const handleEdit = (lead: LeadWithPriority) => {
    setSelectedLead(lead);
    setFormData({
      ...lead,
      assignedTo: typeof lead.assignedTo === "object" ? lead.assignedTo._id : lead.assignedTo,
    });
    setOpenModal(true);
    setActiveStep(0);
  };

  const handleAddNew = () => {
    setSelectedLead(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      source: "Other",
      assignedTo: "",
      status: "new",
      priority: "Medium",
      leadValue: 0,
      defaultLanguage: "English",
      tags: [],
      engagementScore: 50,
      leadScore: 50,
    });
    setOpenModal(true);
    setActiveStep(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSave = async () => {
    if (selectedLead) {
      await updateLead(selectedLead._id, formData);
    } else {
      await createLead(formData as LeadWithPriority);
    }
    fetchLeads();
    setOpenModal(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddNew}>
          Add New Lead
        </Button>
      </Box>

      {/* ✅ Use Reusable Table */}
      <ReusableTable
  title="Leads Management"
  columns={[
    { id: "name", label: "Name", sortable: true },
    { id: "email", label: "Email", sortable: true },
    { id: "phone", label: "Phone", sortable: true },
    { id: "priority", label: "Priority", sortable: true },
    { id: "leadValue", label: "Lead Value", sortable: true },
    { id: "source", label: "Source", sortable: true },
    { 
      id: "assignedTo", 
      label: "Assigned To", 
      sortable: true, 
      render: (row) => typeof row.assignedTo === "object" ? row.assignedTo.name : "Unassigned" 
    },
    { id: "status", label: "Status", sortable: true },
  ]}
  data={leads}
  setData={setLeads} // ✅ FIXED: Pass setData
  actions={[
    { icon: <Edit />, tooltip: "Edit Lead", onClick: (row) => handleEdit(row) },
    { icon: <Delete />, tooltip: "Delete Lead", onClick: (row) => handleDelete(row._id) },
    { icon: <PersonAdd />, tooltip: "Convert to Customer", onClick: (row) => handleConvertToCustomer(row._id) }
  ]}

  selectable={true}
  searchPlaceholder="Search Leads..."
/>


      {/* ✅ Use Reusable Modal */}
      <ReusableModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  title={selectedLead ? "Edit Lead" : "New Lead"}
  steps={["Basic Info", "Contact Details", "Lead Status", "Scoring & Tags"]}
  activeStep={activeStep}
  handleNext={handleNext}
  handleBack={handleBack}
  fields={[
    ...(activeStep === 0
      ? [
          { label: "Name", name: "name", type: "text" as const, value: formData.name || "", onChange: handleInputChange, required: true },
          { label: "Email", name: "email", type: "email" as const, value: formData.email || "", onChange: handleInputChange, required: true },
          { label: "Phone", name: "phone", type: "text" as const, value: formData.phone || "", onChange: handleInputChange },
        ]
      : []),
    ...(activeStep === 1
      ? [
          { 
            label: "Source", 
            name: "source", 
            type: "select" as const, 
            value: formData.source || "Other", 
            onChange: handleInputChange, 
            options: sourceOptions.map(opt => ({ label: opt, value: opt }))
          },
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
    ...(activeStep === 2
      ? [
          { 
            label: "Status", 
            name: "status", 
            type: "select" as const, 
            value: formData.status || "new", 
            onChange: handleInputChange, 
            options: statusOptions.map(opt => ({ label: opt, value: opt }))
          },
          { 
            label: "Priority", 
            name: "priority", 
            type: "select" as const, 
            value: formData.priority || "Medium", 
            onChange: handleInputChange, 
            options: priorityOptions.map(opt => ({ label: opt, value: opt }))
          },
          { 
            label: "Lead Value", 
            name: "leadValue", 
            type: "number" as const, 
            value: formData.leadValue || 0, 
            onChange: handleInputChange 
          },
        ]
      : []),
    ...(activeStep === 3
      ? [
     
       
          { 
            label: "Engagement Score", 
            name: "engagementScore", 
            type: "number" as const, 
            value: formData.engagementScore || 50, 
            onChange: handleInputChange 
          },
          { 
            label: "Lead Score", 
            name: "leadScore", 
            type: "number" as const, 
            value: formData.leadScore || 50, 
            onChange: handleInputChange 
          },
        ]
      : []),
  ]}
  actions={[
    activeStep > 0 && { label: "Back", onClick: handleBack, color: "secondary" },
    activeStep < 3 && { label: "Next", onClick: handleNext, color: "primary" },
    activeStep === 3 && { label: selectedLead ? "Update Lead" : "Create Lead", onClick: handleSave, color: "primary" },

  ]}
/>
<Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
  <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
    {snackbar.message}
  </Alert>
</Snackbar>


    </Box>
  );
};

export default Leads;
