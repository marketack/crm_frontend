import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    axios.get("/leads")
      .then((res) => setLeads(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Leads</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate("/leads/add")}
        sx={{ marginBottom: 2 }}
      >
        Add New Lead
      </Button>
      {leads.map((lead) => (
        <Paper key={lead.id} sx={{ padding: 2, marginBottom: 1 }}>
          <Typography>{lead.name}</Typography>
        </Paper>
      ))}
    </Container>
  );
};

export default Leads;
