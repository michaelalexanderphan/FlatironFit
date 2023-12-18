import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const storedAuthToken = sessionStorage.getItem('authToken');
    if (storedUser && storedAuthToken) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setAuthToken(storedAuthToken);
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setAuthToken(token);
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('authToken', token);
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
