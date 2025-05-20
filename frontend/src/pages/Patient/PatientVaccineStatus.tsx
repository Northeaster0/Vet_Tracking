import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Örnek aşı bilgileri (ileride API'den gelecek)
const vaccineStatus = [
  {
    id: 1,
    name: 'Kuduz Aşısı',
    lastDate: '2024-01-15',
    nextDate: '2025-01-15',
    status: 'Güncel',
    statusColor: 'text-green-600',
    notes: 'Yıllık tekrar gereklidir.'
  },
  {
    id: 2,
    name: 'Karma Aşı',
    lastDate: '2024-02-20',
    nextDate: '2025-02-20',
    status: 'Güncel',
    statusColor: 'text-green-600',
    notes: 'Yıllık tekrar gereklidir.'
  },
  {
    id: 3,
    name: 'Leptospirosis Aşısı',
    lastDate: '2024-03-10',
    nextDate: '2024-09-10',
    status: 'Güncel',
    statusColor: 'text-green-600',
    notes: '6 aylık tekrar gereklidir.'
  },
  {
    id: 4,
    name: 'Bordetella Aşısı',
    lastDate: '2023-12-05',
    nextDate: '2024-06-05',
    status: 'Yakında Gerekiyor',
    statusColor: 'text-yellow-600',
    notes: '6 aylık tekrar gereklidir. Yaklaşık 1 ay kaldı.'
  },
  {
    id: 5,
    name: 'Coronavirus Aşısı',
    lastDate: '2023-10-15',
    nextDate: '2024-04-15',
    status: 'Gecikmiş',
    statusColor: 'text-red-600',
    notes: '6 aylık tekrar gereklidir. Gecikme süresi: 2 ay.'
  }
];

const staticVaccines = [
  {
    id: 1,
    name: 'Kuduz Aşısı',
    status: 'Yapıldı',
    statusColor: 'text-green-600',
    date: '2024-01-15',
  },
  {
    id: 2,
    name: 'Parvo Aşısı',
    status: 'Tarihi Yaklaşıyor',
    statusColor: 'text-yellow-600',
    date: '2024-06-01',
  },
];

const PatientVaccineStatus: React.FC = () => {
  const [vaccines, setVaccines] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  // URL'den animalId parametresini al
  const searchParams = new URLSearchParams(location.search);
  const animalId = searchParams.get('animalId');

  useEffect(() => {
    if (!animalId) return;
    fetch(`http://localhost:5000/api/animals/${animalId}/vaccines`)
      .then(res => res.json())
      .then(data => setVaccines(data));
  }, [animalId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-12 bg-[#d68f13] rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">💉</span> Aşı Durumu
              </h2>
              <p className="text-sm text-gray-500">Hayvanın aşı kayıtları</p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#d68f13] text-white px-6 py-3 rounded-xl hover:bg-[#b8770f] transition duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <span>←</span>
            <span>Geri Dön</span>
          </button>
        </div>

        {/* Ana Kart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="space-y-4">
            {staticVaccines.map((vaccine) => (
              <div key={vaccine.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition duration-300 transform hover:scale-[1.01]">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <span className="text-lg font-semibold text-gray-800">{vaccine.name}</span>
                    <div className="text-sm text-gray-500 mt-1">Tarih: {vaccine.date}</div>
                  </div>
                  <span className={`${vaccine.statusColor} font-bold mt-2 md:mt-0`}>
                    {vaccine.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientVaccineStatus; 