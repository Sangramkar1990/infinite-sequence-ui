import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (response.success) {
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // User is not authenticated, do nothing
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await authService.login(email, password);
      setUser(response.data || { email });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      setError(error.message || 'Invalid credentials');
      return { success: false, error: error.message || 'Invalid credentials' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setError(null);
    try {
      await authService.register(userData);
      return { success: true };
    } catch (error) {
      setError(error.message || 'Registration failed');
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
