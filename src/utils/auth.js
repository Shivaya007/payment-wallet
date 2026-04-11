export const setToken = (token) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token');
export const isAuthenticated = () => !!localStorage.getItem('token');

export const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
export const getUser = () => {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
};
export const isAdmin = () => {
  const user = getUser();
  return user?.role === 'ADMIN';
};
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
