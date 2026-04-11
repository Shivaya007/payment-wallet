
import api from './api';

export const getBeneficiaries = () => api.get('/auth/beneficiary');
export const addBeneficiary = (data) => api.post('/auth/beneficiary', data);
export const deleteBeneficiary = (id) => api.delete(`/auth/beneficiary/${id}`);

export const sendMoneyApi = (mobileNumber, amount) => {
  return api.post(`/auth/beneficiary/mobile/sendMoney/${mobileNumber}`, {
    amount,
    mobileNumber
  });
};
