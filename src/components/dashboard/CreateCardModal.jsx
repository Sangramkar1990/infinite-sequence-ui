import { DiffIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateCardModal({ show, onClose }) {
   const navigate = useNavigate();
  const [formData, setFormData] = useState({
    video: '',
    name: '',
    type: '',
    effect: '',
    description: '',
    difficulty: '',
  });
  const [error, setError] = useState(null);
  function convertYouTubeUrlToEmbed(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      const isYouTube = hostname === 'www.youtube.com' || hostname === 'youtube.com' || hostname === 'youtu.be';
      if (!isYouTube) return url;
      if (hostname === 'youtu.be') {
        const videoId = urlObj.pathname.slice(1);
        return `https://www.youtube.com/embed/${videoId}`;
      }
      const videoId = urlObj.searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      return url;
    } catch (e) {
      return url;
    }
  }
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
          video: convertYouTubeUrlToEmbed(formData.video),
          name: formData.name,
          type: formData.type,
          effect: formData.effect,
          description: formData.description,
          difficulty: formData.difficulty,
        })
      });
      const result = await response.json();
      if (result.success) {
        
        navigate('/techniques');
        setFormData({
          video: '',
          name: '',
          type: '',
          effect: '',
          description: '',
          difficulty: '',
        });
        onClose();
      } else {
        setError(result.message || 'Failed to create card');
      }
    } catch (error) {
      setError(error.message);
    }
  };
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" style={{zIndex: 1051}}>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>&times;</button>
        <h3 className="text-xl font-bold mb-4">Create New Card</h3>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form className="space-y-4">
          {['video', 'name', 'type', 'effect','difficulty' , 'description'].map((field) => (
            <div key={field}>
              <label className="block font-medium mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              {field === 'description' ? (
                <textarea className="form-control w-full border rounded p-2" name={field} value={formData[field]} onChange={handleChange} />
              ) : field === 'type' ? (
                <select className="form-select w-full border rounded p-2" name="type" value={formData.type} onChange={handleChange}>
                  <option value="">Select Type</option>
                  {['Sweep', 'Submission', 'Guard', 'Position', 'Escape', 'Other'].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : field === 'effect' ? (
                <select className="form-select w-full border rounded p-2" name="effect" value={formData.effect} onChange={handleChange}>
                  <option value="">Select Type</option>
                  {['GI', 'No GI', 'GI and No GI'].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : field === 'difficulty' ? (
                <select className="form-select w-full border rounded p-2" name="difficulty" value={formData.difficulty} onChange={handleChange}>
                  <option value="">Select Type</option>
                  {['Beginner', 'Intermediate', 'Advanced'].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) :
              (
                <input type="text" className="form-control w-full border rounded p-2" name={field} value={formData[field]} onChange={handleChange} required={field === 'video'} />
              )}
            </div>
          ))}
        </form>
        <div className="flex justify-end gap-2 mt-6">
          <button type="button" className="btn btn-warning px-4 py-2 rounded" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-primary px-4 py-2 rounded" onClick={handleSubmit}>Create Card</button>
        </div>
      </div>
    </div>
  );
}
