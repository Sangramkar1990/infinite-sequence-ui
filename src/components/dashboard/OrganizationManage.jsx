import React, { useState, useEffect } from 'react';
import { membershipService } from '../../services/api'; // Import membershipService
import { useSelector } from "react-redux";

export default function OrganizationManage() {
  const [memberships, setMemberships] = useState([]);
  const [loadingMemberships, setLoadingMemberships] = useState(true);
  const [errorMemberships, setErrorMemberships] = useState(null);
  const { user } = useSelector((state) => state.user);
  const [organization, setOrganization] = useState([]);
  // let organization = [];
  useEffect(()=>{
    if(user?.membership){
      console.log("user membership", {membership: user.membership});
      setOrganization(user.membership);
    }

  },[user]);
  

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
  // const [organizations] = useState([
  //   {
  //     id: 1,
  //     name: 'Acme Corporation',
  //     role: 'Admin',
  //     joinedAt: '2024-01-15'
  //   },
  //   {
  //     id: 2,
  //     name: 'Tech Innovations Ltd',
  //     role: 'Team Leader',
  //     joinedAt: '2024-03-22'
  //   },
  //   {
  //     id: 3,
  //     name: 'Global Solutions Inc',
  //     role: 'User',
  //     joinedAt: '2024-06-10'
  //   }
  // ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Manage Organizations
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {organization.length > 0 ? organization.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {org.organization_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        org.role === 'Admin' ? 'bg-blue-100 text-blue-800' :
                        org.role === 'teamleader' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {org.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(org.joined_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                )) : <tr className='w-100 text-center mt-2'></tr>}
              </tbody>
            </table>
          </div>

          {memberships.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No organizations found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}