import React, { useState } from 'react';

const CreateOrganization = () => {
  const [organizationName, setOrganizationName] = useState('');
  const [emails, setEmails] = useState('');

  const handleCreateOrganization = () => {
    // Logic to handle organization creation
    console.log('Organization Name:', organizationName);
    console.log('Emails:', emails.split(','));
  };

  return (
    <div className="container mt-4">
      <h2>Create Organization</h2>
      <div className="mb-3">
        <label htmlFor="organizationName" className="form-label">Organization Name</label>
        <input
          type="text"
          className="form-control"
          id="organizationName"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="inviteEmails" className="form-label">Invite Users (comma-separated emails)</label>
        <input
          type="text"
          className="form-control"
          id="inviteEmails"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={handleCreateOrganization}>Create Organization</button>
    </div>
  );
};

export default CreateOrganization;