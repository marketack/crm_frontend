import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Local Storage
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./slices/authSlice";
import { createSlice } from "@reduxjs/toolkit";

// ✅ Theme Slice with Persistence
const themeSlice = createSlice({
  name: "theme",
  initialState: { darkMode: false },
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

// ✅ Persist Configuration
const persistConfig = {
  key: "root",
  storage,
};

const persistedThemeReducer = persistReducer(persistConfig, themeSlice.reducer);

// ✅ Configure Store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: persistedThemeReducer, // ✅ Persisted Theme Reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store); // ✅ Persistor

// ✅ Typed Hooks for Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
