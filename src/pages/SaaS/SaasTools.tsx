import { useState, useEffect } from "react";
import {
  Button, Card, CardContent, CardActions, Grid, Typography, TextField,
  Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, IconButton
} from "@mui/material";
import { Delete, Edit, Add, Check } from "@mui/icons-material";
import { useAppSelector } from "../../redux/store";
import SaaSService, { SaaSTool } from "../../api/saasService";
import SubscriptionService from "../../api/subscriptionService";
import { toast } from "react-toastify";

const SaaSTools = () => {
  const user = useAppSelector((state) => state.auth.user);
  const isAdminOrStaff = user?.roles?.includes("admin") || user?.roles?.includes("staff");

  const [tools, setTools] = useState<SaaSTool[]>([]);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [editTool, setEditTool] = useState<SaaSTool | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", price: "", url: "" });

  useEffect(() => {
    fetchTools();
    fetchSubscriptions();
  }, []);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const response = await SaaSService.getAllSaaSTools();
      setTools(response.data as SaaSTool[]);
    } catch (error) {
      console.error("Error fetching tools:", error);
      toast.error("Failed to load SaaS tools.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await SubscriptionService.getUserSubscriptions();
      setSubscriptions((response.data as { toolId: string }[]).map(sub => sub.toolId));
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  const handleOpen = (tool?: SaaSTool) => {
    if (tool) {
      setEditTool(tool);
      setForm({ name: tool.name, description: tool.description, price: tool.price.toString(), url: tool.url });
    } else {
      setEditTool(null);
      setForm({ name: "", description: "", price: "", url: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTool(null);
  };

  const handleSubmit = async () => {
    try {
      if (!form.name || !form.description || !form.price || !form.url) {
        toast.error("Please fill in all fields.");
        return;
      }

      if (editTool) {
        await SaaSService.updateSaaSTool(editTool._id, { 
          name: form.name, 
          description: form.description, 
          price: Number(form.price), 
          url: form.url 
        });
        toast.success("SaaS Tool updated successfully!");
      } else {
        await SaaSService.createSaaSTool({ 
          name: form.name, 
          description: form.description, 
          price: Number(form.price), 
          url: form.url 
        });
        toast.success("SaaS Tool added successfully!");
      }

      fetchTools();
      handleClose();
    } catch (error) {
      console.error("Error saving tool:", error);
      toast.error("Failed to save SaaS tool.");
    }
  };

  return (
    <div style={{ marginTop: "80px", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>SaaS Tools</Typography>

      {isAdminOrStaff && (
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />} 
          onClick={() => handleOpen()} 
          sx={{ mb: 3 }}
        >
          Add SaaS Tool
        </Button>
      )}

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : (
        <Grid container spacing={3}>
          {tools.map((tool) => (
            <Grid item xs={12} sm={6} md={4} key={tool._id}>
              <Card sx={{ boxShadow: 3, transition: "0.3s", "&:hover": { boxShadow: 6 } }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{tool.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{tool.description}</Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>${tool.price}</Typography>
                  <Button 
                    size="small" 
                    href={tool.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ mt: 1, textTransform: "none" }}
                  >
                    Visit Tool
                  </Button>
                </CardContent>
                <CardActions>
                  {isAdminOrStaff ? (
                    <>
                      <IconButton color="primary" onClick={() => handleOpen(tool)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => console.log("Delete", tool._id)}>
                        <Delete />
                      </IconButton>
                    </>
                  ) : (
                    <Button 
                      variant="contained" 
                      color="success" 
                      startIcon={<Check />} 
                      onClick={() => console.log("Subscribe", tool._id)}
                      fullWidth
                    >
                      Subscribe
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editTool ? "Edit SaaS Tool" : "Add SaaS Tool"}</DialogTitle>
        <DialogContent>
          <TextField label="Name" fullWidth margin="dense" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Description" fullWidth margin="dense" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <TextField label="Price" type="number" fullWidth margin="dense" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <TextField label="URL" fullWidth margin="dense" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="primary" onClick={handleSubmit}>{editTool ? "Update" : "Add"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SaaSTools;
