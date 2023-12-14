import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData, token) => {
    setUser(userData);
    sessionStorage.setItem('authToken', token);
    console.log('User logged in:', userData); // Add this line
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('authToken');
    console.log('User logged out'); // Add this line
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
