import api from './api';

export const getAllTransactions = () => api.get('/auth/transactions/all');
