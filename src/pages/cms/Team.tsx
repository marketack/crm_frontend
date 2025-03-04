import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import cmsService from "../../api/cmsService";
import { toast } from "react-toastify";

interface TeamMember {
  _id?: string;
  name: string;
  position: string;
  image?: string;
}

interface TeamProps {
  readOnly?: boolean; // ✅ Prop to check if editing is allowed
}

const Team: React.FC<TeamProps> = ({ readOnly = true }) => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token") || "";

  // ✅ New Team Member Input Fields
  const [newMember, setNewMember] = useState<TeamMember>({
    name: "",
    position: "",
    image: "",
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = (await cmsService.getTeam()) as { team: TeamMember[] };
      setTeam(response.team || []);
    } catch {
      toast.error("❌ Failed to fetch team");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeam = async () => {
    try {
      await cmsService.updateTeam({ team }, token);
      toast.success("✅ Team updated!");
    } catch {
      toast.error("❌ Failed to update team");
    }
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.position) {
      toast.warning("⚠️ Name and Position are required!");
      return;
    }

    setTeam([...team, { ...newMember, _id: Math.random().toString() }]);
    setNewMember({ name: "", position: "", image: "" });
  };

  const handleDeleteMember = (id?: string) => {
    if (!id) return;
    setTeam(team.filter((member) => member._id !== id));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}>
        👥 Our Team
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "auto" }} />
      ) : (
        <>
          <Grid container spacing={3}>
            {team.map((member) => (
              <Grid item xs={12} sm={6} md={4} key={member._id}>
                <Card>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Avatar
                      src={member.image}
                      sx={{ width: 64, height: 64, mb: 2, margin: "auto" }}
                    />
                    <Typography variant="h6">{member.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {member.position}
                    </Typography>

                    {/* ✅ Hide Delete Button in Read-Only Mode */}
                    {!readOnly && (
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteMember(member._id)}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* ✅ Hide Add New Member Section in Read-Only Mode */}
          {!readOnly && (
            <>
              <Typography variant="h6" sx={{ mt: 3 }}>
                ➕ Add New Team Member
              </Typography>
              <TextField
                label="Name"
                fullWidth
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Position"
                fullWidth
                value={newMember.position}
                onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Image URL"
                fullWidth
                value={newMember.image}
                onChange={(e) => setNewMember({ ...newMember, image: e.target.value })}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" onClick={handleAddMember}>
                Add Member
              </Button>
              <Button variant="contained" sx={{ ml: 2 }} onClick={handleUpdateTeam}>
                Save Team
              </Button>
            </>
          )}
        </>
      )}
    </Paper>
  );
};

export default Team;
