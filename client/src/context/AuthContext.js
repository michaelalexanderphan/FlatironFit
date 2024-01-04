import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Function to decode the JWT token and return the payload
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('authToken');
    if (storedUser && storedToken) {
      const decodedToken = decodeToken(storedToken);
      if (decodedToken) {
        const userData = JSON.parse(storedUser);
        // Ensure the role is set from the decoded token
        userData.role = decodedToken.role || userData.role || 'client';
        setUser(userData);
        setToken(storedToken);
      }
    }
  }, []);

  const login = (userData, authToken) => {
    const decodedToken = decodeToken(authToken);
    if (decodedToken) {
      // Update the user data with the role from the token
      const updatedUserData = {
        ...userData,
        role: decodedToken.role || 'client',
      };
      setUser(updatedUserData);
      setToken(authToken);
      sessionStorage.setItem('user', JSON.stringify(updatedUserData));
      sessionStorage.setItem('authToken', authToken);
    } else {
      // Handle invalid token
      console.error('Invalid token received during login');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.clear(); // Clears all data from sessionStorage
  };

  const isTokenValid = () => {
    if (!token) return false;
    const decodedToken = decodeToken(token);
    // Check if the token is expired
    return decodedToken && decodedToken.exp * 1000 > Date.now();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isTokenValid, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
