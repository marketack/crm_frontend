import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#4b4da0", contrastText: "#ffffff" }, // Brand color
    secondary: { main: "#ff4081", contrastText: "#ffffff" }, // Accent color
    background: { default: "#f4f6f8", paper: "#ffffff" },
    text: { primary: "#000000", secondary: "#4b4da0" },
    success: { main: "#4caf50" },
    warning: { main: "#ff9800" },
    error: { main: "#f44336" },
    info: { main: "#2196f3" },
  },
  typography: {
    fontFamily: `"Poppins", "Roboto", "Helvetica", "Arial", sans-serif`,
    h1: { fontSize: "2rem", fontWeight: 700 },
    h2: { fontSize: "1.75rem", fontWeight: 600 },
    h3: { fontSize: "1.5rem", fontWeight: 500 },
    h4: { fontSize: "1.25rem", fontWeight: 500 },
    h5: { fontSize: "1rem", fontWeight: 400 },
    h6: { fontSize: "0.875rem", fontWeight: 400 },
    body1: { fontSize: "1rem", lineHeight: 1.5 },
    body2: { fontSize: "0.875rem", lineHeight: 1.5 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 10 }, // Rounded corners for a modern look
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
          fontWeight: 600,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#4b4da0",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#4b4da0", contrastText: "#ffffff" },
    secondary: { main: "#ff4081", contrastText: "#ffffff" },
    background: { default: "#181a27", paper: "#222437" }, // Darker shades for contrast
    text: { primary: "#ffffff", secondary: "#b0b3d6" },
    success: { main: "#4caf50" },
    warning: { main: "#ff9800" },
    error: { main: "#f44336" },
    info: { main: "#2196f3" },
  },
  typography: {
    fontFamily: `"Poppins", "Roboto", "Helvetica", "Arial", sans-serif`,
    h1: { fontSize: "2rem", fontWeight: 700 },
    h2: { fontSize: "1.75rem", fontWeight: 600 },
    h3: { fontSize: "1.5rem", fontWeight: 500 },
    h4: { fontSize: "1.25rem", fontWeight: 500 },
    h5: { fontSize: "1rem", fontWeight: 400 },
    h6: { fontSize: "0.875rem", fontWeight: 400 },
    body1: { fontSize: "1rem", lineHeight: 1.5 },
    body2: { fontSize: "0.875rem", lineHeight: 1.5 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
          fontWeight: 600,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#282c3f",
        },
      },
    },
  },
});
