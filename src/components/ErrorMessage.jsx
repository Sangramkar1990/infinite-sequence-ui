import React, { useState, useEffect } from 'react';

const ErrorMessage = ({ message, duration = 20000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
      <p>{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          if (onClose) {
            onClose();
          }
        }}
        className="absolute top-1 right-2 text-white text-lg font-bold"
      >
        &times;
      </button>
    </div>
  );
};

export default ErrorMessage;