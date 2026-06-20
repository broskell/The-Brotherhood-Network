import axios from 'axios';

const API_URL = '/api/sos';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const createSos = async (latitude, longitude, message) => {
  const response = await axios.post(API_URL, { latitude, longitude, message }, getAuthHeaders());
  return response.data;
};

export const updateLocation = async (id, latitude, longitude) => {
  const response = await axios.patch(`${API_URL}/${id}/location`, { latitude, longitude }, getAuthHeaders());
  return response.data;
};

export const acceptSos = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/accept`, {}, getAuthHeaders());
  return response.data;
};

export const resolveSos = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/resolve`, {}, getAuthHeaders());
  return response.data;
};

export const getActiveAlerts = async () => {
  const response = await axios.get(`${API_URL}/active`, getAuthHeaders());
  return response.data;
};

export const getHistory = async () => {
  const response = await axios.get(`${API_URL}/history`, getAuthHeaders());
  return response.data;
};
