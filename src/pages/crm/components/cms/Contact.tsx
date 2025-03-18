import React, { useEffect, useState } from "react";
import { Paper, Typography, TextField, Button, CircularProgress, Box, useTheme } from "@mui/material";
import cmsService from "../../../../api/cmsService";
import { toast } from "react-toastify";

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

interface ContactProps {
  readOnly?: boolean; // ✅ Show editable fields in Admin, but readonly in Home Footer
}

const Contact: React.FC<ContactProps> = ({ readOnly = false }) => {
  const [contact, setContact] = useState<ContactInfo>({
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token") || "";
  const theme = useTheme(); // ✅ Dynamic Theme

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      setLoading(true);
      const response = (await cmsService.getContactUs()) as { contact?: ContactInfo };
      setContact(response.contact || { email: "", phone: "", address: "" });
    } catch {
      toast.error("❌ Failed to fetch contact details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContact = async () => {
    try {
      await cmsService.updateContactUs(contact, token);
      toast.success("✅ Contact updated!");
    } catch {
      toast.error("❌ Failed to update contact");
    }
  };

  return (
    <Paper
      component="footer"
      sx={{
        p: 3,
        mt: 5,
        backgroundColor: theme.palette.background.default, // ✅ Dark Mode Adaptive
        color: theme.palette.text.primary,
        textAlign: "center",
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        📞 Contact Information
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : readOnly ? (
        // ✅ Read-Only Mode for Footer
        <Box>
          <Typography variant="body1">📧 {contact.email}</Typography>
          <Typography variant="body1">📞 {contact.phone}</Typography>
          <Typography variant="body1">📍 {contact.address}</Typography>
        </Box>
      ) : (
        // ✅ Editable Mode for Admin
        <>
          <TextField
            label="Email"
            fullWidth
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Phone"
            fullWidth
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Address"
            fullWidth
            value={contact.address}
            onChange={(e) => setContact({ ...contact, address: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleUpdateContact}>
            Update
          </Button>
        </>
      )}
    </Paper>
  );
};

export default Contact;
