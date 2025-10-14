import React from 'react';
import { ArrowRight, User } from 'lucide-react';

const AccountProfileComponent = () => {
  return (
    <div className="bg-light min-vh-100">
      {/* Checkbox Header */}
      <div className="p-4 bg-white border-bottom">
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="dashboardCheck" />
          <label className="form-check-label fw-medium" htmlFor="dashboardCheck">
            Dacbboard
          </label>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold mb-4">Account</h1>
            </div>

            {/* Profile Card */}
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-5">
                <div className="d-flex flex-column align-items-center">
                  {/* Avatar */}
                  <div className="mb-4" style={{ width: '120px', height: '120px' }}>
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center w-100 h-100">
                      <User size={60} className="text-secondary" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* User Info */}
                  <h2 className="fw-bold mb-2">John Doe</h2>
                  <p className="text-muted mb-4">Member</p>

                  {/* Log Out Button */}
                  <button className="btn btn-dark btn-lg px-5 py-3 d-flex align-items-center gap-3 rounded-3">
                    <ArrowRight size={20} />
                    <span className="fw-medium">Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountProfileComponent;