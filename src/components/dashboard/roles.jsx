import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const RolesPermissionsComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const roles = [
    { name: 'John Doe', badge: 'M', badgeColor: 'success' },
    { name: 'John Doe', badge: 'M', badgeColor: 'danger' }
  ];

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
                {roles.map((role, index) => (
                  <div key={index} className="d-flex align-items-center justify-content-between">
                    <span className="fw-medium">{role.name}</span>
                    <span className={`badge bg-${role.badgeColor} rounded-circle d-flex align-items-center justify-content-center`} 
                          style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                      {role.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Section */}
        <div className="col-md-7">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              {/* User Permissions */}
              <div className="mb-5">
                <h2 className="mb-4 fw-bold">User</h2>
                <div className="d-flex flex-column gap-3">
                  {userPermissions.map((perm) => (
                    <div key={perm.id} className="d-flex align-items-center gap-3">
                      <div className="bg-success rounded d-flex align-items-center justify-content-center" 
                           style={{ width: '28px', height: '28px', minWidth: '28px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="fw-medium">{perm.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Leader Permissions */}
              <div>
                <h2 className="mb-4 fw-bold">Team Leader</h2>
                <div className="d-flex flex-column gap-3">
                  {teamLeaderPermissions.map((perm) => (
                    <div key={perm.id} className="d-flex align-items-center gap-3">
                      <div className="bg-success rounded d-flex align-items-center justify-content-center" 
                           style={{ width: '28px', height: '28px', minWidth: '28px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="fw-medium">{perm.name}</span>
                    </div>
                  ))}
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