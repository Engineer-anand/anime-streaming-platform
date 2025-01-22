import axios from "axios";

const API_BASE_URL = "https://anime-api-dl67.onrender.com/api";

// Fetch list of anime based on search
export const fetchAnimeList = async (searchTerm = "") => {
  const response = await axios.get(`${API_BASE_URL}/aniwatch/search`, {
    params: { keyword: searchTerm },
  });
  return response.data;
};

// Fetch detailed information about a specific anime
export const fetchAnimeDetails = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/aniwatch/details`, {
    params: { id },
  });
  return response.data;
};

// Fetch anime categories (genres)
export const fetchAnimeCategories = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/aniwatch/categories`, {
    params: { id },
  });
  return response.data;
};

// Fetch anime episodes list
export const fetchAnimeEpisodes = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/aniwatch/episodes`, {
    params: { id },
  });
  return response.data;
};

// Fetch episode streaming sources/servers for a specific episode
export const fetchEpisodeSources = async (episodeId) => {
  const response = await axios.get(`${API_BASE_URL}/aniwatch/episode-sources`, {
    params: { episodeId },
  });
  return response.data;
};
