import React, { useEffect, useState } from 'react';
import { membershipService } from '../services/api';
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom"; 

const Roles = () => {
  const [members, setMembers] = useState([]);
  const [roles, setRoles] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    membershipService.getAllMemberships().then(res => {
      if (res.success) {
        setMembers(res.memberships);
        // Initialize roles state
        const initialRoles = {};
        res.memberships.forEach(m => {
          initialRoles[m.id] = m.role;
        });
        console.log("Initial roles:", initialRoles);
        setRoles(initialRoles);
      }
      setLoading(false);
    });
  }, []);

  const handleRoleChange = (id, value) => {
    setRoles(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    // Find organizationId from first member (assuming all same org)
    const organizationId = members[0]?.organization_id;
    const updates = members.map(m => ({
      memberId: m.id,
      role: roles[m.id]
    }));
    const res = await membershipService.updateRoles(organizationId, updates);
    if (res.success) {
      setMessage('Roles updated successfully!');
    } else {
      setMessage(res.message || 'Error updating roles');
    }
    setSaving(false);
  };

  // Filtered members based on search
  const filteredMembers = members.filter(member => {
    const q = search.toLowerCase();
    return (
      member.name?.toLowerCase().includes(q) ||
      member.email?.toLowerCase().includes(q)
    );
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className='p-4 m-5 d-flex flex-column'>
      <h1>Manage Member Roles</h1>
      {message && <div style={{ margin: '10px 0', color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}
      <div className='m-5 p-5'>
        <input
          type='text'
          className='form-control mb-4 mx-auto'
          placeholder='Search by name or email...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 350 }}
        />
        <div className='d-flex'>
          <button className='ms-auto me-3 btn btn-primary' onClick={handleSave} disabled={saving} style={{ marginTop: 16, padding: '8px 24px', fontSize: 16 }}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
        <ul className='roles-list'>
          {filteredMembers.map(member => (
            <li key={member.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
              <div className='d-flex align-items-center mx-auto'>
                <CgProfile style={{color: "black", width: "3rem", height: "3rem" }}/>
                <div className='mx-3'>
                  <p className='roles-list-para'>{member.name} </p>
                  <p className='roles-list-para'>{member.email}</p>
                </div>
                <select
                  value={roles[member.id]}
                  onChange={e => handleRoleChange(member.id, e.target.value)}
                  style={{ flex: 1, marginRight: 10 }}
                  className='form-select'
                >
                  <option value="user">Basic User</option>
                  <option value="teamleader">Team Lead</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Roles;
