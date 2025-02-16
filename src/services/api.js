import axios from "axios";

// Determine Base URL based on environment
const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_URL_LOCAL || "http://localhost:3001/api"
    : process.env.REACT_APP_API_URL || "https://backend.crmore.com/api";

// Base API Configuration
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization Token to Every Request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
