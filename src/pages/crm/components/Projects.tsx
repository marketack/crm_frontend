import React, { useEffect, useState } from "react";
import { Box, Button, Snackbar, Alert, AlertColor } from "@mui/material";
import { getProjects, createProject, updateProject, deleteProject, Project ,TeamMember} from "../../../api/projectService";
import ReusableTable from "../../../components/ReusableTable";
import ReusableModal from "../../../components/ReusableModal";
import { Edit, Delete, Add } from "@mui/icons-material";
import { getEmployees } from "../../../api/employeeService";

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [employees, setEmployees] = useState<{ label: string; value: string }[]>([]);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false,
    message: "",
    severity: "info",
  });

  const [formData, setFormData] = useState<Partial<Project>>({
    name: "",
    description: "",
    budget: 0,
    deadline: "",
    status: "planned",
    priority: "medium",
    teamMembers: [] as TeamMember[], // Use the TeamMember type
    milestones: [],
    dependencies: [],
  });
  
  useEffect(() => {
    fetchProjects();
    fetchEmployees();

  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  const fetchEmployees = async () => {
    try {
      const data = await getEmployees(); // Fetch employees from API
      if (Array.isArray(data)) {
        setEmployees(data.map((emp) => ({ label: emp.name, value: emp._id })));
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleDelete = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      setProjects(projects.filter((project) => project._id !== projectId));
      setSnackbar({ open: true, message: "Project deleted successfully!", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to delete project", severity: "error" });
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Step 1: Basic Info
        return !!formData.name?.trim() && !!formData.description?.trim() && formData.budget! >= 0;
      case 1: // Step 2: Team & Milestones
        return Array.isArray(formData.teamMembers) && formData.teamMembers.length > 0;
      case 2: // Step 3: Dependencies & Summary
        return true;
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

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      ...project,
      teamMembers: project.teamMembers, // Keep as TeamMember[]
      milestones: project.milestones, // Keep as Milestone[]
      dependencies: project.dependencies, // Keep as string[]
    });
    setOpenModal(true);
    setActiveStep(0);
  };
  
  const handleAddNew = () => {
    setSelectedProject(null);
    setFormData({
      name: "",
      description: "",
      budget: 0,
      deadline: "",
      status: "planned",
      priority: "medium",
      teamMembers: [],
      milestones: [],
      dependencies: [],
    });
    setActiveStep(0);
    setOpenModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    if (name === "teamMembers") {
      // Convert selected employee IDs to TeamMember objects
      const selectedEmployeeIds = value.split(",").map((id) => id.trim());
      const selectedEmployees = selectedEmployeeIds.map((id) => {
        const employee = employees.find(emp => emp.value === id); // Find corresponding employee
        return {
          user: id,
          name: employee ? employee.label : "Unknown", // Ensure name is included
          role: "member", // Default role
        };
      });

      setFormData({
        ...formData,
        [name]: selectedEmployees,
      });
    } else if (name === "milestones" || name === "dependencies") {
      // Convert comma-separated string to array
      const arrayValue = value.split(",").map((item) => item.trim());
  
      if (name === "milestones") {
        setFormData({
          ...formData,
          [name]: arrayValue.map((title) => ({
            title,
            description: "",
            dueDate: new Date().toISOString(),
            completed: false,
            progress: 0,
          })),
        });
      } else {
        setFormData({ ...formData, [name]: arrayValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
};

  const handleSave = async () => {
    try {
      const formattedData: Omit<Project, "_id"> = {
        name: formData.name || "", // Ensure required fields are not undefined
        description: formData.description || "",
        budget: formData.budget || 0,
        deadline: formData.deadline || new Date().toISOString(),
        status: formData.status || "planned",
        priority: formData.priority || "medium",
        teamMembers: Array.isArray(formData.teamMembers)
          ? formData.teamMembers
          : [],
        milestones: Array.isArray(formData.milestones)
          ? formData.milestones
          : [],
        dependencies: Array.isArray(formData.dependencies)
          ? formData.dependencies
          : [],
        expenses: [], // Add empty array for expenses
        attachments: [], // Add empty array for attachments
        createdBy: formData.createdBy || "system", // Ensure a valid user ID
      };
  
      if (selectedProject) {
        await updateProject(selectedProject._id, formattedData);
      } else {
        await createProject(formattedData);
      }
  
      fetchProjects();
      setOpenModal(false);
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!e.target || !e.target.selectedOptions) return; // ✅ Prevents null error
  
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
  
    const selectedEmployees = selectedOptions.map((id) => {
      const employee = employees.find((emp) => emp.value === id);
      return {
        user: id,
        name: employee ? employee.label : "Unknown",
        role: "member",
      };
    });
  
    setFormData((prev) => ({
      ...prev,
      teamMembers: selectedEmployees, // ✅ Ensure correct type
    }));
  };
  
  
  const handleMilestoneSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!e.target) return;
  
    const selectedValue = e.target.value; // Only one milestone should be selected
  
    setFormData((prev) => ({
      ...prev,
      milestones: [
        {
          title: selectedValue,
          description: "", // Default empty description
          dueDate: new Date().toISOString(),
          completed: false,
          progress: 0,
        },
      ],
    }));
  };
  
  
  
  
  return (
    <Box sx={{ padding: 3 }}>
      <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddNew} sx={{ marginBottom: 2 }}>
        Add New Project
      </Button>

      {/* Reusable Table for Projects */}
      <ReusableTable
        title="Project Management"
        columns={[
          { id: "name", label: "Name", sortable: true },
          { id: "description", label: "Description", sortable: true },
          { id: "budget", label: "Budget ($)", sortable: true },
          { id: "status", label: "Status", sortable: true },
        ]}
        data={projects}
        setData={setProjects}
        actions={[
          { icon: <Edit />, tooltip: "Edit Project", onClick: (row) => handleEdit(row) },
          { icon: <Delete />, tooltip: "Delete Project", onClick: (row) => handleDelete(row._id) },
        ]}
        selectable={true}
        searchPlaceholder="Search Projects..."
      />
<ReusableModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  title={selectedProject ? "Edit Project" : "New Project"}
  steps={["Basic Info", "Team & Milestones", "Dependencies & Summary"]}
  activeStep={activeStep}
  handleNext={handleNext}
  handleBack={handleBack}
  fields={[
    ...(activeStep === 0
      ? [
          { label: "Name", name: "name", type: "text" as const, value: formData.name || "", onChange: handleChange, required: true },
          { label: "Description", name: "description", type: "text" as const, value: formData.description || "", onChange: handleChange, required: true },
          { label: "Budget", name: "budget", type: "number" as const, value: formData.budget || 0, onChange: handleChange, required: true },
        ]
      : []),
    ...(activeStep === 1
      ? [
          {
            label: "Team Members",
            name: "teamMembers",
            type: "select" as const,
            options: employees, // Fetch employees from API
            value: formData.teamMembers.map((tm) => tm.user), // Store IDs
            onChange: handleSelectChange,
            multiple: true, // Enable multi-selection
          },
          {
            label: "Milestones",
            name: "milestones",
            type: "select" as const,
            options: [
              { label: "Planning Phase", value: "Planning Phase" },
              { label: "Development Phase", value: "Development Phase" },
              { label: "Testing Phase", value: "Testing Phase" },
              { label: "Deployment Phase", value: "Deployment Phase" },
            ],
            value: formData.milestones.length > 0 ? formData.milestones[0].title : "",
            onChange: handleMilestoneSelect,
            multiple: false, // Single selection
          },
        ]
      : []),
    ...(activeStep === 2
      ? [
          { label: "Dependencies", name: "dependencies", type: "text" as const, value: formData.dependencies.join(", "), onChange: handleChange },
        ]
      : []),
  ]}
  actions={[
    activeStep > 0 && { label: "Back", onClick: handleBack, color: "secondary" },
    activeStep < 2 && { label: "Next", onClick: handleNext, color: "primary" },
    activeStep === 2 && { label: selectedProject ? "Update Project" : "Create Project", onClick: handleSave, color: "primary" },
  ]}
/>



      {/* Snackbar Notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Projects;
