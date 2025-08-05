import React, { useState, useEffect } from "react";
import { membershipService } from '../../services/api'; // Import membershipService

const handleCopy = (text, setCopied) => {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset "Copied" text after 2 seconds
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
};

const Manage = ({ organizationId = false, inviteLink = false }) => {
  // console.log("test manage")
  const [copiedOrgId, setCopiedOrgId] = useState(false);
  const [copiedInviteLink, setCopiedInviteLink] = useState(false);
  const [memberships, setMemberships] = useState([]);
  const [loadingMemberships, setLoadingMemberships] = useState(true);
  const [errorMemberships, setErrorMemberships] = useState(null);

  useEffect(() => {
    //  console.log("fetching memebers")
    const fetchMemberships = async () => {
      try {
       
        const response = await membershipService.getMemberships();
        if (response.success) {
          setMemberships(response.data);
        } else {
          setErrorMemberships(response.message || 'Failed to fetch memberships');
        }
      } catch (error) {
        console.error('Error fetching memberships:', error);
        setErrorMemberships('Error fetching memberships');
      } finally {
        setLoadingMemberships(false);
      }
    };

    fetchMemberships();
  }, []);

  return (
    <div>
      <div className="d-flex align-items-center">
        {/* <div>
          <label htmlFor="organizationId" className="form-label d-block">Organization ID</label>
          <label htmlFor="inviteLink" className="form-label d-block">Invite Link</label>
        </div> */}

        <div>
          <div className="mb-3 ">
            
            {/* <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="organizationId"
                value={organizationId}
                disabled
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => handleCopy(organizationId, setCopiedOrgId)}
              >
                {copiedOrgId ? 'Copied!' : 'Copy'}
              </button>
            </div> */}
          </div>
          {/* <div className="mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="inviteLink"
                value={inviteLink}
                disabled
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => handleCopy(inviteLink, setCopiedInviteLink)}
              >
                {copiedInviteLink ? 'Copied!' : 'Copy'}
              </button>
            </div> */}
          {/* </div> */}
        </div>
      </div>

      <h4 className="mt-4">Your Memberships</h4>
      {loadingMemberships ? (
        <p>Loading memberships...</p>
      ) : errorMemberships ? (
        <p className="text-danger">Error: {errorMemberships}</p>
      ) : memberships.length > 0 ? (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Organization Name</th>
              <th>Role</th>
              <th>Joined At</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map((membership) => (
              <tr key={membership.id}>
                <td>{membership.organization_name || 'N/A'}</td>
                <td>{membership.role}</td>
                <td>{new Date(membership.joined_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</td>
                {/* <td>{new Date(membership.created_at).toLocaleDateString()}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No memberships found.</p>
      )}
    </div>
  );
};

export default Manage;