import React from 'react';
import { Link } from 'react-router-dom';

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
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/patientDashboard" 
          className="text-blue-600 hover:text-blue-800 text-3xl font-bold mb-4 inline-block"
        >
          ←
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Aşı Durumu
          </h2>

          <div className="space-y-4">
            {vaccineStatus.map((vaccine) => (
              <div key={vaccine.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {vaccine.name}
                    </h3>
                    <p className={`text-sm font-medium ${vaccine.statusColor}`}>
                      {vaccine.status}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">Son Aşı Tarihi:</span> {vaccine.lastDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">Sonraki Aşı Tarihi:</span> {vaccine.nextDate}
                    </p>
                  </div>
                </div>

                {vaccine.notes && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {vaccine.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Aşı Durumu Göstergeleri
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Güncel - Aşı süresi dolmamış</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-600 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Yakında Gerekiyor - 1 ay içinde yapılması gereken</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Gecikmiş - Süresi geçmiş</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientVaccineStatus; 