import api from './api';

const getProfileStats = async () => {
  const response = await api.get('/api/stats/');
  return response.data;
};

export default getProfileStats;