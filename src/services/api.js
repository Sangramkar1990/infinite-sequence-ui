/**
 * API service for making HTTP requests to the backend
 */

const API_URL = 'http://localhost:5000/api';

/**
 * Make a request to the API
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {object} data - Request data
 * @returns {Promise} - Response data
 */
const apiRequest = async (endpoint, method = 'GET', data = null) => {
  const url = `${API_URL}${endpoint}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for authentication
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Something went wrong');
    }
    
    return responseData;
  } catch (error) {
    throw error;
  }
};

/**
 * Authentication service
 */
export const authService = {
  /**
   * Register a new user
   * @param {object} userData - User data
   * @returns {Promise} - Response data
   */
  register: (userData) => {
    return apiRequest('/auth/register', 'POST', userData);
  },
  
  /**
   * Login a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Response data
   */
  login: (email, password) => {
    return apiRequest('/auth/login', 'POST', { email, password });
  },
  
  /**
   * Get current user
   * @returns {Promise} - Response data
   */
  getCurrentUser: () => {
    return apiRequest('/auth/me');
  },
  
  /**
   * Logout user
   * @returns {Promise} - Response data
   */
  logout: () => {
    return apiRequest('/auth/logout');
  }
};
