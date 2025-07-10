import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CreateCardPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const sequence = useSelector((state) =>  {console.log("redux card:", 
    {state:state.flowEditor.currentSequence}
  );return state.flowEditor.currentSequence});
  let is_sequence_set = Object.keys(sequence).length > 0 ? true : false;
  console.log("is_sequence", is_sequence_set);

  console.log("sequence redux", sequence);
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
  function convertYouTubeUrlToEmbed(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    const isYouTube =
      hostname === 'www.youtube.com' ||
      hostname === 'youtube.com' ||
      hostname === 'youtu.be';

    if (!isYouTube) {
      return url; // Not a YouTube URL, return unchanged
    }

    // Handle youtu.be short links
    if (hostname === 'youtu.be') {
      const videoId = urlObj.pathname.slice(1); // e.g., /Rl_HF2ndUZc → Rl_HF2ndUZc
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Handle standard watch URLs
    const videoId = urlObj.searchParams.get('v');
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url; // Return original if no valid video ID
  } catch (e) {
    return url; // Invalid URL format
  }
}


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
          description: formData.description
        })
      });

      const result = await response.json();

      if (result.success) {
        console.log("added card data", {result})
        is_sequence_set ? navigate('/flow-editor?sequenceSelected='+sequence.id+'&cardId='+result.data.id) : navigate('/flow-editor');
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
      <div  className="d-flex g-3 mx-5 my-4 py-4 " style={{paddingLeft:"10rem", paddingRight: "10rem"}} >
        <div className="d-flex flex-column pe-2">
        {['video', 'name', 'type', 'effect', 'description'].map((field) => (
          <div className=" mb-4 align-items-center" style={{marginTop: "6px"}} key={field}>
            <div className="col3 text-end">
            <label className="form-label ">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            </div> 
          </div>
        ))}
        </div>
        <div className="d-flex flex-column " style={{width: "80%"}}>
        {['video', 'name', 'type', 'effect', 'description'].map((field) => (
          <div className="col-9 mb-4">

            
          {field === 'description' ? (<textarea
          className="form-control"
          name={field}
          value={formData[field]}
          onChange={handleChange}
        /> ) :
        field === 'type' ? (<select
          className="form-select"
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="">Select Type</option>
          {['Sweep', 'Submission', 'Guard', 'Position', 'Escape', 'Other'].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>) 
        :
        field === 'effect' ? (<select
          className="form-select"
          name="effect"
          value={formData.effect}
          onChange={handleChange}
        >
          <option value="">Select Type</option>
          {[ 'GI', 'No GI', 'GI and No GI'].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>)
        :(<input
          type="text"
          className="form-control"
          name={field}
          value={formData[field]}
          onChange={handleChange}
          required={field === 'video'}
        />)}
        </div>
        ))}
        </div>
      </div>
        <div className="d-flex flex-row-reverse">
        
      <button className="btn btn-primary mt-3 me-3" onClick={handleSubmit}>
        Create Card
      </button>
      <button className="btn btn-warning mt-3 me-3" onClick={()=> navigate(-1)}>
        Cancel
      </button>

        </div>

      
    </div>
  );
};

export default CreateCardPage;