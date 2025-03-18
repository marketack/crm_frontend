import { createSlice } from "@reduxjs/toolkit";

interface ThemeState {
  darkMode: boolean;
}

const initialState: ThemeState = {
  darkMode: localStorage.getItem("darkMode") === "true", // Persist theme preference
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => { // Rename to toggleTheme
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", state.darkMode.toString());
    },
  },
});

export const { toggleTheme } = themeSlice.actions; // Export toggleTheme
export default themeSlice.reducer;