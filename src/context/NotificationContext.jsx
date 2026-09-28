import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_NOTIFICATIONS } from '../utils/mockData';
import api from '../services/api';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/analytics/notifications');
        if (res.data?.notifications && res.data.notifications.length > 0) {
          setNotifications(res.data.notifications);
        }
      } catch (e) {}
    };
    fetchNotifications();
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = React.useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => {
      // Prevent duplicate messages if already showing
      if (prev.some(t => t.message === message)) {
        return prev;
      }
      // Keep maximum 3 toasts on screen to prevent cluttering
      const trimmed = prev.length >= 3 ? prev.slice(prev.length - 2) : prev;
      return [...trimmed, { id, message, type }];
    });

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const markAsRead = React.useCallback(async (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await api.put(`/analytics/notifications/${id}/read`);
    } catch (e) {}
  }, []);

  const markAllAsRead = React.useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await api.put('/analytics/notifications/all/read');
    } catch (e) {}
  }, []);

  const clearNotifications = React.useCallback(() => {
    setNotifications([]);
  }, []);

  const addNotification = React.useCallback((notif) => {
    const newNotif = {
      id: 'NOT-' + Date.now(),
      time: 'Just now',
      read: false,
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        toasts,
        addToast,
        removeToast,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        addNotification,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
