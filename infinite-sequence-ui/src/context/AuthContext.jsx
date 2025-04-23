import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login function (placeholder)
  const login = (email, password) => {
    // This would typically make an API call to authenticate
    // For now, we'll just simulate a successful login
    setUser({ email });
    setIsAuthenticated(true);
    return true;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  // Register function (placeholder)
  const register = (userData) => {
    // This would typically make an API call to register a new user
    // For now, we'll just simulate a successful registration
    return true;
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
