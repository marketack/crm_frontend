import React, { useState } from "react";
import { Box, Container, Typography, TextField, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import cmsService from "../api/cmsService";

const Footer = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await cmsService.sendContactUs(form);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <Box sx={{ background: darkMode ? "#222" : "#f8f8f8", color: darkMode ? "#fff" : "#333", p: 4, textAlign: "center" }}>
      <Container maxWidth="md">
        <Typography variant="h5" fontWeight="bold">Contact Us</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>Have questions? Reach out to us.</Typography>
        
        {submitted ? (
          <Typography color="success.main">Thank you! We'll get back to you soon.</Typography>
        ) : (
          <>
            <TextField fullWidth label="Name" name="name" onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Email" name="email" type="email" onChange={handleChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Message" name="message" multiline rows={4} onChange={handleChange} sx={{ mb: 2 }} />
            <Button variant="contained" color="primary" onClick={handleSubmit}>Send Message</Button>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Footer;
