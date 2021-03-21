import axios from './axios-instance'

export const getSlides = async () => {
  const response = await axios.get('/slides');
  return response.data.slides;
}

export const getSlide = async (id) => {
  const response = await axios.get(`/slides/${id}`);
  return response.data;
}

export const uploadSlide = async ({ name, type, data }) => {
  const response = await axios.post('/slides/new', { name, type, data });
  return response.data;
}

export const updateSlide = async (id, update) => {
  const response = await axios.patch(`/slides/${id}`, update);
  return response.data;
}

export const deleteSlide = async (id) => {
  const response = await axios.delete(`/slides/${id}`);
  return response.data;
}
