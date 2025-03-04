import React, { useEffect, useState } from "react";
import { Paper, Typography, TextField, Button, CircularProgress } from "@mui/material";
import cmsService from "../../api/cmsService";
import { toast } from "react-toastify";

interface AboutUsProps {
  readOnly?: boolean; // ✅ Determines if Editing is Allowed
}

const AboutUs: React.FC<AboutUsProps> = ({ readOnly = true }) => {
  const [aboutUs, setAboutUs] = useState<string>("No content available.");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      setLoading(true);
      const response = (await cmsService.getAboutUs()) as { aboutUs: string };
      setAboutUs(response.aboutUs || "No content available.");
    } catch {
      toast.error("❌ Failed to fetch About Us");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAboutUs = async () => {
    try {
      await cmsService.updateAboutUs({ aboutUs }, token);
      toast.success("✅ About Us updated!");
    } catch {
      toast.error("❌ Failed to update About Us");
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {loading ? (
        <CircularProgress />
      ) : readOnly ? (
        <Typography>{aboutUs}</Typography>
      ) : (
        <>
          <TextField
            label="About Us"
            multiline
            fullWidth
            value={aboutUs}
            onChange={(e) => setAboutUs(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleUpdateAboutUs}>
            Update
          </Button>
        </>
      )}
    </Paper>
  );
};

export default AboutUs;
