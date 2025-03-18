import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Alert,
  AlertTitle,
  useTheme,
  FormControlLabel,
  Checkbox, // ✅ Import Checkbox for "Keep Me Signed In"
} from "@mui/material";
import { useAppDispatch } from "../../redux/store";
import { userLogin } from "../../redux/slices/authSlice";
import { LoginCredentials } from "../../types/authTypes";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  // ✅ State Management
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: "", password: "" });
  const [keepMeSignedIn, setKeepMeSignedIn] = useState(false); // ✅ "Keep Me Signed In"
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // ✅ Validate Inputs
  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!credentials.email) newErrors.email = "Email is required!";
    if (!credentials.password) newErrors.password = "Password is required!";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Login
  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      console.log("🔍 Sending Login Request:", credentials);
      const result = await dispatch(userLogin({ ...credentials, keepMeSignedIn })).unwrap();

      localStorage.setItem("token", result.token);
      localStorage.setItem("userId", result.user._id);

      // ✅ Store refresh token only if "Keep Me Signed In" is checked
      if (keepMeSignedIn) {
        localStorage.setItem("refreshToken", result.refreshToken);
      }

      console.log("✅ Login successful! User ID:", result.user._id);
      setSuccessMessage("✅ Login successful! Redirecting...");

      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setErrorMessage(typeof error === "string" ? error : "❌ Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: theme.palette.background.default,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 2,
            textAlign: "center",
            background: theme.palette.background.paper,
          }}
        >
          <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" mb={2}>
            Sign in to continue
          </Typography>

          {/* ✅ Success & Error Alerts */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <AlertTitle>Success</AlertTitle>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <AlertTitle>Error</AlertTitle>
              {errorMessage}
            </Alert>
          )}

          {/* ✅ Email Field */}
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            error={Boolean(errors.email)}
            helperText={errors.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          />

          {/* ✅ Password Field */}
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            error={Boolean(errors.password)}
            helperText={errors.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* ✅ "Keep Me Signed In" Checkbox */}
          <FormControlLabel
            control={<Checkbox checked={keepMeSignedIn} onChange={(e) => setKeepMeSignedIn(e.target.checked)} />}
            label="Keep me signed in"
          />

          {/* ✅ Login Button */}
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, py: 1 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          {/* ✅ Signup & Forgot Password */}
          <Box mt={2}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Button component="a" href="/register" size="small">
                Sign up
              </Button>
            </Typography>
            <Typography variant="body2">
              Forgot your password?{" "}
              <Button component="a" href="/forgot-password" size="small">
                Reset it
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
