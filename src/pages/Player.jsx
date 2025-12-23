import React from 'react';
import { useLocation } from 'react-router-dom';

const Player = () => {
  const location = useLocation();

  // Extract the YouTube embed URL from query parameters
  const queryParams = new URLSearchParams(location.search);
  const embedUrl = queryParams.get('url');

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {embedUrl ? (
        <iframe
          title="YouTube Player"
          src={embedUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <p>No video URL provided</p>
      )}
    </div>
  );
};

export default Player;