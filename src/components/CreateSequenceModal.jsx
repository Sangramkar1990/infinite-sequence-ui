import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateSequenceModal = ({ show, onClose }) => {
  const [newSequence, setNewSequence] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  const handleCreateSequence = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
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
        const result = await response.json();
        // console.log('Sequence created:', result);
        setNewSequence({ name: '', description: '' });
        onClose();
        navigate('/flow-viewer'); // Navigate back to flow viewer
      } else {
        console.error('Failed to create sequence');
      }
    } catch (error) {
      console.error('Error creating sequence:', error);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Sequence</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="sequenceName" className="form-label">Sequence Name</label>
              <input
                type="text"
                className="form-control"
                id="sequenceName"
                value={newSequence.name}
                onChange={(e) => setNewSequence({...newSequence, name: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="sequenceDescription" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="sequenceDescription"
                rows="3"
                value={newSequence.description}
                onChange={(e) => setNewSequence({...newSequence, description: e.target.value})}
              ></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleCreateSequence}>Create Sequence</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSequenceModal;