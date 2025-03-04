import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store"; // ✅ Import correct dispatch type
import { verifyEmailAction } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const dispatch = useDispatch<AppDispatch>(); // ✅ Fix dispatch typing
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    try {
        await dispatch(verifyEmailAction({ email, otp })).unwrap();
        toast.success("Email verified successfully!");
        navigate("/login");
      } catch (error) {
        const errorMessage = typeof error === "string" ? error : "Verification failed.";
        toast.error(errorMessage);
      }
      
  };

  return (
    <Container>
      <Typography variant="h4">Verify Email</Typography>
      <TextField label="Email" fullWidth onChange={(e) => setEmail(e.target.value)} />
      <TextField label="OTP" fullWidth onChange={(e) => setOtp(e.target.value)} />
      <Button variant="contained" onClick={handleVerify}>Verify</Button>
    </Container>
  );
};

export default VerifyEmail;
