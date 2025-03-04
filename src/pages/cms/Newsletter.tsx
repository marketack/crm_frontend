import React, { useState } from "react";
import { Paper, Typography, TextField, Button } from "@mui/material";
import cmsService from "../../api/cmsService";
import { toast } from "react-toastify";

const Newsletter: React.FC = () => {
  const [newsletter, setNewsletter] = useState({ subject: "", content: "" });
  const token = localStorage.getItem("token") || "";

  const handleSendNewsletter = async () => {
    try {
      await cmsService.sendNewsletter(newsletter, token);
      toast.success("✅ Newsletter sent successfully!");
      setNewsletter({ subject: "", content: "" });
    } catch {
      toast.error("❌ Failed to send newsletter");
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">📢 Send Newsletter</Typography>
      <TextField
        label="Subject"
        fullWidth
        value={newsletter.subject}
        onChange={(e) => setNewsletter({ ...newsletter, subject: e.target.value })}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Content"
        fullWidth
        multiline
        rows={4}
        value={newsletter.content}
        onChange={(e) => setNewsletter({ ...newsletter, content: e.target.value })}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleSendNewsletter}>
        Send
      </Button>
    </Paper>
  );
};

export default Newsletter;
