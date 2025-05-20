import React from 'react';
import { useNavigate } from 'react-router-dom';

const onCallVeterinarians = [
  { day: 'Pazartesi', clinic: 'Dostlar Veteriner Kliniği' },
  { day: 'Salı', clinic: 'Canlar Veteriner Kliniği' },
  { day: 'Çarşamba', clinic: 'Patiler Veteriner Kliniği' },
  { day: 'Perşembe', clinic: 'Hayat Veteriner Kliniği' },
  { day: 'Cuma', clinic: 'Şifa Veteriner Kliniği' },
  { day: 'Cumartesi', clinic: 'Mutlu Patiler Kliniği' },
  { day: 'Pazar', clinic: 'Acil Vet Kliniği' },
];

const VeterinarianOnCall: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 text-3xl font-bold mb-4 inline-block"
        >
          ←
        </button>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">7 Gün Nöbetçi Veterinerler</h2>
          <div className="space-y-4">
            {onCallVeterinarians.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">{item.day}</span>
                <span className="text-md text-gray-700">{item.clinic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VeterinarianOnCall; 