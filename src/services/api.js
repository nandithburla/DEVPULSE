import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

function unwrap(response) {
  return response.data?.data;
}

export async function getHealth() {
  const response = await apiClient.get('/api/health');
  return unwrap(response);
}

export async function getMetrics() {
  const response = await apiClient.get('/api/metrics');
  return unwrap(response);
}

export async function getContainers() {
  const response = await apiClient.get('/api/containers');
  return unwrap(response);
}

export { API_BASE_URL };
