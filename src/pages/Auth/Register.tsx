import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { userRegister } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Alert,
  AlertTitle,
} from "@mui/material";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // ✅ State Management
  const [userData, setUserData] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; phone?: string }>({});

  // ✅ Validate Form
  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string; phone?: string } = {};
    if (!userData.name) newErrors.name = "Name is required!";
    if (!userData.email) newErrors.email = "Email is required!";
    if (!userData.password) newErrors.password = "Password is required!";
    if (!userData.phone) newErrors.phone = "Phone number is required!";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Registration
  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await dispatch(userRegister(userData)).unwrap();
      setSuccessMessage("✅ Registration successful! Please verify your email.");
      setTimeout(() => navigate("/verify-email"), 2000); // Redirect after success
    } catch (error) {
      setErrorMessage(typeof error === "string" ? error : "❌ Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f4f4",
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, textAlign: "center" }}>
          <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
            Create an Account
          </Typography>

          {/* ✅ Success & Error Alerts */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <AlertTitle>Success</AlertTitle>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <AlertTitle>Error</AlertTitle>
              {errorMessage}
            </Alert>
          )}

          {/* ✅ Input Fields */}
          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            error={Boolean(errors.name)}
            helperText={errors.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            error={Boolean(errors.email)}
            helperText={errors.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            error={Boolean(errors.phone)}
            helperText={errors.phone}
            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={Boolean(errors.password)}
            helperText={errors.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          />

          {/* ✅ Register Button */}
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, py: 1 }}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
          </Button>

          {/* ✅ Already Have an Account? */}
          <Box mt={2}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Button component="a" href="/login" size="small">
                Login
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
