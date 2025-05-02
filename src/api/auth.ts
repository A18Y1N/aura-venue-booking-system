import API from './axios';

export const register = async (name: string, email: string, password: string, role: string) => {
  const response = await API.post('/auth/register', { name, email, password, role });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await API.post('/auth/login', { email, password });
  return response.data;
};
