import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login, signup, adminLogin, getCustomerDetails } from '../services/authService';
import { setToken, getToken, removeToken, setUser, getUser } from '../utils/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(getUser());
  const [token, setTokenState] = useState(getToken());
  const [isLoading, setIsLoading] = useState(!!getToken());

  const refreshUser = useCallback(async () => {
    try {
      const data = await getCustomerDetails();
      setUserState(data.data);
      setUser(data.data);
    } catch {
      setUserState(null);
      setTokenState(null);
      removeToken();
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    if (user?.role === 'ADMIN') {
      setIsLoading(false);
      return;
    }

    refreshUser().finally(() => setIsLoading(false));
  }, [token, refreshUser, user?.role]);

  const handleLogin = async (email, pwd) => {
    const res = await login({ email, pwd });
    const customer = res.data.customer || { name: email, role: 'CUSTOMER' };
    setToken(res.data.token);
    setTokenState(res.data.token);
    setUserState(customer);
    setUser(customer);
  };

  const handleAdminLogin = async (username, pwd) => {
    const res = await adminLogin({ username, pwd });
    const admin = res.data.admin || { name: 'Admin', role: 'ADMIN' };
    setToken(res.data.token);
    setTokenState(res.data.token);
    setUserState(admin);
    setUser(admin);
  };

  const handleSignup = async (data) => {
    const res = await signup(data);
    setToken(res.data.token);
    setTokenState(res.data.token);
    setUserState(res.data.customer || { name: data.email });
    setUser(res.data.customer || { name: data.email });
  };

  const handleLogout = () => {
    removeToken();
    setTokenState(null);
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login: handleLogin,
      adminLogin: handleAdminLogin,
      signup: handleSignup,
      logout: handleLogout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};