import axios from './axios-instance'

export const getSlides = async () => {
  const response = await axios.get('/slides');
  return response.data.slides;
}
