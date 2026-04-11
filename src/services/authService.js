import api from './api';

export const login = (data) => api.post('/customers/login', data);
export const signup = (data) => api.post('/customers/signup', data);
export const adminLogin = (data) => api.post('/admin/login', data);
export const getCustomerDetails = () => api.get('/auth/customers/getDetails');
