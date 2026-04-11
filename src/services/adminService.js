import api from './api';

export const adminLogin = (data) => api.post('/admin/login', data);
export const getAdminDashboard = () => api.get('/admin/dashboard');
export const getAllCustomers = () => api.get('/admin/customers');
export const getAllWallets = () => api.get('/admin/wallets');
export const getAllTransactions = (params = {}) => api.get('/admin/transactions', { params });
export const getAllBeneficiaries = () => api.get('/admin/beneficiaries');
export const blockCustomer = (id) => api.put(`/admin/blockCustomer/${id}`);
export const deleteCustomer = (id) => api.delete(`/admin/customer/${id}`);
