import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();
const LOCAL_ACCOUNTS_STORAGE_KEY = 'saferoad-local-accounts';
const PROFILE_OVERRIDES_KEY = 'saferoad-profile-overrides';

const getProfileOverrides = () => {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_OVERRIDES_KEY) || '{}');
  } catch {
    return {};
  }
};

const mergeProfileOverride = (user) => {
  const savedProfile = getProfileOverrides()[user.id];
  return savedProfile ? { ...user, ...savedProfile } : user;
};

const DEMO_ACCOUNTS = {
  'alex.morgan@saferoad.ai': {
    password: 'password123',
    user: {
      id: 'USR-DEFAULT',
      name: 'Alex Morgan',
      email: 'alex.morgan@saferoad.ai',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    token: 'mock-jwt-token-saferoad-ai-2026',
  },
  'garv@saferoad.ai': {
    password: 'garv@admin2026',
    user: {
      id: 'USR-3',
      name: 'Garv Patel',
      email: 'garv@saferoad.ai',
      role: 'admin',
      status: 'Active',
      reports_submitted: 127,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    token: 'mock-jwt-token-safe-road-admin-garv-2026',
  },
  'mihir@saferoad.ai': {
    password: 'mihir@admin2026',
    user: {
      id: 'USR-4',
      name: 'Mihir Shah',
      email: 'mihir@saferoad.ai',
      role: 'admin',
      status: 'Active',
      reports_submitted: 98,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
    token: 'mock-jwt-token-safe-road-admin-mihir-2026',
  },
};

const getDemoUser = (email, password) => {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const demoUser = DEMO_ACCOUNTS[normalizedEmail];
  if (demoUser && password === demoUser.password) return demoUser;

  // Accounts created through this demo are also available while offline.
  try {
    const localAccounts = JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS_STORAGE_KEY) || '{}');
    const localAccount = localAccounts[normalizedEmail];
    return localAccount?.password === password ? localAccount : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {
      id: 'USR-DEFAULT',
      name: 'Alex Morgan',
      email: 'alex.morgan@saferoad.ai',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      token: 'mock-jwt-token-saferoad-ai-2026'
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('token'));
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
    const demoUser = getDemoUser(email, password);
    if (demoUser) {
      const completeUser = mergeProfileOverride({ ...demoUser.user, token: demoUser.token });
      setUser(completeUser);
      setIsAuthenticated(true);
      return completeUser;
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: loggedUser, token } = response.data;
      const completeUser = mergeProfileOverride({ ...loggedUser, token });
      setUser(completeUser);
      setIsAuthenticated(true);
      return completeUser;
    } catch (err) {
      throw new Error('Account not found or password is incorrect. Please register first if this is your first visit.');
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

  const register = (name, email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const mockUser = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      name: name,
      email: normalizedEmail,
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      token: 'jwt-registered-token-saferoad'
    };
    const localAccounts = JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS_STORAGE_KEY) || '{}');
    localAccounts[normalizedEmail] = {
      password,
      user: mockUser,
      token: mockUser.token,
    };
    localStorage.setItem(LOCAL_ACCOUNTS_STORAGE_KEY, JSON.stringify(localAccounts));
    setUser(mockUser);
    setIsAuthenticated(true);
    return mockUser;
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

    if (!user?.id) return;

    // Keep only editable profile fields. Authentication and role data always
    // continue to come from the authenticated account.
    const profileUpdates = Object.fromEntries(
      Object.entries(updatedData).filter(([key]) => ['name', 'email', 'avatar'].includes(key))
    );
    try {
      const overrides = getProfileOverrides();
      localStorage.setItem(
        PROFILE_OVERRIDES_KEY,
        JSON.stringify({
          ...overrides,
          [user.id]: { ...overrides[user.id], ...profileUpdates },
        })
      );
    } catch (error) {
      console.warn('Could not persist profile changes locally:', error);
    }
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
