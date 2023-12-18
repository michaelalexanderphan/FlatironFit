import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; 

export const getWorkouts = async () => {
  try {
    const response = await axios.get(`${API_URL}/workouts`);
    return response.data;
  } catch (error) {
    // Handle error here
    console.error('Error fetching workouts:', error);
  }
};

export const getMessages = async () => {
  try {
    const response = await axios.get(`${API_URL}/messages`);
    return response.data;
  } catch (error) {
    // Handle error here
    console.error('Error fetching messages:', error);
  }
};

// ... you can add more API call functions as needed ...
