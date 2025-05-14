import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate

const CreateOrganization = () => {
  const [organizationName, setOrganizationName] = useState('');
  const [emails, setEmails] = useState('');
  const [userId, setUserId] = useState(''); // userId will be needed for the context call
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { createOrganization, logout, error: authError, loading: authLoading } = useAuth(); // Get createOrganization and logout from context
  const navigate = useNavigate(); // Initialize navigate
  const location = useLocation(); // Get location object

  useEffect(() => {
    // Attempt to retrieve userId from URL query parameters.
    const queryParams = new URLSearchParams(location.search);
    const userIdFromQuery = queryParams.get('userId');

    if (userIdFromQuery) {
      setUserId(userIdFromQuery);
    } else {
      console.warn('CreateOrganization: userId not found in URL query parameters. Ensure it is passed (e.g., ?userId=xxxx).');
      // setError('User ID not found in URL. Please ensure the link is correct or register again.');
    }
  }, [location.search]); // Re-run effect if location.search changes

  const handleCreateOrganization = async () => {
    setError('');
    setSuccess('');

    if (!organizationName.trim()) {
      setError('Organization name is required.');
      return;
    }
    if (!emails.trim()) {
      setError('At least one email is required for invitation.');
      return;
    }
    if (!userId) {
      setError('User ID not available. Cannot create organization. Please check the URL or try registering again.');
      return;
    }

    setLoading(true);

    try {
      // orgData should match what organizationService.create expects,
      // which is passed through AuthContext's createOrganization.
      // The backend controller expects organizationName, emails, and userId.
      const orgData = {
        organizationName,
        emails, // Send emails as a comma-separated string
        userId,
      };

      const result = await createOrganization(orgData); // Use context function
      setLoading(false);

      if (result.success) {
        setSuccess(result.data?.message || 'Organization created successfully! Please log in.');
        setOrganizationName(''); // Clear form on success
        setEmails('');
        
        // Logout the user and redirect to login page
        await logout(); // Call logout from AuthContext
        navigate('/login'); // Redirect to login page
      } else {
        setError(result.error || 'Failed to create organization. Please try again.');
      }
    } catch (err) {
      // This catch block might be redundant if AuthContext's createOrganization handles errors
      // and returns them in the result object. However, it's good for unexpected issues.
      setLoading(false);
      setError(err.message || 'An error occurred while creating the organization.');
    }
  };

  // Update loading and error states based on AuthContext if needed
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <div className="container mt-4">
      <h2>Create Organization</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="mb-3">
        <label htmlFor="organizationName" className="form-label">Organization Name</label>
        <input
          type="text"
          className="form-control"
          id="organizationName"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          disabled={loading || authLoading}
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
          disabled={loading || authLoading}
        />
      </div>
      <button className="btn btn-primary" onClick={handleCreateOrganization} disabled={loading || authLoading}>
        {loading || authLoading ? 'Creating...' : 'Create Organization'}
      </button>
    </div>
  );
};

export default CreateOrganization;