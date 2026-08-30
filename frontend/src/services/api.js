import axios from 'axios';

const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL || '/api';
  url = url.replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url += '/api';
  }
  return url + '/';
};

const API = axios.create({
  baseURL: getBaseURL(),
});

// Interceptor to strip leading slash and add Bearer Token
API.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith('/')) {
    config.url = config.url.substring(1);
  }
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me'),
  logout: () => API.post('/auth/logout'),
};

export const documentAPI = {
  upload: (formData) =>
    API.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getDocuments: (params) => API.get('/documents', { params }),
  getDocumentById: (id) => API.get(`/documents/${id}`),
  reprocess: (id) => API.post(`/documents/${id}/reprocess`),
  deleteDocument: (id) => API.delete(`/documents/${id}`),
};

export const chatAPI = {
  sendMessage: (data) => API.post('/chat', data),
  getConversations: () => API.get('/chat/conversations'),
  createConversation: (title) => API.post('/chat/conversations', { title }),
  getConversationById: (id) => API.get(`/chat/conversations/${id}`),
  deleteConversation: (id) => API.delete(`/chat/conversations/${id}`),
};

export const ragAPI = {
  query: (data) => API.post('/rag/query', data),
};

export default API;
