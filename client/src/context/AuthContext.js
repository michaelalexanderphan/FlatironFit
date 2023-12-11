import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData, token) => {
    setUser(userData);
    sessionStorage.setItem('authToken', token); // Storing the token in sessionStorage
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('authToken'); // Clearing the token on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
