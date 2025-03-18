import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Divider,
  Tabs,
  Tab,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import { Edit, Save, Cancel, UploadFile, VpnKey, CheckCircle, WarningAmber } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
  verifyEmail,
  verifyPhone,
  changeUserPassword,
} from "../../api/userService";
import { toast } from "react-toastify";
import { getProfileImage } from "../../utils/imageHelper"; // ✅ Centralized image logic
import { useTheme } from "@mui/material/styles";

// ✅ Define Types
interface Role {
  _id: string;
  name: string;
}

interface Company {
  _id: string;
  name: string;
  industry: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  role: Role;
  company?: Company;
  profileImage?: string;
  status: string;
  timezone: string;
  preferredLanguage: string;
  department?: string;
  position?: string;
  salary?: number;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  createdAt: string;
  updatedAt: string;
}

const UserManagement: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const theme = useTheme(); // ✅ Use MUI theme

  useEffect(() => {
    if (!userId) {
      toast.error("User ID is required.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const userData: Partial<User> = await getUserProfile(userId);
        const defaultUser: User = {
          _id: userData._id ?? "",
          name: userData.name ?? "Unknown",
          email: userData.email ?? "No Email",
          emailVerified: userData.emailVerified ?? false,
          phone: userData.phone ?? "No Phone",
          phoneVerified: userData.phoneVerified ?? false,
          role: userData.role ?? { _id: "", name: "Unknown" },
          company: userData.company ?? { _id: "", name: "N/A", industry: "N/A" },
          profileImage: userData.profileImage ?? "/default.png",
          status: userData.status ?? "inactive",
          timezone: userData.timezone ?? "UTC",
          preferredLanguage: userData.preferredLanguage ?? "en",
          department: userData.department ?? "N/A",
          position: userData.position ?? "N/A",
          salary: userData.salary ?? 0,
          subscriptionPlan: userData.subscriptionPlan ?? "Free",
          subscriptionStatus: userData.subscriptionStatus ?? "Inactive",
          createdAt: userData.createdAt ?? new Date().toISOString(),
          updatedAt: userData.updatedAt ?? new Date().toISOString(),
        };

        setUser(defaultUser);
        setEditedUser(defaultUser);
      } catch (error) {
        toast.error("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // ✅ Save Edited Data
  const handleSave = async () => {
    if (!editedUser) return;
  
    try {
      await updateUserProfile(userId!, editedUser); // ✅ API call
      setUser(editedUser); // ✅ Update local state
      setEditing(false); // ✅ Exit edit mode
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };
  

  // ✅ Handle Image Upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first.");
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadProfileImage(userId!, selectedFile);
      setUser((prev) => (prev ? { ...prev, profileImage: imageUrl } : null));
      toast.success("Profile image updated!");
    } catch (error) {
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Handle Email & Phone Verification
  const handleVerifyEmail = async () => {
    try {
      await verifyEmail(userId!);
      setUser((prev) => (prev ? { ...prev, emailVerified: true } : null));
      toast.success("Email verified successfully!");
    } catch (error) {
      toast.error("Email verification failed.");
    }
  };

  const handleVerifyPhone = async () => {
    try {
      await verifyPhone(userId!);
      setUser((prev) => (prev ? { ...prev, phoneVerified: true } : null));
      toast.success("Phone verified successfully!");
    } catch (error) {
      toast.error("Phone verification failed.");
    }
  };

  // ✅ Change Password
  const handleChangePassword = async () => {
    try {
      await changeUserPassword(userId!);
      toast.success("Password change request sent.");
    } catch (error) {
      toast.error("Failed to request password change.");
    }
  };

  if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />;
  if (!user) return <Typography color="error">User not found</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          User Management
        </Typography>

        <Tabs value={activeTab} onChange={(_, newTab) => setActiveTab(newTab)}>
          <Tab label="User Details" />
        </Tabs>

        <Divider sx={{ my: 2 }} />

        {activeTab === 0 && user && (
          <Card sx={{ mb: 2, borderRadius: 2 }}>
            <CardContent>
              {/* ✅ Profile Image Upload */}
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Avatar
                    src={getProfileImage(user.profileImage)}
                    alt={user.name}
                    sx={{ width: 120, height: 120, margin: "auto", mb: 2 }}
                  />
                  <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                  <Button startIcon={<UploadFile />} variant="contained" onClick={handleUpload} disabled={uploading}>
                    {uploading ? "Uploading..." : "Upload"}
                  </Button>
                </Grid>

            {/* ✅ Editable User Fields */}


{[
  { key: "name", label: "Full Name" },
  { key: "email", label: "Email Address" },
  { key: "phone", label: "Phone Number" },
  { key: "role.name", label: "Role", disabled: true },
  { key: "company.name", label: "Company Name" },
  { key: "company.industry", label: "Industry" },
  { key: "department", label: "Department" },
  { key: "position", label: "Position" },
  { key: "salary", label: "Salary", type: "number" },
  { key: "status", label: "Account Status", disabled: true },
  { key: "subscriptionPlan", label: "Subscription Plan", disabled: true },
  { key: "subscriptionStatus", label: "Subscription Status", disabled: true },
  { key: "timezone", label: "Timezone" },
  { key: "preferredLanguage", label: "Preferred Language" }
].map(({ key, label, type = "text", disabled = false }, index) => (
  <Grid item xs={12} md={6} key={index}>
    <TextField
      label={label}
      type={type}
      value={
        editing
          ? key.includes(".")
            ? editedUser?.[key.split(".")[0]]?.[key.split(".")[1]] || ""
            : editedUser?.[key] || ""
          : key.includes(".")
            ? user?.[key.split(".")[0]]?.[key.split(".")[1]] || ""
            : user?.[key] || ""
      }
      fullWidth
      onChange={(e) => {
        if (key.includes(".")) {
          const [mainKey, subKey] = key.split(".");
          setEditedUser({
            ...editedUser!,
            [mainKey]: {
              ...(editedUser?.[mainKey] as any),
              [subKey]: e.target.value,
            },
          });
        } else {
          setEditedUser({ ...editedUser!, [key]: e.target.value });
        }
      }}
      disabled={!editing || disabled}
      variant="outlined"
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[1],
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: editing && !disabled ? theme.shadows[3] : theme.shadows[1],
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: disabled ? theme.palette.grey[400] : theme.palette.primary.light,
          },
          "&:hover fieldset": {
            borderColor: editing && !disabled ? theme.palette.primary.main : theme.palette.grey[400],
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.primary.main,
            boxShadow: editing && !disabled ? `0px 0px 6px ${theme.palette.primary.light}` : "none",
          },
        },
        "& .MuiInputLabel-root": {
          fontSize: "1rem",
          fontWeight: "bold",
          color: disabled ? theme.palette.grey[600] : theme.palette.text.primary,
        },
      }}
    />
  </Grid>
))}



                {/* ✅ Verification & Security */}
                <Grid item xs={12}>
                  <Button onClick={handleVerifyEmail}>{user.emailVerified ? "Email Verified ✅" : "Verify Email"}</Button>
                  <Button onClick={handleVerifyPhone}>{user.phoneVerified ? "Phone Verified ✅" : "Verify Phone"}</Button>
                  <Button startIcon={<VpnKey />} variant="contained" onClick={handleChangePassword}>
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Paper>
    </Container>
  );
};

export default UserManagement;
