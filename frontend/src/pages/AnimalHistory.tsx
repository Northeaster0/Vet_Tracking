import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Örnek veriler (ileride API'den gelecek)
const prescriptions = [
  { id: 1, name: 'Amoklavin 250mg', usage: '1 tablet sabah-akşam', date: '2025-03-21' },
  { id: 2, name: 'Rimadyl 50mg', usage: 'Günde 1 defa', date: '2025-01-04' },
  { id: 3, name: 'Fiprofort Plus', usage: 'Haftada 1', date: '2024-12-11' }
];

const procedures = [
  { id: 1, name: 'Sol arka bacak dikiş', date: '2025-02-15' },
  { id: 2, name: 'Genel muayene', date: '2025-01-05' },
  { id: 3, name: 'Kısırlaştırma operasyonu', date: '2024-11-02' }
];

const historyTypes = [
  { id: 1, name: 'Reçeteler' },
  { id: 2, name: 'İşlemler' }
];

const AnimalHistory: React.FC = () => {
  const [selectedType, setSelectedType] = useState('Reçeteler');

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link 
            to="/patientAcception" 
            className="text-blue-600 hover:text-blue-800 text-3xl font-bold"
          >
            ←
          </Link>

          <select
            value={selectedType}
            onChange={handleTypeChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
          >
            {historyTypes.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            {selectedType}
          </h2>

          <div className="space-y-4">
            {selectedType === 'Reçeteler' ? (
              prescriptions.map((prescription) => (
                <div 
                  key={prescription.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-2 md:mb-0">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {prescription.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Kullanım: {prescription.usage}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Tarih: {prescription.date}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              procedures.map((procedure) => (
                <div 
                  key={procedure.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-2 md:mb-0">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {procedure.name}
                      </h3>
                    </div>
                    <div className="text-sm text-gray-500">
                      Tarih: {procedure.date}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalHistory; 