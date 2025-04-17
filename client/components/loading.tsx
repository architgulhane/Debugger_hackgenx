
import React from 'react';
import { FaRocket } from 'react-icons/fa';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="mb-2 animate-pulse">
        <FaRocket size={30} className="text-gray-600" />
      </div>

      <div>
        <span className="text-gray-500 text-sm">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default LoadingScreen;
