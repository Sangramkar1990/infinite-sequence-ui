import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser, updateProfile } from '../store/userSlice';

const ranks = ['white', 'blue', 'purple', 'brown', 'black'];

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [formData, setFormData] = useState({ name: '', dateOfBirth: '', rank: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        dateOfBirth: user.DOB || '',
        rank: user.rank || '',
      });
    }
  }, [user]);

  if (!user) return <div>Loading...</div>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
  };

  return (
    <div>
      <h4>Profile</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">BirthDate</label>
          
          <input
            className="form-control"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Rank</label>
          <select
            className="form-control"
            name="rank"
            value={formData.rank}
            onChange={handleChange}
          >
            <option value="">Select rank</option>
            {ranks.map((rank) => (
              <option key={rank} value={rank}>
                {rank.charAt(0).toUpperCase() + rank.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;