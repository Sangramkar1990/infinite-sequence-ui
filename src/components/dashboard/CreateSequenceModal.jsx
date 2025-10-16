import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateSequenceModal({ show, onClose }) {
  const [newSequence, setNewSequence] = useState({ name: '', description: '' });
  const [nameError, setNameError] = useState('');
     const navigate = useNavigate();

  const handleCreateSequence = async () => {
    setNameError('');
    if (!newSequence.name.trim()) {
      setNameError('Sequence name is required');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setNameError('No authentication token found');
        return;
      }
      const response = await fetch('http://localhost:5001/api/sequences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSequence),
      });
      if (response.ok) {
        setNewSequence({ name: '', description: '' });
        navigate('/sequences');
        onClose();
      } else {
        setNameError('Failed to create sequence');
      }
    } catch (error) {
      setNameError('Error creating sequence');
    }
  };
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>&times;</button>
        <h3 className="text-xl font-bold mb-4">Create New Sequence</h3>
        <div className="mb-4">
          <label className="block font-medium mb-1">Sequence Name <span className="text-red-500">*</span></label>
          <input type="text" className={`form-control w-full border rounded p-2 ${nameError ? 'border-red-500' : ''}`} value={newSequence.name} onChange={(e) => { setNewSequence({ ...newSequence, name: e.target.value }); if (e.target.value.trim()) setNameError(''); }} />
          {nameError && <div className="text-red-500 mt-1">{nameError}</div>}
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Description (Optional)</label>
          <textarea className="form-control w-full border rounded p-2" rows="3" value={newSequence.description} onChange={(e) => setNewSequence({ ...newSequence, description: e.target.value })}></textarea>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button type="button" className="btn btn-secondary px-4 py-2 rounded" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-primary px-4 py-2 rounded" onClick={handleCreateSequence}>Create Sequence</button>
        </div>
      </div>
    </div>
  );
}
