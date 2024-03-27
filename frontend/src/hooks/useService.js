import axios from "axios";

const SERVICE_BASE_URL =
  process.env.REACT_APP_SERVICE_BASEURL || "https://up365gaming.com";

export const useService = () => {
  const instance = axios.create({
    baseURL: SERVICE_BASE_URL,
    timeout: 1000,
  });

  return instance;
};
