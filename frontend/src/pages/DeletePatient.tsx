import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Örnek hasta verileri (ileride veritabanından gelecek)
const patients = [
  { id: 1, name: 'Pamuk' },
  { id: 2, name: 'Karabaş' },
  { id: 3, name: 'Tekir' }
];

const DeletePatient: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(patients);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    const filtered = patients.filter(patient => 
      patient.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const handleDelete = (patientName: string) => {
    // İleride API çağrısı yapılacak
    alert(`${patientName} silindi!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/animal-process" 
          className="text-blue-600 hover:text-blue-800 text-3xl font-bold mb-4 inline-block"
        >
          ←
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Hasta Sil
          </h2>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Hasta ismi ile arama yapın..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <div 
                key={patient.id}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-red-300 transition duration-300 cursor-pointer"
                onClick={() => handleDelete(patient.name)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    {patient.name}
                  </span>
                  <button
                    className="text-red-600 hover:text-red-800 font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(patient.name);
                    }}
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              Aradığınız kriterlere uygun hasta bulunamadı.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeletePatient; 