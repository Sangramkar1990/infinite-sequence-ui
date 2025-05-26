import {useState}  from 'react';
import { useNavigate } from 'react-router-dom';

const CreateSequence = () => {
  const [newSequence, setNewSequence] = useState({ name: '', description: '' });
  const [nameError, setNameError] = useState('');
  const navigate = useNavigate();

  const handleCreateSequence = async () => {
    // Reset error state
    setNameError('');

    // Validate name
    if (!newSequence.name.trim()) {
      setNameError('Sequence name is required');
      return;
    }

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
        console.log('Sequence created:', result);
        // Navigate back to flow viewer with the new sequence ID
        navigate(`/flow-editor?sequenceSelected=${result.data.id}`);
      } else {
        console.error('Failed to create sequence');
      }
    } catch (error) {
      console.error('Error creating sequence:', error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3>Create New Sequence</h3>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="sequenceName" className="form-label">
                  Sequence Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${nameError ? 'is-invalid' : ''}`}
                  id="sequenceName"
                  value={newSequence.name}
                  onChange={(e) => {
                    setNewSequence({...newSequence, name: e.target.value});
                    if (e.target.value.trim()) setNameError('');
                  }}
                />
                {nameError && <div className="invalid-feedback">{nameError}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="sequenceDescription" className="form-label">
                  Description (Optional)
                </label>
                <textarea
                  className="form-control"
                  id="sequenceDescription"
                  rows="3"
                  value={newSequence.description}
                  onChange={(e) => setNewSequence({...newSequence, description: e.target.value})}
                ></textarea>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/flow-viewer')}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleCreateSequence}>Create Sequence</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSequence;