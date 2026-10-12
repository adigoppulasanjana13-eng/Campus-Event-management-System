import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cems_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cems_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('cems_token');
      if (storedToken) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          localStorage.setItem('cems_user', JSON.stringify(currentUser));
        } catch (err) {
          console.warn('Session verification failed, logging out:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    const userData = {
      id: res.id,
      name: res.name,
      email: res.email,
      role: res.role,
      department: res.department,
      studentId: res.studentId,
    };
    setUser(userData);
    setToken(res.token);
    localStorage.setItem('cems_token', res.token);
    localStorage.setItem('cems_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    const userData = {
      id: res.id,
      name: res.name,
      email: res.email,
      role: res.role,
      department: res.department,
      studentId: res.studentId,
    };
    setUser(userData);
    setToken(res.token);
    localStorage.setItem('cems_token', res.token);
    localStorage.setItem('cems_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cems_token');
    localStorage.removeItem('cems_user');
  };

  const quickLogin = async (roleType) => {
    if (roleType === 'ADMIN') {
      return await login('admin@campus.edu', 'Admin@123');
    } else {
      return await login('alex.rivera@campus.edu', 'Student@123');
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'ROLE_ADMIN',
    login,
    register,
    logout,
    quickLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
