import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/userSlice';

const Security = () => {
  const [form, setForm] = useState({ current: '', next: '', retry: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const dispatch = useDispatch();
  const { passwordUpdateStatus, error: userError } = useSelector(state => state.user);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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

  return (
    <div>
      <h4>Change Password</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      {userError && <div className="alert alert-danger">{userError}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Current Password</label>
          <input type="password" className="form-control" name="current" value={form.current} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input type="password" className="form-control" name="next" value={form.next} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Retry Password</label>
          <input type="password" className="form-control" name="retry" value={form.retry} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary me-2">Submit</button>
        <button type="button" className="btn btn-secondary" onClick={() => setForm({ current: '', next: '', retry: '' })}>Cancel</button>
      </form>
    </div>
  );
};

export default Security;