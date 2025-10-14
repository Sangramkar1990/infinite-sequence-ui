import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Upload } from 'lucide-react';
import { teamService, membershipSearchService, membershipService } from '../../services/api';
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom"; 
const TeamsManagementComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [organization_id, setOrganizationId] = useState(null);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [onSave, setOnSave] = useState(false);
  const [newTeam, setNewTeam] = useState('');

  
  useEffect(() => {
    const fetchOrganizationId = async () => {
      try {
        const response = await membershipService.getMemberships();
        console.log("membership response ----->", response.data[0].organization_id)
        if (response && response.data.length > 0) {
          setOrganizationId(response.data[0].organization_id);
        }
      } catch (error) {
        console.error("Error fetching organization ID:", error);
      }
    };

    fetchOrganizationId();
  }, []);

  useEffect(() => {
    console.log("organization_id ----->", organization_id)
      if (organization_id) fetchTeams();
    }, [organization_id]);

    const fetchTeams = async () => {
        const data = await teamService.getTeamsByOrganization(organization_id);
        console.log("teams data ---- >", data)
        setTeams(data);
      };

      const handleCreate = () => {
    setShowCreate(true);
    setEditingTeam(null);
    setTeamName('');
    setSelectedMembers([]);
  };

  const handleEdit = async (team) => {
      setEditingTeam(team);
      setTeamName(team.name);
      setSearchResults([]);
      // setPageTitle('Edit Team');
      const fullTeam = await teamService.getTeam(team.id);
      console.log("full team ----->", fullTeam);
      setSelectedMembers(fullTeam.members || []);
      setShowCreate(true);
    };
    const createTeamHandle = () => {
      setTeams(team => [...team , {type: "new" }])
    }
    const handleNewTeamSave = async() => {
      console.log('team name ---- >', newTeam);
      await teamService.createTeam({ name: newTeam, organization_id: organization_id});
      fetchTeams();

    }

    const handleSearch = async (e) => {
        
        setSearch(e.target.value);
        
        if (e.target.value.length > 1) {
          const results = await membershipSearchService.search(e.target.value);
          console.log("search results ----->", results)
          setSearchResults(results);
        } else {
          setSearchResults([]);
        }
      };
      const addMember = (member) => {
        console.log("add member ----->", !selectedMembers.find(m => m.id === member.id))
          if ( !selectedMembers.find(m => m.id === member.id)) {
            console.log("member ----->", [...selectedMembers, member])
           
            setSelectedMembers([...selectedMembers, member]);
            setOnSave(true)
          }
        
        };
      
        const removeMember = (member) => {
          setSelectedMembers(selectedMembers.filter(m => m.id !== member.id));
          setOnSave(true)
          
        };

        useEffect(() => {
          if (onSave) {
            handleSave();
          }
        }, [onSave, selectedMembers]);


      
        const handleSave = async () => {
          console.log("selectedMembers ----->", selectedMembers);
          const memberIds = selectedMembers.map(m => m.id);
          console.log("member ids ----->", { name: teamName, memberIds, id: editingTeam.id })
          if (editingTeam) {

            await teamService.updateTeam(editingTeam.id, { name: teamName, memberIds });
             const fullTeam = await teamService.getTeam(editingTeam.id);
             console.log("full team ----->", fullTeam);

             
      
              setSelectedMembers(fullTeam.members || []);
          }
          setSearchResults([]);
          setShowCreate(false);
          setOnSave(false);
          fetchTeams();
        };
  
  // const users = [
  //   { id: 1, name: 'abc', action: 'add' , role: 'admin'},
  //   { id: 2, name: 'Definscoseem llascet', label: 'Defins...' , role: 'user'},
  //   { id: 3, name: 'aara:smottest.cot', status: 'active' , role: 'teamleader'},
  //   { id: 4, name: 'araytinr@acnc.co', status: 'delete', role: 'user' },
  // ];

  return (
    <div className="bg-light min-vh-100 p-4">
      {/* Header */}
      {/* <div className="mb-4">
        <button className="btn btn-link text-dark text-decoration-none p-0 mb-3 d-flex align-items-center gap-2">
          <ArrowLeft size={20} />
          <span className="fw-medium">Search</span>
        </button>
      </div> */}

      {/* Breadcrumb */}
      {/* <div className="mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><a href="#" className="text-decoration-none text-dark">Dashboard</a></li>
            <li className="breadcrumb-item active">Teams</li>
          </ol>
        </nav>
      </div> */}

      {/* Main Container */}
      <div className="row g-4">
        {/* Left Sidebar */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              {/* Organization Section */}
              <div className="mb-4">
                <h5 className="fw-bold mb-3">Teams</h5>

                {teams && teams.map(team => (
                  'type' in team ? (
                    <div className="bg-white border rounded p-3 mb-2">
          <div >
            <div className="flex">
                  <input
                  type="text"
                  className="form-control form-control-lg me-2"
                  placeholder="Enter the name of the new team"
                  value={newTeam}
                  onChange={(e) => setNewTeam(e.target.value)}
                />
            <button className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ms-auto' 
            onClick={() => handleNewTeamSave()}>Save</button>
            </div>
            
          </div>
          </div>
                  ): (
                  <div className="bg-white border rounded p-3 mb-2">
          <div key={team.id}>
            <div className="flex">
                  <h6 className="fw-bold mb-2 text-center">{team.name} </h6> 
            <button className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ms-auto' 
            onClick={() => handleEdit(team)}>Edit</button>
            </div>
            
          </div>
          </div>
                  )
        ))}
               
              </div>

              {/* Teams Section */}
              <div>
                
                <button className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={() => createTeamHandle()}
                >
                  <Plus size={20} />
                  Create Team
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {editingTeam && (
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="fw-bold mb-4">Selected Team : {teamName}</h2>

              {/* Search Section */}
              <div className="mb-4">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => handleSearch(e)}
                />
              </div>

              {/* Username Header */}
             

              {/* User List */}
              <div className="d-flex flex-column gap-3">
                 <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {searchResults && searchResults.map((member) => (
                  <tr key={member.id} className="bg-yellow-50 hover:bg-yellow-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
                        Not Member
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors" 
                             onClick={() => addMember(member)}    >
                            Add
                          </button>
                      
                    </td>
                  </tr>
                ))}
                { selectedMembers && selectedMembers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-yellow-100 text-yellow-800' :
                        user.role === 'teamleader' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors" 
                                 onClick={()=> removeMember(user)}
                                 >
                            Delete
                          </button>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default TeamsManagementComponent;