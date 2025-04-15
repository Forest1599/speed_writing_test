import api from "./api"

// Function to fetch the words for the typing test
export const fetchWords = async () => {
    const response = await api.get("/api/words/")
    return response.data
}