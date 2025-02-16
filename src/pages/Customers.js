import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get("/customers")
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Customers</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate("/customers/add")}
        sx={{ marginBottom: 2 }}
      >
        Add New Customer
      </Button>
      {customers.map((customer) => (
        <Paper key={customer.id} sx={{ padding: 2, marginBottom: 1 }}>
          <Typography>{customer.name}</Typography>
        </Paper>
      ))}
    </Container>
  );
};

export default Customers;
