import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', user.token || 'mock-jwt-token-saferoad-ai-2026');
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user]);

  const login = async (email, password, rememberMe = true) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: loggedUser, token } = response.data;
      const completeUser = { ...loggedUser, token };
      setUser(completeUser);
      setIsAuthenticated(true);
      return completeUser;
    } catch (err) {
      // Propagate the real error — no mock fallback
      const message =
        err?.response?.data?.error || err.message || 'Login failed. Please check your credentials.';
      throw new Error(message);
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { user: registeredUser, token } = response.data;
      const completeUser = { ...registeredUser, token };
      setUser(completeUser);
      setIsAuthenticated(true);
      return completeUser;
    } catch (err) {
      // Propagate the real error — no mock fallback
      const message =
        err?.response?.data?.error || err.message || 'Registration failed. Please try again.';
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const toggleRole = () => {
    setUser(prev => ({
      ...prev,
      role: prev?.role === 'admin' ? 'user' : 'admin'
    }));
  };

  const updateUserProfile = (updatedData) => {
    setUser(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        toggleRole,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
