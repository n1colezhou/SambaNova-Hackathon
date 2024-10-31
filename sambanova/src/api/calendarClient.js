const axios = require('axios');

const API_KEY = process.env.REACT_APP_GCAL_API_KEY;
const BASE_URL = 'https://www.googleapis.com/calendar/v3';

const calendarServices = {
    createEvent: async (calendarId, event) => {
        try {
            const response = await axios.post(`${BASE_URL}/calendars/${calendarId}/events?key=${API_KEY}`, event);
            return response.data;
        } catch (error) {
            console.error(`Error creating event in calendar ${calendarId}:`, error);
            throw error;
        }
    }
};

export default calendarServices;