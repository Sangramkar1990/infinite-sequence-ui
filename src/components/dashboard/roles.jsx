import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux'; // Import useSelector
import { membershipService, roleService } from '../../services/api'; // Import the services

const RolesPermissionsComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [memberships, setMemberships] = useState([]); // Store memberships
  const [roles, setRoles] = useState([]); // Store unique roles from memberships
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [error, setError] = useState(null);

  // Get organization_id from Redux store
  const {user} = useSelector(state => state.user);
  const organizationId = user?.organization_id;
  useEffect(()=>{
    console.log("members", {user: user.organization_id})
    if(memberships > 0){
      
    }
  }, [user])

  useEffect(() => {
    const fetchMembershipsAndRoles = async () => {
      if (!organizationId) {
        setLoadingRoles(false);
        return;
      }

      try {
        setLoadingRoles(true);
        const response = await membershipService.getMembershipsByOrganizationId(organizationId);
        if (response && response.data) {
          console.log("response data", {data: response.data})
          setMemberships(response.data);

          // Extract unique roles from memberships
          const uniqueRoles = [];
          const roleIds = new Set();
          response.data.forEach(membership => {
            if (membership.role && !roleIds.has(membership.role.id)) {
              uniqueRoles.push(membership.role);
              roleIds.add(membership.role.id);
            }
          });
          setRoles(uniqueRoles);

          if (uniqueRoles.length > 0) {
            setSelectedRole(uniqueRoles[0]); // Select the first unique role by default
          }
        }
      } catch (err) {
        // setError('Failed to fetch memberships or roles.');
        console.error('Error fetching memberships or roles:', err);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchMembershipsAndRoles();
  }, [organizationId]);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (selectedRole) {
        try {
          setLoadingPermissions(true);
          const response = await roleService.getPermissionsForRole(selectedRole.id);
          if (response && response.data) {
            setPermissions(response.data);
          }
        } catch (err) {
          // setError(`Failed to fetch permissions for role ${selectedRole.name}.`);
          console.error(`Error fetching permissions for role ${selectedRole.name}:`, err);
        } finally {
          setLoadingPermissions(false);
        }
      } else {
        setPermissions([]);
      }
    };

    fetchPermissions();
  }, [selectedRole]);
  
  const userPermissions = [
    { id: 1, name: 'can_edit.content', enabled: true },
    { id: 2, name: 'can_create_team', enabled: true },
    { id: 3, name: 'can_view_content', enabled: true }
  ];

  const teamLeaderPermissions = [
    { id: 1, name: 'can_create_team', enabled: true },
    { id: 2, name: 'can_invite_user', enabled: true }
  ];

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="row g-4">
        {/* Roles Section */}
        <div className="col-md-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="mb-4 fw-bold">Roles</h2>
              
              {/* Page Navigation */}
              <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-medium">Page</span>
                  <button className="btn btn-sm btn-light border-0">
                    <ChevronLeft size={16} />
                  </button>
                  <div className="bg-secondary rounded" style={{ width: '30px', height: '4px' }}></div>
                  <button className="btn btn-sm btn-light border-0">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Search Box */}
              <div className="input-group mb-4">
                <input
                  type="text"
                  className="form-control border-end-0"
                  placeholder="username"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="input-group-text bg-white">
                  <Search size={20} className="text-muted" />
                </span>
              </div>

              {/* Role List */}
              <div className="d-flex flex-column gap-3">
                {loadingRoles ? (
                  <div>Loading roles...</div>
                ) : error ? (
                  <div className="text-danger">{error}</div>
                ) : (
                  memberships.map((membership) => (
                    <div
                      key={membership.id}
                      className={`d-flex align-items-center justify-content-between p-2 rounded cursor-pointer ${selectedRole && selectedRole.id === membership.id ? 'bg-primary text-white' : ''}`}
                      onClick={() => setSelectedRole(membership)}
                    >
                      <span className="fw-medium">{membership.user.name}</span>
                      <span className={`badge bg-secondary rounded-circle d-flex align-items-center justify-content-center`}
                            style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                        {membership.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Section */}
        <div className="col-md-7">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              {/* Selected Role Permissions */}
              <div className="mb-5">
                <h2 className="mb-4 fw-bold">{selectedRole ? selectedRole.name : 'Select a Role'} Permissions</h2>
                <div className="d-flex flex-column gap-3">
                  {loadingPermissions ? (
                    <div>Loading permissions...</div>
                  ) : error ? (
                    <div className="text-danger">{error}</div>
                  ) : permissions.length > 0 ? (
                    permissions.map((perm) => (
                      <div key={perm.id} className="d-flex align-items-center gap-3">
                        <div className="bg-success rounded d-flex align-items-center justify-content-center"
                             style={{ width: '28px', height: '28px', minWidth: '28px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="fw-medium">{perm.name}</span>
                      </div>
                    ))
                  ) : (
                    <div>No permissions found for this role.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesPermissionsComponent;