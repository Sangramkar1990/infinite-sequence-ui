import React from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const user = useSelector((state) => state.user.user);
  if (!user) return <div>Loading...</div>;
  return (
    <div>
      <h4>Profile</h4>
      <form>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input className="form-control" value={user.name || ''} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">BirthDate</label>
          <input className="form-control" value={user.dateOfBirth || ''} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Rank</label>
          <input className="form-control" value={user.rank || ''} readOnly />
        </div>
      </form>
    </div>
  );
};

export default Profile;