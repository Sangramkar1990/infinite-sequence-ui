import React, { useState } from 'react';
import { organizationService, authService } from "../../services/api";
import Alert from 'react-bootstrap/Alert';

export default function OrganizationJoin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertVariant, setAlertVariant] = useState('success'); 
  // const [searchTerm, setSearchTerm] = useState('');
  // const [organizations] = useState([
  //   {
  //     id: 'ORG-001',
  //     name: 'Digital Ventures Group',
  //     organizationId: 'ORG-001'
  //   },
  //   {
  //     id: 'ORG-002',
  //     name: 'Innovation Hub Technologies',
  //     organizationId: 'ORG-002'
  //   },
  //   {
  //     id: 'ORG-003',
  //     name: 'Future Systems Inc',
  //     organizationId: 'ORG-003'
  //   },
  //   {
  //     id: 'ORG-004',
  //     name: 'Creative Solutions Co',
  //     organizationId: 'ORG-004'
  //   }
  // ]);

  // const handleJoin = (id) => {
  //   console.log('Requesting to join organization with ID:', id);
  //   // Handle join request logic here
  // };

  // const filteredOrganizations = organizations.filter(org =>
  //   org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   org.organizationId.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const handleSearch = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.length > 2) { 
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Join Organization
          </h2>
          
          <div className="mb-6">
            {alertMessage && (
        <Alert variant={alertVariant} onClose={() => setAlertMessage(null)} dismissible>
          {alertMessage}
        </Alert>
      )}
            <input
              type="text"
              placeholder="Search organizations by name or ID..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {searchResults.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {org.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {org.public_id || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleJoinRequest(org.id)}
                      disabled={org.inviteRequest}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        { org.inviteRequest ? "Requested" : "Join"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {searchResults.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No organizations found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}