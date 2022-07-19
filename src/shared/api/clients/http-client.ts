import axios from "axios";

const httpClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/`,
});

httpClient.interceptors.response.use((res) => {
  return res.data;
});
export const { get, post, patch, put } = httpClient;
