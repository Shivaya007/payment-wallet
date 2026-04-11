import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login, signup, getCustomerDetails } from '../services/authService';
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
    if (token) {
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token, refreshUser]);

  const handleLogin = async (email, pwd) => {
    const res = await login({ email, pwd });
    setToken(res.data.token);
    setTokenState(res.data.token);
    setUserState(res.data.customer || { name: email });
    setUser(res.data.customer || { name: email });
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
      signup: handleSignup,
      logout: handleLogout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};