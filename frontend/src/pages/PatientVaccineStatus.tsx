import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

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

const PatientVaccineStatus: React.FC = () => {
  const [vaccines, setVaccines] = useState<any[]>([]);
  const location = useLocation();

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/patient-dashboard" 
          className="text-blue-600 hover:text-blue-800 text-3xl font-bold mb-4 inline-block"
        >
          ←
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Aşı Durumu
          </h2>

          <div className="space-y-4">
            {vaccines.length === 0 ? (
              <p className="text-gray-600">Bu hayvana ait aşı kaydı bulunamadı.</p>
            ) : (
              vaccines.map((vaccine) => (
                <div key={vaccine.VaccineForAnimalID} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">{vaccine.Name}</span>
                  <span className={vaccine.status === 'Yapıldı' ? 'text-green-600 font-bold' : 'text-yellow-600 font-bold'}>
                    {vaccine.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientVaccineStatus; 