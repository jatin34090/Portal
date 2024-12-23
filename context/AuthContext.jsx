// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// Create Context
const AuthContext = createContext();

// Custom hook to access auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap around your app and provide auth context
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('token') ? true : false);

  // Example login function
  const login = () => setIsAuthenticated(true);

  // Example logout function
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
