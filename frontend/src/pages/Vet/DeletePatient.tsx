import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DeletePatient: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/animals/with-details')
      .then(res => res.json())
      .then(data => {
        setPatients(data);
        setFilteredPatients(data);
      });
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = patients.filter(patient => 
      patient.Name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const handleDelete = async (animalId: number) => {
    if (!window.confirm('Bu hayvanı silmek istediğinize emin misiniz?')) return;
    const response = await fetch(`http://localhost:5000/api/animals/${animalId}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (data.success) {
      setFilteredPatients(prev => prev.filter(p => p.AnimalID !== animalId));
      setPatients(prev => prev.filter(p => p.AnimalID !== animalId));
      setMessage('Hasta başarıyla silindi!');
    } else {
      setMessage(data.message || 'Silme işlemi başarısız!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-12 bg-[#d68f13] rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">❌</span> Hasta Sil
              </h2>
              <p className="text-sm text-gray-500">Sistemdeki bir hastayı kalıcı olarak silin</p>
            </div>
          </div>
          <Link
            to="/animal-process"
            className="bg-[#d68f13] text-white px-6 py-3 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <span>←</span>
            <span>Geri Dön</span>
          </Link>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mb-6 p-4 rounded-xl bg-green-100 text-green-800 text-center font-semibold">{message}</div>
        )}

        {/* Ana Kart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Hasta ismi ile arama yapın..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d68f13] focus:border-[#d68f13] transition duration-300"
            />
          </div>

          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <div 
                key={patient.AnimalID}
                className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-red-300 transition duration-300 cursor-pointer flex justify-between items-center"
                onClick={() => handleDelete(patient.AnimalID)}
              >
                <span className="text-lg font-semibold text-gray-800">
                  {patient.Name}
                </span>
                <button
                  className="text-red-600 hover:text-red-800 font-semibold px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition"
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete(patient.AnimalID);
                  }}
                >
                  Sil
                </button>
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