import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const getInvoices = async () => {
  const response = await api.get('/invoices');
  return response.data;
};

export const createInvoice = async (invoice: Omit<Invoice, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  const response = await api.post('/invoices', invoice);
  return response.data;
};

export const updateInvoice = async (id: string, invoice: Partial<Invoice>) => {
  const response = await api.put(`/invoices/${id}`, invoice);
  return response.data;
};

export const deleteInvoice = async (id: string) => {
  const response = await api.delete(`/invoices/${id}`);
  return response.data;
};

export default api;