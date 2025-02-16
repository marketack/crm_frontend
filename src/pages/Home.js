import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Container } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={5}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Welcome to CRM System
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Manage your leads, customers, and reports efficiently with our powerful CRM.
        </Typography>

        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mx: 1 }}
            onClick={() => navigate("/signup")}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ mx: 1 }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
