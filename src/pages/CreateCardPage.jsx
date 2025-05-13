import React, { useState } from 'react';

const CreateCardPage = ({ onCreate }) => {
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

  const handleSubmit = () => {
    onCreate(formData);
    setFormData({
      youtube: '',
      name: '',
      type: '',
      effect: '',
      description: ''
    });
  };

  return (
    <div className="container mt-4">
      <h3>Create New Card</h3>
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