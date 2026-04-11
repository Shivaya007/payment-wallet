import api from './api';

export const getBankAccounts = () => api.get('/auth/bankAccount');
export const addBankAccount = (data) => api.post('/auth/bankAccount/add', data);
export const transferToWallet = (accountId, amount) => api.post(`/auth/bankAccount/transferToWallet/${accountId}?amount=${amount}`);
