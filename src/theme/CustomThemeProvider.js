import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createContext, useState, useContext, useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { amber, blueGrey } from "@mui/material/colors";

// Create Context for Theme
const ColorModeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: amber[500] },
          secondary: { main: blueGrey[500] },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

// Custom Hook to Use Theme Mode
export const useColorMode = () => useContext(ColorModeContext);
