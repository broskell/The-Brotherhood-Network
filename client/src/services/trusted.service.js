import axios from 'axios';

const API_URL = '/api/trusted';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const sendRequest = async (receiverId) => {
  const response = await axios.post(`${API_URL}/request`, { receiverId }, getAuthHeaders());
  return response.data;
};

export const acceptRequest = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/accept`, {}, getAuthHeaders());
  return response.data;
};

export const rejectRequest = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/reject`, {}, getAuthHeaders());
  return response.data;
};

export const removeMember = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};

export const getMembers = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};
