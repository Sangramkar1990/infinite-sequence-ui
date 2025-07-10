import React, { useEffect, useState } from 'react';
import { teamService, membershipSearchService } from '../services/api';

const Teams = ({ organizationId }) => {
  const [teams, setTeams] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

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
    <div>
      <h2>Teams</h2>
      <button onClick={handleCreate}>Create Team</button>
      <ul>
        
        {teams && teams.map(team => (
          <li key={team.id}>
            {team.name} <button onClick={() => handleEdit(team)}>Edit</button>
          </li>
        ))}
      </ul>
      {showCreate && (
        <div className="">
          <h3>{editingTeam ? 'Edit Team' : 'Create Team'}</h3>
          <input
            type="text"
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            placeholder="Team Name"
          />
          <div>
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search members by name or email"
            />
            <ul>
              {searchResults.map(member => (
                <li key={member.id}>
                  {member.name} ({member.email}, {member.role})
                  <button onClick={() => addMember(member)}>Add</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Selected Members</h4>
            <ul>
              {selectedMembers.map(member => (
                <li key={member.id}>
                  {member.name} ({member.email}, {member.role})
                  <button onClick={() => removeMember(member)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setShowCreate(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Teams;
