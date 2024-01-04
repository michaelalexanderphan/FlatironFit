import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('authToken');
    if (storedUser && storedToken) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setToken(storedToken);
    }
  }, []);

  const login = (userData, authToken) => {
    setUser({
      ...userData,
      role: userData.role 
    });
    setToken(authToken);
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('authToken', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
  };

  const isTokenValid = () => {
    if (!token) return false;

    const decodedToken = decodeToken(token);

    if (!decodedToken) return false;

    return decodedToken.exp * 1000 > Date.now();
  };

  const decodeToken = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded;
    } catch (error) {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isTokenValid, token }}>
      {children}
    </AuthContext.Provider>
  );
};
