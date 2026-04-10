import api from './api';

export const getWallet = () => api.get('/auth/wallets');
export const creditWallet = (walletId, data) => api.post(`/auth/wallets/${walletId}/credit`, data);
export const debitWallet = (walletId, data) => api.post(`/auth/wallets/${walletId}/debit`, data);
