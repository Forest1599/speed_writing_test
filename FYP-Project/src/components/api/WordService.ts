import api from "./api"

// Function to fetch the words for the typing test
export const fetchWords = async (mode: 'random' | 'adaptive' = 'random') => {
    const response = await api.get(`/api/words/?mode=${mode}`);
    return response.data;
};