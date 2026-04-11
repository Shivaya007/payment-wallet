import api from './api';

export const payBill = (data) => api.post('/auth/billPayments/create', data);
export const getBillHistory = () => api.get('/auth/billPayments/getAll');
