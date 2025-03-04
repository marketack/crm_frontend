import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CircularProgress, Box } from "@mui/material";

const ProtectedLayout = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isChecking, setIsChecking] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isAuthenticated && !token) {
      setIsChecking(false);
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, token]);

  if (isChecking) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated || token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedLayout;
