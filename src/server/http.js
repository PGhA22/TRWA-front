import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const http = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // برای cookie/refresh
  headers: { "Content-Type": "application/json" },
});
