import api from './api';

export const payBill = (data) => api.post('/auth/bills/pay', data);
export const getBillHistory = () => api.get('/auth/bills/history');
