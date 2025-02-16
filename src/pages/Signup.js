import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { registerUser } from "../services/authService";

const Signup = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "", // Add username field
    email: "",
    phoneNumber: "", // Add phoneNumber field
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(userData);
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5} p={4} boxShadow={3} borderRadius={2}>
        <Typography variant="h4" gutterBottom>
          Create an Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="First Name" name="firstName" onChange={handleChange} required margin="normal" />
          <TextField fullWidth label="Last Name" name="lastName" onChange={handleChange} required margin="normal" />
          <TextField fullWidth label="Username" name="username" onChange={handleChange} required margin="normal" />
          <TextField fullWidth label="Phone Number" name="phoneNumber" type="tel" onChange={handleChange} required margin="normal" />
          <TextField fullWidth label="Email" name="email" type="email" onChange={handleChange} required margin="normal" />
          <TextField fullWidth label="Password" name="password" type="password" onChange={handleChange} required margin="normal" />
          <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading} sx={{ mt: 2 }}>
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
        </form>
        <Typography variant="body2" mt={2}>
          Already have an account?{" "}
          <Button color="secondary" onClick={() => navigate("/login")}>
            Login
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default Signup;
