import axios from './axios-instance';

export const getAuth = async () => {
  try {
    const response = await axios.get('/auth');
    return response.data;
  } catch (e) {
    return null;
  }
}
