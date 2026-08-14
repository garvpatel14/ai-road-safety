import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {
      id: 'USR-DEFAULT',
      name: 'Alex Morgan',
      email: 'alex.morgan@saferoad.ai',
      role: 'user', // 'user' or 'admin'
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      token: 'mock-jwt-token-saferoad-ai-2026'
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token') || true; // Default logged in for smooth demo experience
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
      console.warn('Backend login fallback:', err.message);
      const mockUser = {
        id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email,
        role: email.includes('admin') ? 'admin' : 'user',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        token: 'jwt-token-saferoad-' + Date.now()
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      return mockUser;
    }
  };

  const googleLogin = () => {
    const mockUser = {
      id: 'USR-G-8821',
      name: 'Alex Morgan',
      email: 'alex.morgan.google@saferoad.ai',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      token: 'google-oauth2-jwt-token-saferoad'
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    return mockUser;
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
      console.warn('Backend register fallback:', err.message);
      const mockUser = {
        id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
        name: name,
        email: email,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        token: 'jwt-registered-token-saferoad'
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      return mockUser;
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
        googleLogin,
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
