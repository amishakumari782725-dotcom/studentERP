import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('studenthub_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('studenthub_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem('studenthub_token');
      if (savedToken) {
        try {
          const profile = await authService.getProfile();
          if (profile?.data) {
            setUser(profile.data);
            localStorage.setItem('studenthub_user', JSON.stringify(profile.data));
          }
        } catch (err) {
          console.error('[AuthContext] Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    if (response?.data?.token) {
      localStorage.setItem('studenthub_token', response.data.token);
      localStorage.setItem('studenthub_user', JSON.stringify(response.data));
      setToken(response.data.token);
      setUser(response.data);
      return response.data;
    }
    throw new Error(response.message || 'Authentication failed');
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    if (response?.data?.token) {
      localStorage.setItem('studenthub_token', response.data.token);
      localStorage.setItem('studenthub_user', JSON.stringify(response.data));
      setToken(response.data.token);
      setUser(response.data);
      return response.data;
    }
    return response;
  };

  const logout = () => {
    localStorage.removeItem('studenthub_token');
    localStorage.removeItem('studenthub_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('studenthub_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
