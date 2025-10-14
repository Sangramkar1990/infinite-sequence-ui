import React, { useState, useEffect } from 'react';
import { organizationService } from '../../services/api';
import Alert from 'react-bootstrap/Alert'; 
export default function OrganizationRequest() {
  const [inviteRequests, setInviteRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchEmail, setSearchEmail] = useState('');
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertVariant, setAlertVariant] = useState('success');
  
    const fetchInviteRequests = async () => {
      try {
        const data = await organizationService.getInviteRequestsByUser(); // Assuming this fetches requests for the current organization
        setInviteRequests(data.data);
        setFilteredRequests(data.data);
      } catch (err) {
        setError('Failed to fetch invite requests.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchInviteRequests();
    }, []);
  
    useEffect(() => {
      if (searchEmail.trim() === '') {
        setFilteredRequests(inviteRequests);
      } else {
        const filtered = Array.isArray(inviteRequests) ? inviteRequests.filter(request =>
          request.user_email && request.user_email.toLowerCase().includes(searchEmail.toLowerCase())
        ) : [];
        setFilteredRequests(filtered);
      }
    }, [searchEmail, inviteRequests]);
  
    const handleStatusUpdate = async (requestId, status) => {
      try {
        const response = await organizationService.updateInviteRequestStatus(requestId, status);
        if (response.success) {
          setAlertMessage(`Request ${status === 2 ? 'approved' : 'denied'} successfully!`);
          setAlertVariant('success');
          fetchInviteRequests(); // Re-fetch requests to update the list
        } else {
          setAlertMessage(`Failed to ${status === 2 ? 'approve' : 'deny'} request: ${response.message}`);
          setAlertVariant('danger');
        }
      } catch (err) {
        setAlertMessage(`An error occurred while updating request status.`);
        setAlertVariant('danger');
        console.error(err);
      }
    };
  // const [searchTerm, setSearchTerm] = useState('');
  // const [requests, setRequests] = useState([
  //   {
  //     id: 1,
  //     userEmail: 'john.doe@example.com',
  //     requested: '2024-10-10'
  //   },
  //   {
  //     id: 2,
  //     userEmail: 'jane.smith@example.com',
  //     requested: '2024-10-11'
  //   },
  //   {
  //     id: 3,
  //     userEmail: 'mike.wilson@example.com',
  //     requested: '2024-10-12'
  //   }
  // ]);

  // const handleAccept = (id) => {
  //   console.log('Accepting request with ID:', id);
  //   // Handle accept logic here
  //   setRequests(requests.filter(req => req.id !== id));
  // };

  // const filteredRequests = requests.filter(req =>
  //   req.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Organization Requests
          </h2>
          
          <div className="mb-6">
            {alertMessage && (
        <Alert variant={alertVariant} onClose={() => setAlertMessage(null)} dismissible>
          {alertMessage}
        </Alert>
      )}
            <input
              type="text"
              placeholder="Search by email..."
              value={searchEmail}
        onChange={e => setSearchEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="overflow-x-auto">
             {filteredRequests.length === 0 ? (
        <p>No invite requests found.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                { filteredRequests && filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.user_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(request.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {request.status === 1 && (  

                        <>
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        onClick={() => handleStatusUpdate(request.id, 2)} // 2 for approved
                      >
                        Approve
                      </button>
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        onClick={() => handleStatusUpdate(request.id, 3)} // 3 for denied
                      >
                        Deny
                      </button>
                    </>
                      )}
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
       )}
            
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No requests found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}