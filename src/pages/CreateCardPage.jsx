import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateCardPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    youtube: '',
    name: '',
    type: '',
    effect: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('http://localhost:5001/api/sequences/create-card', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: formData.youtube,
          name: formData.name,
          type: formData.type,
          effect: formData.effect,
          description: formData.description
        })
      });

      const result = await response.json();

      if (result.success) {
        navigate('/flow-editor');
      } else {
        setError(result.message || 'Failed to create card');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error creating card:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Create New Card</h3>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="row g-3">
        {['youtube', 'name', 'type', 'effect', 'description'].map((field) => (
          <div className="col-md-6" key={field}>
            <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="text"
              className="form-control"
              name={field}
              value={formData[field]}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3" onClick={handleSubmit}>
        Create Card
      </button>
    </div>
  );
};

export default CreateCardPage;