import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#4b4da0" },
    secondary: { main: "#ff9800" },
    background: { default: "#f4f6f8", paper: "#ffffff" },
    text: { primary: "#333", secondary: "#666" },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default theme;
