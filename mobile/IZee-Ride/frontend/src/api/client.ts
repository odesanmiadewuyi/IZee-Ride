import axios from 'axios';
import { getToken, clearToken } from './token';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api';

const instance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

instance.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      await clearToken();
    }
    return Promise.reject(err);
  }
);

export default instance;

