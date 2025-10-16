import TechniqueBreakdown from "../components/dashboard/TechniqueBreakdown";

const API_URL = 'http://localhost:5001/api';

const apiRequest = async (endpoint, method = 'GET', data = null) => {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    credentials: 'include',
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  const response = await fetch(url, options);
  const statusCode = response.status;
  const responseData = await response.json();

  // console.log("response data", {responseData});
  
  return responseData;
  
};

export const userService = {
  statistics: () => {
    return apiRequest('/users/statistics');
  },
  techniqueBreakdown: () => {
    return apiRequest('/users/techniques/breakdown');
  }
}

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
  checkOrganizationName: (organizationName) => {
    return apiRequest(`/organization/check-name?name=${encodeURIComponent(organizationName)}`);
  },
  searchOrganizations: (searchTerm) => {
    return apiRequest(`/organization/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  },
  createInviteRequest: (organizationId, userId) => {
    return apiRequest('/invites', 'POST', { organizationId, userId });
  },
  getInviteRequestsByUser: () => {
    return apiRequest('/invites/user');
  },
  updateInviteRequestStatus: (id, status) => {
    // console.log("id", {id});
    return apiRequest(`/invites/${id}/status`, 'PUT', { status });
  }
};

export const membershipService = {
  getMemberships: () => {
    return apiRequest('/memberships/me');
  },
  getAllMemberships: () => {
    return apiRequest('/memberships');
  },
  updateRoles: (organizationId, updates) => {
    return apiRequest('/memberships/role', 'POST', { organizationId, updates });
  },
};

export const teamService = {
  getTeamsByOrganization: (organization_id) => {
    return apiRequest(`/teams/organization/${organization_id}`);
  },
  getTeam: (id) => {
    return apiRequest(`/teams/${id}`);
  },
  createTeam: (data) => {
    return apiRequest('/teams', 'POST', data);
  },
  updateTeam: (id, data) => {
    return apiRequest(`/teams/${id}`, 'PUT', data);
  },
};

export const membershipSearchService = {
  search: (query) => {
    return apiRequest(`/memberships/search?query=${encodeURIComponent(query)}`);
  },
};

export const shareService = {
  createShare: (data) => {
    return apiRequest('/shares', 'POST', data);
  },
  updateShare: (sequence_id, data) => {
    return apiRequest(`/shares/${sequence_id}`, 'PUT', data);
  },
  getShareBySequenceId: (sequence_id) => {
    return apiRequest(`/shares/${sequence_id}`);
  },
};

export const cardService = {
  getCardsByUser: () => {
    return apiRequest('/sequences/cards/user');
  },
  searchCards: (query) => {
    return apiRequest(`/sequences/search/cards?query=${encodeURIComponent(query)}`);
  }

};

export const sequenceService = {
  //pending apply RBAC
  getAllSequences: () => {
    return apiRequest('/sequences');
  },
  getSequenceWithId: (id) => {
    return apiRequest(`/sequences/${id}`);
  },
  getFullSequences: () => {
    return apiRequest('/sequences/full');
  },
  updateSequence: (id, data) => {
    return apiRequest(`/sequences/${id}`, 'PUT', data);
  }

}