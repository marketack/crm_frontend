import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Paper, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";

const Login = () => {
  const [loginData, setLoginData] = useState({ loginIdentifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, error } = useSelector((state) => state.auth);

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await dispatch(loginUser(loginData)).unwrap();
      toast.success("Login successful! Redirecting...");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Paper elevation={6} sx={{ padding: "30px", maxWidth: "400px", width: "100%" }}>
        <Typography variant="h5" sx={{ textAlign: "center", marginBottom: "20px" }}>Login</Typography>
        <TextField label="Email or Username" fullWidth margin="normal" 
          value={loginData.loginIdentifier} 
          onChange={(e) => setLoginData({ ...loginData, loginIdentifier: e.target.value })} 
        />
        <TextField label="Password" type="password" fullWidth margin="normal" 
          value={loginData.password} 
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} 
        />
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleLogin} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
