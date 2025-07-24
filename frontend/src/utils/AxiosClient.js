import axios from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URI
});
console.log(axiosClient);
axiosClient.interceptors.request.use(
  (config) => {
    if (!config.url.includes("/login")) {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
