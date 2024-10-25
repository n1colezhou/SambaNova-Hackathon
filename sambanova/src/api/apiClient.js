import axios from 'axios';

const apiClient = axios.create({
    baseURL: "https://api.sambanova.ai/v1",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.REACT_APP_SAMBA_API_KEY}`
    }
})

export default apiClient;