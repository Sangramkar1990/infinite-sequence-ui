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
  updateRoles: (userId, data) => {
    return apiRequest(`/memberships/role/${userId}`, 'POST', data);
  },
  getMembershipsByOrganizationId: (organizationId) => {
    return apiRequest(`/memberships/organization/${organizationId}`);
  },
  getAllMembershipByOrganization: () => {
    return apiRequest('/memberships/getMembershipOrg');
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
  getAllCards: () => {
    return apiRequest('/sequences/cards/all');
  },
  searchCards: (query) => {
    return apiRequest(`/sequences/search/cards?query=${encodeURIComponent(query)}`);

  },
   createCard: (cardData) => {
    return apiRequest('/sequences/create-card', 'POST', cardData);
  },
  patchCard: (cardId, cardData) => {
    return apiRequest(`/sequences/card/${cardId}`, 'PATCH', cardData);
  },
  destroyCard: (cardId) => {
    return apiRequest(`/sequences/card/${cardId}`, 'DELETE');
  },

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
  },
  getMySequences: () => {
    return apiRequest('/sequences/user'); 
  },
  deleteSequence: (id) => { // Added deleteSequence method
    return apiRequest(`/sequences/${id}`, 'DELETE');
  },
}

export const flowService = {
  storeFlow: (sequenceId, nodes, edges) => {
    return apiRequest('/sequences/flows', 'POST', { sequenceId, nodes, edges });
  },
  getFlow: (sequenceId) => {
    return apiRequest(`/sequences/flows/${sequenceId}`);
  },
  updateFlow: (sequenceId, nodes, edges) => {
    return apiRequest(`/sequences/flows/${sequenceId}`, 'PUT', { nodes, edges });
  },
};

export const roleService = {
  getAllRoles: () => {
    return apiRequest('/roles');
  },
  getAllPermissions: () => {
    return apiRequest('/permissions');
  },
  getRolePermissions: (roleId) => {
    return apiRequest(`/role-permissions/${roleId}`);
  },
  updateRolePermissions: (roleId, permissions) => {
    return apiRequest(`/role-permissions/${roleId}`, 'PUT', { permissions });
  },
};