const API_URL = 'http://localhost:5001/api';

const apiRequest = async (endpoint, method = 'GET', data = null) => {
  const url = `${API_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  
    const response = await fetch(url, options);
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Something went wrong');
    }
    return responseData;
  
};

export const authService = {
  register: (userData) => {
    return apiRequest('/auth/register', 'POST', userData);
  },
  login: (email, password) => {
    return apiRequest('/auth/login', 'POST', { email, password });
  },
  getCurrentUser: () => {
    return apiRequest('/auth/me');
  },
  logout: () => {
    return apiRequest('/auth/logout');
  },
  updatePassword: (oldPassword, newPassword) => {
    return apiRequest('/auth/update-password', 'PUT', { oldPassword, newPassword });
  },
  updateProfile: (profileData) => {
    return apiRequest('/auth/update-profile', 'PUT', profileData);
  },
};

export const organizationService = {
  create: (orgData) => {
    return apiRequest('/organization/create', 'POST', orgData);
  },
};
