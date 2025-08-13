import React, { useState } from 'react';
import { useSelector } from 'react-redux';
// import './ShareSequenceForm.css'; // Optional: for styling

const teams = [
  'Error Loading Teams',
  
];

const ShareSequenceForm = () => {
  const [sequenceName, setSequenceName] = useState('');
  const [entireOrg, setEntireOrg] = useState(true);
  const [teamIds, setTeamIds] = useState([]);
  const user = useSelector((state) => state.user.user);
  const organizationId = user?.organization_id || 1; // fallback if not available
  const [selectedTeams, setSelectedTeams] = useState([]);

  const handleToggle = () => {
    setEntireOrg(!entireOrg);
    if (!entireOrg) setTeamIds([]);
  };

  const handleTeamSelect = (teamId) => {
    setTeamIds((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleSave = () => {
    const payload = {
      sequence_id: sequenceId,
      name: sequenceName,
      entire_org: entireOrg,
      organization_id: organizationId,
      team_ids: entireOrg ? [] : teamIds,
    };
    if (isEditing && sequenceId) {
      dispatch(updateShare({ sequence_id: sequenceId, data: payload }));
    } else {
      dispatch(createShare(payload));
    }
  };

  return (
    <div className="share-sequence-container mt-5">
      <h2>Share Sequence</h2>
      <div className='d-flex mt-3 pt-2'>
        <div className='ms-3 me-3 text-end' >
            <div>
                <label htmlFor="sequenceName" style={{marginBottom: "4px"}}>Name</label>
            </div>
            <div>
                <label style={{marginTop: "12px", marginBottom: "4px"}}>Share with entire Organization</label>
            </div>
            <div>
                <label style={{marginTop: "5px"}}> Share with Specific Teams</label>
            </div>
            
            
            

        </div>

        <div>

        

      

      <div className="form-group">
        
        <input
          type="text"
          id="sequenceName"
          value={sequenceName}
          onChange={(e) => setSequenceName(e.target.value)}
        />
      </div>

      <div className="form-group toggle-group">
        
        <input
          type="checkbox"
          checked={shareWithOrg}
          onChange={handleToggle}
        />
      </div>

      <div className="form-group mt-5">
        
        <div className="team-options">
          {teams.map((team) => (
            <label key={team} className="team-option">
              <input
                type="checkbox"
                disabled={shareWithOrg}
                checked={selectedTeams.includes(team)}
                onChange={() => handleTeamSelect(team)}
              />
              {team}
            </label>
          ))}
        </div>
      </div>

      </div>
      </div>

      <div className="button-group">
        <button type="button" onClick={() => console.log('Cancelled')}>
          Cancel
        </button>
        <button type="button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default ShareSequenceForm;
