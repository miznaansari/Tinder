import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const createUser = async (userData) => {
  const response = await axios.post(`${API_URL}/create`, userData);
  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const sendFriendRequest = async (senderId, receiverId) => {
  const response = await axios.post(`${API_URL}/friend-requests/send`, { senderId, receiverId });
  return response.data;
};
