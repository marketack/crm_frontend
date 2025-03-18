import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import cmsService, { Service } from "../../../../api/cmsService";
import { useAppSelector } from "../../../../redux/store";

interface ServicesProps {
  readOnly?: boolean; // ✅ Controls whether editing is enabled
}

const Services: React.FC<ServicesProps> = ({ readOnly = true }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [newService, setNewService] = useState<Service>({ title: "", description: "", price: 0, features: [] });
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await cmsService.getServices();
      setServices(response.services);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleAddOrUpdateService = async () => {
    try {
      if (!token) {
        console.error("Token is missing. User might not be authenticated.");
        return;
      }

      if (editMode && selectedService?._id) {
        await cmsService.updateService({ ...newService, _id: selectedService._id }, token);
      } else {
        await cmsService.addService(newService, token);
      }
      fetchServices();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      if (!token) {
        console.error("Token is missing.");
        return;
      }
      await cmsService.deleteService(serviceId, token);
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleOpenEditDialog = (service: Service) => {
    setEditMode(true);
    setSelectedService(service);
    setNewService(service);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setSelectedService(null);
    setNewService({ title: "", description: "", price: 0, features: [] });
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        🛠️ {readOnly ? "Our Services" : "Manage Services"}
      </Typography>

      {/* ✅ Only show Add Button in Admin Mode */}
      {!readOnly && (
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
          Add Service
        </Button>
      )}

      <Grid container spacing={3} mt={2}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service._id}>
            <Box
              sx={{
                p: 2,
                border: "1px solid #ddd",
                borderRadius: "8px",
                textAlign: "center",
                background: "#f9f9f9",
              }}
            >
              <Typography variant="h6">{service.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                {service.description}
              </Typography>
              <Typography variant="subtitle1" color="primary">
                ${service.price}
              </Typography>

              {/* ✅ Only show Edit/Delete Buttons in Admin Mode */}
              {!readOnly && (
                <Box mt={2}>
                  <Button startIcon={<Edit />} onClick={() => handleOpenEditDialog(service)}>
                    Edit
                  </Button>
                  <Button startIcon={<Delete />} color="error" onClick={() => handleDeleteService(service._id!)}>
                    Delete
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Service Dialog */}
      {!readOnly && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{editMode ? "Edit Service" : "Add New Service"}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              label="Title"
              value={newService.title}
              onChange={(e) => setNewService({ ...newService, title: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Description"
              multiline
              rows={3}
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Price"
              type="number"
              value={newService.price}
              onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleAddOrUpdateService}>
              {editMode ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Services;
