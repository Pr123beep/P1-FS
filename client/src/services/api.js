import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const pollsAPI = {
  // Get all polls
  getPolls: async () => {
    const response = await api.get('/polls');
    return response.data;
  },

  // Get a specific poll
  getPoll: async (id) => {
    const response = await api.get(`/polls/${id}`);
    return response.data;
  },

  // Create a new poll
  createPoll: async (pollData) => {
    const response = await api.post('/polls', pollData);
    return response.data;
  },

  // Vote on a poll
  vote: async (pollId, optionIndex) => {
    const response = await api.post(`/polls/${pollId}/vote`, { optionIndex });
    return response.data;
  },
};

export default api; 