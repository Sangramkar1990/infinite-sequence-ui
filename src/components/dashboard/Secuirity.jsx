import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { logout, updatePassword } from '../../store/userSlice';

export default function Security() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    retryNewPassword: '' 
  });
   const [form, setForm] = useState({ current: '', next: '', retry: '' });
    const [error, setError] = useState('');
    
   const [success, setSuccess] = useState('');
  const dispatch = useDispatch();
  const { passwordUpdateStatus, error: userError } = useSelector(state => state.user);
  // setError(userError);
  const navigate = useNavigate(); 

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      // userError = '';
      setSuccess('');
      if (!form.current || !form.next || !form.retry) {
        setError('All fields are required.');
        return;
      }
      if (form.next !== form.retry) {
        setError('New passwords do not match.');
        return;
      }
      const resultAction = await  dispatch(updatePassword({ oldPassword: form.current, newPassword: form.next }));
      // console.log("result action", {resultAction});
      if (updatePassword.fulfilled.match(resultAction)) {
        setSuccess('Password updated successfully. Please log in with your new password.');
        setForm({ current: '', next: '', retry: '' });
        dispatch(logout());
        navigate('/login');
      } else {
        setError(resultAction.payload || resultAction.error?.message || 'Failed to update password.');
      }
    };

  const handleCancel = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      retryNewPassword: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security</h2>
          {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      {/* {userError && <div className="alert alert-danger">{userError}</div>} */}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="current"
                value={form.current} 
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter current password"
              />
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="next"
                value={form.next} 
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.newPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter new password"
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="retryNewPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Retry New Password
              </label>
              <input
                type="password"
                id="retryNewPassword"
                name="retry"
                value={form.retry}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.retryNewPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm new password"
              />
              {errors.retryNewPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.retryNewPassword}</p>
              )}
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
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}