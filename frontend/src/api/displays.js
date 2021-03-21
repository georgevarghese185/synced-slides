import axios from './axios-instance'

export const getDisplays = async () => {
  const response = await axios.get('/displays');
  return response.data.displays;
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
