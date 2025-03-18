import React, { useEffect, useState } from "react";
import { 
  Container, Grid, Typography, Card, CardContent, Avatar, CircularProgress, Alert 
} from "@mui/material";
import { motion } from "framer-motion";
import cmsService from "../../../../api/cmsService"; // ✅ Import API service
import { getProfileImage } from "./../../../utils/imageHelper"; // ✅ Import globally

// ✅ Define TeamMember Interface
interface TeamMember {
  _id: string;
  name: string;
  email: string;
  position: string;
  profileImage: string;
}

const Team: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await cmsService.getTeam();

        // ✅ Assuming API directly returns an array of employees
        if (Array.isArray(response) && response.length > 0) {
          setTeam(response);
        } else {
          setError("No team members found.");
        }
      } catch (err) {
        console.error("Failed to load team members:", err);
        setError("Failed to load team members. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography 
        variant="h4" 
        fontWeight="bold" 
        textAlign="center" 
        sx={{ mb: 5, color: "white", letterSpacing: 1, textTransform: "uppercase" }}
      >
        Meet Our Team
      </Typography>

      {loading ? (
        <Grid container justifyContent="center">
          <CircularProgress color="secondary" />
        </Grid>
      ) : error ? (
        <Alert severity="error" sx={{ textAlign: "center", bgcolor: "rgba(255, 0, 0, 0.1)" }}>{error}</Alert>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {team.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={member._id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card
                  sx={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: 6,
                    textAlign: "center",
                    backdropFilter: "blur(12px)",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))",
                    color: "white",
                    padding: 4,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": { transform: "scale(1.05)", boxShadow: "0 10px 20px rgba(255,255,255,0.3)" },
                  }}
                >
                <Avatar
  src={getProfileImage(member.profileImage)} // ✅ Uses global function
  alt={member.name}
  sx={{
    width: 120,
    height: 120,
    margin: "auto",
    mb: 2,
    border: "4px solid white",
    boxShadow: "0 4px 10px rgba(255,255,255,0.5)",
  }}
/>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, fontSize: "1.2rem", textTransform: "uppercase" }}>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="#ddd" sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
                      {member.position}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#bbb", mt: 1, fontSize: "0.85rem" }}>
                      {member.email}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Team;
