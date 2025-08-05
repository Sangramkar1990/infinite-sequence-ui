import React, { useState } from 'react';
// import './ShareSequenceForm.css'; // Optional: for styling

const teams = [
  'Error Loading Teams',
  
];

const ShareSequenceForm = () => {
  const [sequenceName, setSequenceName] = useState('');
  const [shareWithOrg, setShareWithOrg] = useState(true);
  const [selectedTeams, setSelectedTeams] = useState([]);

  const handleToggle = () => {
    setShareWithOrg(!shareWithOrg);
    if (!shareWithOrg) setSelectedTeams([]); // Clear teams when toggling to org-wide
  };

  const handleTeamSelect = (team) => {
    setSelectedTeams((prev) =>
      prev.includes(team)
        ? prev.filter((t) => t !== team)
        : [...prev, team]
    );
  };

  const handleSave = () => {
    const payload = {
      name: sequenceName,
      shareWithOrg,
      teams: shareWithOrg ? [] : selectedTeams,
    };
    console.log('Saving sequence:', payload);
    // Add API call or state update logic here
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
