import React, { useEffect, useState } from 'react';
import { teamService, membershipSearchService } from '../services/api';
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom"; 

const Teams = ({ organizationId }) => {
  //checking
  const [teams, setTeams] = useState([]);
   const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [pageTitle, setPageTitle] = useState('Teams')

  useEffect(() => {
    if (organizationId) fetchTeams();
  }, [organizationId]);

  const fetchTeams = async () => {
    const data = await teamService.getTeamsByOrganization(organizationId);
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
    setPageTitle('Edit Team');
    const fullTeam = await teamService.getTeam(team.id);
    setSelectedMembers(fullTeam.members || []);
    setShowCreate(true);
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    if (e.target.value.length > 1) {
      const results = await membershipSearchService.search(e.target.value);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const addMember = (member) => {
    if (!selectedMembers.find(m => m.id === member.id)) {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const removeMember = (member) => {
    setSelectedMembers(selectedMembers.filter(m => m.id !== member.id));
  };

  const handleSave = async () => {
    const memberIds = selectedMembers.map(m => m.id);
    if (editingTeam) {
      await teamService.updateTeam(editingTeam.id, { name: teamName, memberIds });
    } else {
      await teamService.createTeam({ name: teamName, organization_id: organizationId, memberIds });
    }
    setShowCreate(false);
    fetchTeams();
  };

  return (
    <div className='p-4 m-5 d-flex flex-column'>
      <h1>{pageTitle}</h1>

      {teams && <h5 className='ms-5 ps-5 mt-4'>View all teams</h5>}

     
      <ul className='roles-list mx-auto'>
        
        {teams && teams.map(team => (
          <li key={team.id}>
            {team.name} <button className='btn btn-secondary btn-sm ms-5' onClick={() => handleEdit(team)}>Edit</button>
          </li>
        ))}
      </ul>
      {showCreate && (
        <div className="d-flex flex-column align-items-center">
         <div className='my-4'>
          <label className='mx-3'>Team Name </label>

          <input
            type="text"
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            placeholder="Team Name"
            className="w-50 mx-auto p-2 border rounded border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
         </div>
          
          <div>
            <div className="d-flex align-items-center">
               <label className='mx-3'>Team Member </label>
              <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search members by name or email"
              className="w-50 mx-auto p-2 border rounded border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>
            <ul  className='roles-list my-4 py-3'>
              {searchResults.map(member => (
                <li key={member.id}>
                  <div className='d-flex align-items-center '>
                    <CgProfile style={{color: "black", width: "3rem", height: "3rem" }}/>
                    <div className='mx-3'>
                      <p className='roles-list-para'>{member.name} </p>
                      <p className='roles-list-para'>{member.email}</p>

                    </div>
                    
                    <input
                    type="text"
                    value={member.role}
            
                    placeholder="Team Name"
                    className="w-30 mx-2 p-2 border rounded border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                    />

                  
                  <button className='btn btn-outline-primary' onClick={() => addMember(member)}>Add</button>
                  </div>
                  
                  
                 
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Selected Members</h4>
            <ul className='roles-list my-4 py-3'>
              {selectedMembers.map(member => (
                <li key={member.id}>
                  <div className='d-flex align-items-center '>
                    <CgProfile style={{color: "black", width: "3rem", height: "3rem" }}/>
                    <div className='mx-3'>
                      <p className='roles-list-para'>{member.name} </p>
                      <p className='roles-list-para'>{member.email}</p>

                    </div>
                    
                    <input
                    type="text"
                    value={member.role}
            
                    placeholder="Team Name"
                    className="w-30 mx-2 p-2 border rounded border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                    />

                  
                   <button className='btn btn-outline-danger' onClick={() => removeMember(member)}>Remove</button>
                  </div>
                  
                 
                </li>
              ))}
            </ul>
          </div>
         
        </div>
      )}
      {showCreate ? 
      <div className='d-flex'>
         <button className='btn btn-secondary ms-auto' onClick={() => setShowCreate(false)}>Cancel</button>
         <button className='btn btn-primary mx-2' onClick={handleSave}>Save</button>
         
      </div> 
      : 
      <div className='d-flex'>
        
         <button className='btn btn-secondary ms-auto' onClick={()=> navigate("/flow-editor")}>Cancel</button>
         <button className='btn btn-primary mx-2' onClick={handleCreate}>Create Team +</button>
      </div>
      }
       
    </div>
  );
};

export default Teams;
