

import React, { useEffect, useState } from 'react';
import { organizationService } from '../../services/api';
import Alert from 'react-bootstrap/Alert'; // Assuming Bootstrap is set up and Alert component is available

const Request = () => {
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
      const filtered = inviteRequests.filter(request =>
        request.user_email && request.user_email.toLowerCase().includes(searchEmail.toLowerCase())
      );
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

  if (loading) {
    return <div>Loading invite requests...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='p-4 d-flex flex-column'>
      {alertMessage && (
        <Alert variant={alertVariant} onClose={() => setAlertMessage(null)} dismissible>
          {alertMessage}
        </Alert>
        // <p>test</p>
      )}
      <input
        type="text"
        placeholder="Search by User Email"
        value={searchEmail}
        onChange={e => setSearchEmail(e.target.value)}
        className='w-50 mx-auto p-2 border rounded border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
      
      {filteredRequests.length === 0 ? (
        <p>No invite requests found.</p>
      ) : (
        <table className='mt-4'>
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">User Email</th>
              <th className="py-2 px-4 border-b">Requested</th>
              
              <th className="py-2 px-4 border-b w-30 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests && filteredRequests.map(request => (
              <tr key={request.id} className='my-4'>
                <td className="py-2 px-4 border-b">{request.user_email}</td>
                <td className="py-2 px-4 border-b">{new Date(request.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</td>
               
                <td className="py-2 px-4 border-b">
                  {request.status === 1 && ( // Only show buttons if status is pending (assuming 1 is pending)
                    <>
                      <button
                        className="bg-green-500 mx-2 text-black px-3 py-1 rounded mr-2 hover:bg-green-600"
                        onClick={() => handleStatusUpdate(request.id, 2)} // 2 for approved
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 mx-2 text-black px-3 py-1 rounded hover:bg-red-600"
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
  );
};

export default Request;