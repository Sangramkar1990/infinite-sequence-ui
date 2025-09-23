import { useState } from "react";
import { organizationService, authService } from "../../services/api";
import Alert from 'react-bootstrap/Alert';

const Join = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertVariant, setAlertVariant] = useState('success');

  const handleSearch = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.length > 2) { // Only search if more than 2 characters are typed
      try {
        const response = await organizationService.searchOrganizations(value);
        if (response.success && Array.isArray(response.data)) {
          setSearchResults(response.data);
        } else {
          setSearchResults([]);
        }
        // console.log('Search results:', response);
      } catch (error) {
        console.error('Error during organization search:', error);
        setSearchResults([]); // Clear results on error
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleJoinRequest = async (organizationId) => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser || !currentUser.success) {
        setAlertMessage('User not authenticated');
        setAlertVariant('danger');
        return;
      }
      
      const response = await organizationService.createInviteRequest(
        organizationId,
        currentUser.data.id
      );
      
      if (response.success) {
        setAlertMessage('Join request sent successfully!');
        setAlertVariant('success');
        // Update the searchResults to reflect the sent request
        setSearchResults(prevResults =>
          prevResults.map(org =>
            org.id === organizationId ? { ...org, inviteRequest: true } : org
          )
        );
      } else {
        setAlertMessage('Failed to send join request: ' + response.message);
        setAlertVariant('danger');
      }
    } catch (error) {
      setAlertMessage('An error occurred while sending join request');
      setAlertVariant('danger');
      console.error('Error sending join request:', error);
    }
  };

  return (
    <div className="p-4 w-100 d-flex flex-column">
      {alertMessage && (
        <Alert variant={alertVariant} onClose={() => setAlertMessage(null)} dismissible>
          {alertMessage}
        </Alert>
      )}
      
      <input
        type="text"
        placeholder="Search by Organization Name or ID"
        className="w-50 mx-auto p-2 border rounded border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={handleSearch}
      />
      {/* Display search results in a table */}
      <div className="mt-4 mx-auto">
        {searchResults.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Organization Name</th>
                <th className="py-2 px-4 border-b">Organization ID</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{org.name}</td>
                  <td className="py-2 px-4 border-b">{org.public_id || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">
                    {/* Add action buttons here, e.g., Join, View, etc. */}
                    <button 
                      className={`bg-blue-500 text-black px-3 py-1 rounded hover:bg-blue-600`}
                      onClick={() => handleJoinRequest(org.id)}
                      disabled={org.inviteRequest}
                    >
                      { org.inviteRequest ? "Requested" : "Join"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          searchTerm.length > 2 && <p>No organizations found.</p>
        )}
      </div>
    </div>
  );
};

export default Join;
