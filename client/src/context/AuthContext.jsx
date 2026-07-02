import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://interview-tracking.onrender.com/api');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    _id: '000000000000000000000001',
    username: 'Personal User',
    email: 'personal@example.com'
  });
  const [token, setToken] = useState('personal-token');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Persistent single-user mode
    setLoading(false);
  }, []);

  const register = async (username, email, password) => {
    setError(null);
    return true;
  };

  const login = async (email, password) => {
    setError(null);
    return true;
  };

  const logout = () => {
    // No-op in personal mode
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        setError,
        login,
        register,
        logout,
        API_URL
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
