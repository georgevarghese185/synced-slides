import axios from './axios-instance'

export const getDisplays = async () => {
  const response = await axios.get('/displays');
  return response.data.displays;
}

export const getMyDisplay = async () => {
  const response = await axios.get('/displays/my-display');
  return response.data
}

export const getDisplay = async (id) => {
  const response = await axios.get(`/displays/${id}`);
  return response.data;
}

export const deleteDisplay = async (id) => {
  const response = await axios.delete(`/displays/${id}`);
  return response.data
}

export const createDisplay = async ({ name, loginName, slides }) => {
  const response = await axios.post('/displays/new', { name, loginName, slides });
  return response.data;
}

export const updateDisplay = async (id, update) => {
  const response = await axios.post(`/displays/${id}`, update);
  return response.data.displays;
}
