import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser, updateProfile } from '../../store/userSlice';

const ranks = ['white', 'blue', 'purple', 'brown', 'black'];
export default function Profile() {
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
      console.log('user data in profile ---->', {user} )
    }
  }, [user]);
 

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Form submitted with data:', formData);
      dispatch(updateProfile(formData));
    };

  const handleCancel = () => {
    setFormData({
      name: '',
      dateOfBirth: '',
      rank: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Profile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="rank" className="block text-sm font-medium text-gray-700 mb-2">
                Rank
              </label>
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
              {/* <input
                type="text"
                id="rank"
                name="rank"
                value={formData.rank}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your rank"
              /> */}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}