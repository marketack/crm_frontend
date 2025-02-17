import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthState } from "../redux/authSlice"; 
import { Box, Button, Typography, Container, Paper, Grid } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // ✅ Listen to auth state

  useEffect(() => {
    console.log("🏠 Home Page Loaded - Checking auth status...");
    
    // ✅ Redirect if user is still authenticated
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      // ✅ Ensure Redux knows user is logged out
      dispatch(clearAuthState());
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  }, [isAuthenticated, navigate, dispatch]); // ✅ Run effect when authentication state changes

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1976D2 30%, #D32F2F 90%)",
        padding: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            padding: 5,
            textAlign: "center",
            borderRadius: "16px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
            Welcome to CRM System
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Manage your leads, customers, and reports efficiently with our powerful CRM.
          </Typography>

          <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ padding: "12px", fontSize: "1rem", borderRadius: "8px" }}
                onClick={() => navigate("/signup")}
              >
                Get Started
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                sx={{ padding: "12px", fontSize: "1rem", borderRadius: "8px" }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;
