import api from './api';

export const getBankAccounts = () => api.get('/auth/bank-accounts');
export const addBankAccount = (data) => api.post('/auth/bank-accounts', data);
export const transferToWallet = (accountId, data) => api.post(`/auth/bank-accounts/${accountId}/transfer`, data);
