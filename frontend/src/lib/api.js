import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Proxied by Vite to localhost:8000
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeProfile = async (name, context) => {
  const response = await api.post('/analyze', { name, context });
  return response.data;
};

export const chatSimulation = async (target_name, context, profile, history) => {
  const response = await api.post('/chat', {
    target_name,
    context,
    profile,
    history
  });
  return response.data;
};

export default api;
