import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Upload URL file
export const uploadFile = async (file) => {
  const formData = new FormData();

  formData.append('file', file);

  const response = await axios.post(`${BASE_URL}/api/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Fetch URLs
export const fetchUrls = async () => {
  const response = await axios.get(`${BASE_URL}/api/latest`);
  return response.data;
};
