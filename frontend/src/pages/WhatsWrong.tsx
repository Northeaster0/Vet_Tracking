import React from 'react';
import { Link } from 'react-router-dom';

const WhatsWrong: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/patientDashboard" 
          className="text-blue-600 hover:text-blue-800 text-3xl font-bold mb-4 inline-block"
        >
          ←
        </Link>
      </div>
    </div>
  );
};

export default WhatsWrong; 