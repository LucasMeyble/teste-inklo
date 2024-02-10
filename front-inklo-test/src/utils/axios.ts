import axios from "axios";

export const GithubAdapter = axios.create({
  baseURL: "https://api.github.com",
});

export const ApiAdapter = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
