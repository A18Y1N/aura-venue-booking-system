import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // this is why we don't prefix '/api' in calls
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add JWT token to each request if present
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("seminar-hall-token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default instance;
