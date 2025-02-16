import axios from "axios";

// Base API Configuration
const API = axios.create({
  baseURL: "http://localhost:3001/api", // Change to your backend URL
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
});

export default API;
