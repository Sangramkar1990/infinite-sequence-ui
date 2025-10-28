import { createContext, useState, useContext, useEffect } from 'react';
import { authService, organizationService } from '../services/api';
import { useDispatch } from 'react-redux';
import {fetchCurrentUser} from '../store/userSlice.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("dispatch", {dispatch});
  const token = localStorage.getItem("token"); 


  // Check if user is already logged in
  useEffect(() => {
    // or sessionStorage, cookie, etc.

  if (!token) {
    setLoading(false);
    return;
  }
    const checkAuthStatus = async () => {
      
      try {
        dispatch(fetchCurrentUser());
      } catch (error) {
        // User is not authenticated, do nothing
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [dispatch, token]);

  // Login function
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await authService.login(email, password);
      if (!response.success) return {success:false};
      
      setUser(response.data || { email });
      setIsAuthenticated(true);
      if (response.token) {
        localStorage.setItem('token', response.token); // Store token in localStorage
      }


      

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
      localStorage.removeItem('token'); // <--- Add this line to remove the token
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setError(null);
    try {
      return await authService.register(userData);
      // console.log("registerResponse", {registerResponse});
      // // Check for redirectTo in response
      // if ( registerResponse.redirectTo === 'create-organization') {
      //   return  {  redirect: true, userId:  registerResponse.userId};
      // }
      // console.log(registerResponse)
      // return { success: true };
    } catch (error) {
      setError(error.message || 'Registration failed');
      console.log("error :", {error})
      // Pass the full error object from the backend
      return { success: false, error: error.message || 'Registration failed', backendError: error };
    }
  };

  // Organization creation function
  const createOrganization = async (orgData) => {
    setError(null);
    try {
      const response = await organizationService.create(orgData);
      return { success: true, data: response.data };
    } catch (error) {
      setError(error.message || 'Organization creation failed');
      return { success: false, error: error.message || 'Organization creation failed' };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    register,
    createOrganization // <-- Add this to context
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};