// Centralized API Configuration
// Replace these with your actual backend URLs via environment variables in .env

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.example.com";

export const RECOMMENDED_API_URL =
  import.meta.env.VITE_RECOMMENDED_API_URL || "https://api.example.com/random";
